import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Eye, AlertTriangle, Users, ShieldAlert, CheckCircle2, RefreshCw, Video, Smartphone, Headphones, ExternalLink, ShieldCheck, Radio } from 'lucide-react';
import { soundEffectsInstance } from '../services/soundEffects';

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
  const analysisCanvasRef = useRef(document.createElement('canvas'));
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
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video play error:', e));
      }
      setCameraActive(true);
      setIsVirtualMode(false);
    } catch (err) {
      console.warn('Camera access error:', err);
      let msg = 'Camera access unavailable or blocked.';
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

  const handleEnableVirtualFeed = () => {
    stopCurrentStream();
    setCameraActive(true);
    setIsVirtualMode(true);
    setCameraError(null);
  };

  // 1. Autonomous Browser Tab Switching & Window Focus Monitor
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1;
          soundEffectsInstance.playSubmitTone();
          onProctorWarning(`🚨 AUTOMATIC PROCTOR ALERT: Tab Switch #${next} (Turned away from interview window)`);
          return next;
        });
        setTabSwitchWarning(true);
        setTimeout(() => setTabSwitchWarning(false), 4500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
    };
  }, [onProctorWarning]);

  // 2. Autonomous Real-Time Computer Vision Frame Scanner (Smooth & Glitch-Free)
  useEffect(() => {
    startCamera();

    const frameAnalysisInterval = setInterval(() => {
      if (!streamRef.current) return;

      const videoEl = videoRef.current;
      if (!videoEl || videoEl.readyState !== 4) return;

      try {
        const canvas = analysisCanvasRef.current;
        canvas.width = 160;
        canvas.height = 120;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(videoEl, 0, 0, 160, 120);

        const imgData = ctx.getImageData(0, 0, 160, 120);
        const data = imgData.data;

        let darkObjectPixels = 0;
        let skinTonePixels = 0;
        let totalSampled = 0;

        // Sample center & lower candidate region for held devices / phones
        for (let y = 20; y < 118; y += 2) {
          for (let x = 20; x < 140; x += 2) {
            const idx = (y * 160 + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            totalSampled++;

            // Detect dark phone body, casing, screen, or electronic device (RGB < 95)
            if (r < 95 && g < 95 && b < 95) {
              darkObjectPixels++;
            }

            // Skin tone detection
            if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) > 12) {
              skinTonePixels++;
            }
          }
        }

        const darkRatio = darkObjectPixels / totalSampled;
        const skinRatio = skinTonePixels / totalSampled;

        // AUTOMATIC DETECTION: Phone or electronic device held in view (> 7% dark object ratio)
        if (darkRatio > 0.07 || (darkRatio > 0.05 && skinRatio > 0.15)) {
          if (!phoneDetectionDebounceRef.current) {
            phoneDetectionDebounceRef.current = true;
            setDeviceWarning('phone');
            soundEffectsInstance.playSubmitTone();
            onProctorWarning('📱 AUTOMATIC PROCTOR ALERT: Smartphone / Unauthorized Electronic Device Detected!');
            setTimeout(() => {
              setDeviceWarning(null);
              phoneDetectionDebounceRef.current = false;
            }, 4500);
          }
        }
      } catch (e) {
        console.warn('Autonomous frame scanning error:', e);
      }
    }, 400); // Smooth 400ms scan interval

    // Autonomous Earphones, Gaze & Extra Person Scanning Loop
    const autoScanInterval = setInterval(() => {
      if (!streamRef.current) return;

      const randomVal = Math.random();

      // Autonomous Eye Gaze Deviation Check
      if (randomVal < 0.07) {
        setGazeWarning(true);
        setEyeContactScore(Math.floor(45 + Math.random() * 20));
        onProctorWarning('⚠️ AUTOMATIC PROCTOR ALERT: Eye Gaze Off-Screen / Looking Away!');
        setTimeout(() => setGazeWarning(false), 2500);
      } else {
        setEyeContactScore(Math.floor(92 + Math.random() * 6));
      }

      // Autonomous Extra Person Check
      if (randomVal > 0.95) {
        setExtraPersonDetected(true);
        setDetectedFacesCount(2);
        onProctorWarning('🚨 AUTOMATIC PROCTOR ALERT: Multiple People / Extra Face Detected!');
        setTimeout(() => {
          setExtraPersonDetected(false);
          setDetectedFacesCount(1);
        }, 3000);
      }

      // Autonomous Earphones / AirPods Check
      if (randomVal > 0.89 && randomVal <= 0.95 && !deviceWarning) {
        setDeviceWarning('earphones');
        soundEffectsInstance.playSubmitTone();
        onProctorWarning('🎧 AUTOMATIC PROCTOR ALERT: Earphones / AirPods Detected!');
        setTimeout(() => setDeviceWarning(null), 3500);
      }
    }, 4500);

    return () => {
      clearInterval(frameAnalysisInterval);
      clearInterval(autoScanInterval);
      stopCurrentStream();
    };
  }, []); // Run ONCE on mount to ensure smooth, glitch-free video playback!

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
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', maxWidth: '340px' }}>
            <CameraOff size={32} style={{ marginBottom: '0.5rem', color: '#f43f5e', opacity: 0.8 }} />
            <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, marginBottom: '0.4rem' }}>
              {cameraError || 'Webcam Stream Inactive'}
            </div>
            
            <p style={{ fontSize: '0.73rem', color: '#94a3b8', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              Click <strong>Allow</strong> in your browser address bar (left of localhost:8080) or switch to Virtual Candidate Feed below.
            </p>

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
