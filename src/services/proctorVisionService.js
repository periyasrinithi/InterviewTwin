import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as blazeface from '@tensorflow-models/blazeface';

let cocoModel = null;
let blazeModel = null;
let isInitializing = false;

/**
 * Initializes TensorFlow.js and loads BlazeFace and COCO-SSD models.
 */
export async function initProctorModels() {
  if (cocoModel && blazeModel) {
    return { cocoModel, blazeModel };
  }
  if (isInitializing) {
    return null;
  }
  isInitializing = true;
  try {
    await tf.ready();
    const [coco, blaze] = await Promise.all([
      cocoSsd.load({ base: 'lite_mobilenet_v2' }),
      blazeface.load()
    ]);
    cocoModel = coco;
    blazeModel = blaze;
    isInitializing = false;
    console.log('✅ Real AI Proctoring Models (BlazeFace + COCO-SSD) initialized successfully.');
    return { cocoModel, blazeModel };
  } catch (err) {
    console.warn('⚠️ Error loading TensorFlow proctoring models:', err);
    isInitializing = false;
    return null;
  }
}

/**
 * Performs empirical real-AI frame inference.
 * Throttled to ~200-300ms cycles.
 */
export async function analyzeVideoFrame(videoElement) {
  if (!videoElement || videoElement.readyState !== 4) {
    return null;
  }

  if (!cocoModel || !blazeModel) {
    await initProctorModels();
    if (!cocoModel || !blazeModel) return null;
  }

  try {
    // Run BlazeFace and COCO-SSD predictions concurrently (detect with low score threshold 0.25)
    const [facePredictions, objectPredictions] = await Promise.all([
      blazeModel.estimateFaces(videoElement, false),
      cocoModel.detect(videoElement, 10, 0.25)
    ]);

    // 1. Face Count Analysis
    const faceCount = facePredictions ? facePredictions.length : 0;

    // 2. Gaze / Head Pose Analysis via BlazeFace Landmarks
    let gazeScore = 95;
    let isLookingAway = false;

    if (faceCount > 0 && facePredictions[0]?.landmarks) {
      const landmarks = facePredictions[0].landmarks;
      // BlazeFace landmarks order: [rightEye, leftEye, nose, mouth, rightEar, leftEar]
      const rightEye = landmarks[0];
      const leftEye = landmarks[1];
      const nose = landmarks[2];

      if (rightEye && leftEye && nose) {
        const eyeCenterX = (rightEye[0] + leftEye[0]) / 2;
        const eyeWidth = Math.max(Math.abs(leftEye[0] - rightEye[0]), 10);
        const noseOffsetX = Math.abs(nose[0] - eyeCenterX) / eyeWidth;

        // If nose is significantly offset from center line between eyes, head/gaze is turned away
        if (noseOffsetX > 0.40) {
          gazeScore = 40;
          isLookingAway = true;
        } else {
          gazeScore = 98;
          isLookingAway = false;
        }
      }
    } else if (faceCount === 0) {
      // Candidate not in frame
      gazeScore = 20;
      isLookingAway = true;
    }

    // 3. Electronic Device Detection (Cell Phone, Mobile Phone, Laptop, Tablet, TV, Keyboard, Remote, Mouse)
    const electronicDevices = objectPredictions.filter(p => {
      const cls = p.class.toLowerCase();
      return (
        cls.includes('phone') ||
        cls.includes('cell') ||
        cls === 'laptop' ||
        cls === 'tablet' ||
        cls === 'tv' ||
        cls === 'remote' ||
        cls === 'keyboard' ||
        cls === 'mouse'
      ) && p.score >= 0.25;
    });

    const detectedPhone = electronicDevices.find(p => p.class.toLowerCase().includes('phone') || p.class.toLowerCase().includes('cell'));
    const detectedOtherDevice = electronicDevices.find(p => !p.class.toLowerCase().includes('phone') && !p.class.toLowerCase().includes('cell'));

    // 4. Earphone / Headphone Detection
    const detectedHeadphones = objectPredictions.find(p => {
      const cls = p.class.toLowerCase();
      return (cls.includes('headphone') || cls.includes('earphone')) && p.score >= 0.25;
    });

    return {
      faceCount,
      faces: facePredictions,
      objectPredictions,
      gazeScore,
      isLookingAway,
      hasPhone: !!detectedPhone,
      hasOtherDevice: !!detectedOtherDevice,
      hasEarphones: !!detectedHeadphones,
      detectedDeviceLabel: detectedPhone ? 'cell phone' : (detectedOtherDevice ? detectedOtherDevice.class : (detectedHeadphones ? 'earphones' : null))
    };
  } catch (err) {
    console.warn('Error during frame analysis:', err);
    return null;
  }
}
