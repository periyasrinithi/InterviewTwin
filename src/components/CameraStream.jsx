import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Eye, AlertTriangle, Users, ShieldAlert, CheckCircle2, RefreshCw, Video, Smartphone, Headphones, ExternalLink, ShieldCheck, Radio } from 'lucide-react';
import { soundEffectsInstance } from '../services/soundEffects';
import { initProctorModels, analyzeVideoFrame } from '../services/proctorVisionService';

const PROCTOR_DEBUG = false; // Developer debug flag for testing models

export default function CameraStream({ isLive = false, onProctorWarning = () => {} }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isVirtualMode, setIsVirtualMode] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Autonomous Proctoring States
  const [eyeContactScore, setEyeContactScore] = useState(95);
  const [gazeWarning, setGazeWarning] = useState(false);
  const [extraPersonDetected, setExtraPersonDetected] = useState(false);
  const [detectedFacesCount, setDetectedFacesCount] = useState(1);
  const [deviceWarning, setDeviceWarning] = useState(null); // null | 'phone' | 'earphones'
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  const streamRef = useRef(null);
  const phoneDetectionDebounceRef = useRef(false);

  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCurrentStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Browser media API not supported.');
        setCameraActive(false);
        return;
      }

      // Query available video inputs
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(d => d.kind === 'videoinput');
        if (videoInputDevices.length === 0) {
          setCameraError('No webcam hardware detected on this PC.');
          setCameraActive(false);
          return;
        }
      } catch (enumErr) {
        console.warn('Enumerate devices warning:', enumErr);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      setCameraActive(true);
      setIsVirtualMode(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.warn('Video play error:', e);
        });
      }
    } catch (err) {
      console.warn('Camera access error details:', err.name, err.message);
      let msg = 'Camera access blocked or unavailable.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission blocked by browser.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No webcam hardware detected on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is currently in use by another app (Zoom/Teams/Discord).';
      }
      setCameraError(msg);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (cameraActive && !isVirtualMode && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(e => {
        if (e.name !== 'AbortError') console.warn('Video play error:', e);
      });
    }
  }, [cameraActive, isVirtualMode]);

  const handleEnableVirtualFeed = () => {
    stopCurrentStream();
    setCameraActive(true);
    setIsVirtualMode(true);
    setCameraError(null);
  };

  // 1. Autonomous Browser Tab Switching & Window Focus Monitor (Deduplicated)
  useEffect(() => {
    let lastTabOrBlurTime = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastTabOrBlurTime = Date.now();
        setTabSwitchCount(prev => {
          const next = prev + 1;
          soundEffectsInstance.playSubmitTone();
          onProctorWarning(`🚨 TAB_SWITCH: Interview tab was left. (Switch #${next})`);
          return next;
        });
        setTabSwitchWarning(true);
        setTimeout(() => setTabSwitchWarning(false), 4500);
      }
    };

    const handleBlur = () => {
      const now = Date.now();
      // Avoid firing duplicate event if visibilitychange already fired within 1000ms
      if (now - lastTabOrBlurTime < 1000) return;
      if (!document.hidden) {
        lastTabOrBlurTime = now;
        soundEffectsInstance.playSubmitTone();
        onProctorWarning(`⚠️ WINDOW_BLUR: Interview window lost focus.`);
        setTabSwitchWarning(true);
        setTimeout(() => setTabSwitchWarning(false), 4500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onProctorWarning]);

  // 2. Real-Time AI Computer Vision Scanner (BlazeFace + COCO-SSD)
  useEffect(() => {
    startCamera();

    let consecutiveFacesCount = 0;
    let consecutiveGazeCount = 0;
    let consecutiveDeviceCount = 0;

    let lastFaceAlertTime = 0;
    let lastGazeAlertTime = 0;
    let lastDeviceAlertTime = 0;

    initProctorModels();

    const frameAnalysisInterval = setInterval(async () => {
      // RULE: Do NOT perform AI vision inference in Virtual Feed mode or when camera inactive!
      if (!streamRef.current || isVirtualMode || !cameraActive) return;

      const videoEl = videoRef.current;
      if (!videoEl || videoEl.readyState !== 4) return;

      try {
        const result = await analyzeVideoFrame(videoEl);
        if (!result) return;

        const now = Date.now();
        const ALERT_COOLDOWN_MS = 6000;

        // 1. MULTIPLE FACES DETECTION (Real BlazeFace model face count)
        const count = result.faceCount || 1;
        setDetectedFacesCount(count);

        if (count >= 2) {
          consecutiveFacesCount++;
          if (consecutiveFacesCount >= 2) {
            setExtraPersonDetected(true);
            if (now - lastFaceAlertTime > ALERT_COOLDOWN_MS) {
              lastFaceAlertTime = now;
              soundEffectsInstance.playSubmitTone();
              onProctorWarning('🚨 MULTIPLE_FACES: Multiple people detected in the camera frame.');
            }
          }
        } else {
          consecutiveFacesCount = 0;
          setExtraPersonDetected(false);
        }

        // 2. GAZE & ATTENTION DEVIATION (BlazeFace landmarks offset)
        setEyeContactScore(result.gazeScore);
        if (result.isLookingAway) {
          consecutiveGazeCount++;
          if (consecutiveGazeCount >= 3) {
            setGazeWarning(true);
            if (now - lastGazeAlertTime > ALERT_COOLDOWN_MS) {
              lastGazeAlertTime = now;
              soundEffectsInstance.playSubmitTone();
              onProctorWarning('⚠️ GAZE_DEVIATION: Candidate attention appears to be directed away from the screen.');
            }
          }
        } else {
          consecutiveGazeCount = 0;
          setGazeWarning(false);
        }

        // 3. ELECTRONIC DEVICE & EARPHONE DETECTION (COCO-SSD model)
        if (result.hasPhone || result.hasOtherDevice || result.hasEarphones) {
          consecutiveDeviceCount++;
          if (consecutiveDeviceCount >= 2) {
            const warningType = result.hasEarphones ? 'earphones' : 'phone';
            setDeviceWarning(warningType);
            if (now - lastDeviceAlertTime > ALERT_COOLDOWN_MS) {
              lastDeviceAlertTime = now;
              soundEffectsInstance.playSubmitTone();
              const label = result.detectedDeviceLabel || 'electronic device';
              onProctorWarning(`📱 ELECTRONIC_DEVICE: A mobile ${label} was detected.`);
            }
          }
        } else {
          consecutiveDeviceCount = 0;
          setDeviceWarning(null);
        }

      } catch (e) {
        console.warn('Real AI vision frame scanning error:', e);
      }
    }, 250); // 250ms throttled cycle

    return () => {
      clearInterval(frameAnalysisInterval);
      stopCurrentStream();
    };
  }, [isVirtualMode, cameraActive]); // Run ONCE on mount to ensure smooth, glitch-free video playback!

  const handleToggleCamera = () => {
    if (cameraActive) {
      stopCurrentStream();
      setCameraActive(false);
      setIsVirtualMode(false);
    } else {
      startCamera();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>Autonomous Vision Proctoring Protocol</span>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleToggleCamera}
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
        >
          {cameraActive ? <CameraOff size={14} /> : <Camera size={14} />}
          <span>{cameraActive ? 'Turn Off' : 'Turn On'}</span>
        </button>
      </div>

      {/* Video Stream Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        borderRadius: 'var(--radius-md)',
        background: '#0a0e17',
        border: `2px solid ${(extraPersonDetected || gazeWarning || deviceWarning || tabSwitchWarning) ? '#f43f5e' : 'var(--border-glass)'}`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}>

        {/* Real Live Hardware Webcam Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            display: (cameraActive && !isVirtualMode) ? 'block' : 'none'
          }}
        />

        {/* Virtual Candidate AI Animated Stream Feed */}
        {cameraActive && isVirtualMode && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            {/* Animated Face Outline Simulation */}
            <svg width="120" height="120" viewBox="0 0 100 100">
              <ellipse cx="50" cy="45" rx="25" ry="30" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" className="animate-spin" style={{ animationDuration: '15s' }} />
              <circle cx="42" cy="40" r="3" fill="#67e8f9" />
              <circle cx="58" cy="40" r="3" fill="#67e8f9" />
              <path d="M 42 55 Q 50 62 58 55" stroke="#6366f1" strokeWidth="2" fill="none" />
              <path d="M 25 90 C 25 70, 75 70, 75 90" fill="none" stroke="#475569" strokeWidth="2" />
            </svg>
            <span style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '0.2rem', fontWeight: 600 }}>Virtual Candidate Feed (Active)</span>
          </div>
        )}

        {/* Inactive or Permission Blocked Error Banner */}
        {!cameraActive && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', maxWidth: '360px' }}>
            <CameraOff size={32} style={{ marginBottom: '0.5rem', color: '#f43f5e', opacity: 0.8 }} />
            <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, marginBottom: '0.4rem' }}>
              {cameraError || 'Webcam Stream Inactive'}
            </div>
            
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem',
              fontSize: '0.72rem',
              color: '#cbd5e1',
              marginBottom: '0.75rem',
              lineHeight: 1.45,
              textAlign: 'left'
            }}>
              <strong>How to Allow Camera Permission:</strong>
              <ol style={{ margin: '0.3rem 0 0 1.2rem', padding: 0 }}>
                <li>Click the <strong>🔒 Lock icon</strong> or <strong>Tune icon</strong> in your browser URL bar (left of <code>localhost:8080</code>).</li>
                <li>Set <strong>Camera</strong> to <strong>Allow</strong>.</li>
                <li>Click <strong>[Retry Webcam]</strong> below.</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={startCamera}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                <RefreshCw size={13} />
                <span>Retry Webcam</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleEnableVirtualFeed}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: '#6366f1', color: '#a5b4fc' }}
              >
                <Video size={13} />
                <span>Enable Virtual Feed</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Status Overlay Badges */}
        {cameraActive && (
          <>
            {/* Top Left: Faces & Tab Switches */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                color: detectedFacesCount > 1 ? '#fda4af' : '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: `1px solid ${detectedFacesCount > 1 ? 'rgba(244, 63, 94, 0.5)' : 'rgba(16, 185, 129, 0.4)'}`
              }}>
                <Users size={11} />
                <span>Faces: {detectedFacesCount}</span>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                color: tabSwitchCount > 0 ? '#fca5a5' : '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: `1px solid ${tabSwitchCount > 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(147, 197, 253, 0.3)'}`
              }}>
                <ExternalLink size={11} />
                <span>Tab Switches: {tabSwitchCount}</span>
              </div>
            </div>

            {/* Top Right: Eye Contact & Device Status */}
            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                color: eyeContactScore < 70 ? '#fcd34d' : '#67e8f9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: '1px solid var(--border-glass)'
              }}>
                <Eye size={11} />
                <span>Gaze: {eyeContactScore}%</span>
              </div>
            </div>
          </>
        )}

        {/* Active Automatic Warning Overlay Banner 1: Smartphone / Electronic Device Detected */}
        {deviceWarning === 'phone' && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)',
            zIndex: 30
          }}>
            <Smartphone size={18} />
            <span>📱 AUTOMATIC ALERT: Smartphone / Electronic Device Detected!</span>
          </div>
        )}

        {/* Active Automatic Warning Overlay Banner 2: Earphones / AirPods Detected */}
        {deviceWarning === 'earphones' && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
            color: 'white',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(192, 38, 211, 0.5)',
            zIndex: 30
          }}>
            <Headphones size={18} />
            <span>🎧 AUTOMATIC ALERT: Earphones / AirPods Detected!</span>
          </div>
        )}

        {/* Active Automatic Warning Overlay Banner 3: Tab Switch Violation */}
        {tabSwitchWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: 'white',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 -4px 15px rgba(234, 88, 12, 0.5)',
            zIndex: 30
          }}>
            <ExternalLink size={18} />
            <span>⚠️ AUTOMATIC ALERT: Turned Away / Tab Switch Detected!</span>
          </div>
        )}

        {/* Active Automatic Warning Overlay Banner 4: Eye Gaze Deviation */}
        {gazeWarning && !deviceWarning && !tabSwitchWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
            color: 'white',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            boxShadow: '0 -4px 15px rgba(239, 68, 68, 0.4)',
            zIndex: 30
          }}>
            <AlertTriangle size={18} />
            <span>⚠️ AUTOMATIC ALERT: Eye Gaze Off-Screen / Looking Away!</span>
          </div>
        )}

        {/* Active Automatic Warning Overlay Banner 5: Multiple People Detected */}
        {extraPersonDetected && !deviceWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.95) 0%, rgba(159, 18, 57, 0.95) 100%)',
            color: 'white',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.5)',
            zIndex: 30
          }}>
            <ShieldAlert size={18} />
            <span>🚨 AUTOMATIC ALERT: Extra Person / Multiple Faces Detected!</span>
          </div>
        )}

      </div>

      {/* Autonomous System Status Footer */}
      <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.73rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.03)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Radio size={12} color="#10b981" className="animate-pulse" />
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Auto-Vision Scanner: ACTIVE</span>
        </div>
        <span style={{ fontSize: '0.68rem', color: '#a5b4fc' }}>Phones • Pods • Faces • Tabs</span>
      </div>

    </div>
  );
}
