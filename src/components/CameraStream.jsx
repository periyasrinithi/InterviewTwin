import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Eye, AlertTriangle, Users, ShieldAlert, CheckCircle2, RefreshCw, Video, Smartphone, Headphones, ExternalLink } from 'lucide-react';
import { soundEffectsInstance } from '../services/soundEffects';

export default function CameraStream({ isLive = false, onProctorWarning = () => {} }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isVirtualMode, setIsVirtualMode] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Proctoring States
  const [eyeContactScore, setEyeContactScore] = useState(94);
  const [gazeWarning, setGazeWarning] = useState(false);
  const [extraPersonDetected, setExtraPersonDetected] = useState(false);
  const [detectedFacesCount, setDetectedFacesCount] = useState(1);
  const [deviceWarning, setDeviceWarning] = useState(null); // null | 'phone' | 'earphones'
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  const streamRef = useRef(null);

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

  // Toggle or start Virtual Simulation Candidate Feed
  const handleEnableVirtualFeed = () => {
    stopCurrentStream();
    setCameraActive(true);
    setIsVirtualMode(true);
    setCameraError(null);
  };

  // 1. Browser Tab Switching & Window Focus Monitor
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1;
          soundEffectsInstance.playSubmitTone();
          onProctorWarning(`Tab Switch #${next} Detected (Navigated away from interview window)`);
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

  // 2. AI Proctoring Loop (Gaze, Multiple Faces, Electronic Devices & Earphones)
  useEffect(() => {
    startCamera();

    const interval = setInterval(() => {
      if (!cameraActive) return;

      const randomVal = Math.random();

      // 1. Occasional Eye Gaze Deviation Simulation (12% chance)
      if (randomVal < 0.12) {
        setGazeWarning(true);
        setEyeContactScore(Math.floor(45 + Math.random() * 20));
        onProctorWarning('Eye Gaze Off-Screen / Looking Away');
        setTimeout(() => setGazeWarning(false), 2500);
      } else {
        setGazeWarning(false);
        setEyeContactScore(Math.floor(90 + Math.random() * 8));
      }

      // 2. Extra Person Detection Simulation (6% chance)
      if (randomVal > 0.94) {
        setExtraPersonDetected(true);
        setDetectedFacesCount(2);
        onProctorWarning('Multiple People Detected in Camera');
        setTimeout(() => {
          setExtraPersonDetected(false);
          setDetectedFacesCount(1);
        }, 3000);
      }

      // 3. Smartphone / Device Detection Simulation (5% chance)
      if (randomVal > 0.88 && randomVal <= 0.94) {
        setDeviceWarning('phone');
        soundEffectsInstance.playSubmitTone();
        onProctorWarning('Smartphone / Electronic Device Detected');
        setTimeout(() => setDeviceWarning(null), 3500);
      }

      // 4. Earphones / AirPods Detection Simulation (5% chance)
      if (randomVal > 0.83 && randomVal <= 0.88) {
        setDeviceWarning('earphones');
        soundEffectsInstance.playSubmitTone();
        onProctorWarning('Earphones / AirPods Detected');
        setTimeout(() => setDeviceWarning(null), 3500);
      }

    }, 4500);

    return () => {
      clearInterval(interval);
      stopCurrentStream();
    };
  }, []);

  const handleToggleCamera = () => {
    if (cameraActive) {
      stopCurrentStream();
      setCameraActive(false);
      setIsVirtualMode(false);
    } else {
      startCamera();
    }
  };

  const handleTriggerSimulatedGazeWarning = () => {
    setGazeWarning(true);
    setEyeContactScore(52);
    soundEffectsInstance.playSubmitTone();
    onProctorWarning('Eye Gaze Off-Screen Warning');
    setTimeout(() => setGazeWarning(false), 3000);
  };

  const handleTriggerSimulatedExtraPerson = () => {
    setExtraPersonDetected(true);
    setDetectedFacesCount(2);
    soundEffectsInstance.playSubmitTone();
    onProctorWarning('Multiple People Detected Warning');
    setTimeout(() => {
      setExtraPersonDetected(false);
      setDetectedFacesCount(1);
    }, 3500);
  };

  const handleTriggerPhoneWarning = () => {
    setDeviceWarning('phone');
    soundEffectsInstance.playSubmitTone();
    onProctorWarning('Smartphone Detected Warning');
    setTimeout(() => setDeviceWarning(null), 3500);
  };

  const handleTriggerEarphoneWarning = () => {
    setDeviceWarning('earphones');
    soundEffectsInstance.playSubmitTone();
    onProctorWarning('Earphones / AirPods Detected Warning');
    setTimeout(() => setDeviceWarning(null), 3500);
  };

  const handleTriggerTabSwitchWarning = () => {
    setTabSwitchCount(prev => prev + 1);
    setTabSwitchWarning(true);
    soundEffectsInstance.playSubmitTone();
    onProctorWarning('Tab Switch Violation Warning');
    setTimeout(() => setTabSwitchWarning(false), 4000);
  };

  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Camera size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>AI Proctoring & Vision Engine</span>
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
            transform: 'scaleX(-1)', // Mirror view
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

        {/* Active Warning Overlay Banner 1: Smartphone / Electronic Device Detected */}
        {deviceWarning === 'phone' && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
            padding: '0.45rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)'
          }}>
            <Smartphone size={16} />
            <span>📱 PROCTOR ALERT: Smartphone / Electronic Device Detected!</span>
          </div>
        )}

        {/* Active Warning Overlay Banner 2: Earphones / AirPods Detected */}
        {deviceWarning === 'earphones' && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
            color: 'white',
            padding: '0.45rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(192, 38, 211, 0.5)'
          }}>
            <Headphones size={16} />
            <span>🎧 PROCTOR ALERT: Earphones / AirPods Detected!</span>
          </div>
        )}

        {/* Active Warning Overlay Banner 3: Tab Switch Violation */}
        {tabSwitchWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: 'white',
            padding: '0.45rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 -4px 15px rgba(234, 88, 12, 0.5)'
          }}>
            <ExternalLink size={16} />
            <span>⚠️ TAB SWITCH ALERT: Turned Away from Interview Window!</span>
          </div>
        )}

        {/* Active Warning Overlay Banner 4: Eye Gaze Deviation */}
        {gazeWarning && !deviceWarning && !tabSwitchWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
            color: 'white',
            padding: '0.45rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            boxShadow: '0 -4px 15px rgba(239, 68, 68, 0.4)'
          }}>
            <AlertTriangle size={16} />
            <span>⚠️ WARNING: Eye Gaze Off-Screen / Looking Away!</span>
          </div>
        )}

        {/* Active Warning Overlay Banner 5: Multiple People Detected */}
        {extraPersonDetected && !deviceWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.95) 0%, rgba(159, 18, 57, 0.95) 100%)',
            color: 'white',
            padding: '0.45rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.5)'
          }}>
            <ShieldAlert size={16} />
            <span>🚨 PROCTOR ALERT: Extra Person / Multiple Faces Detected!</span>
          </div>
        )}

      </div>

      {/* Presentation Demo Controls for Proctoring Warnings */}
      <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={handleTriggerSimulatedGazeWarning}
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', color: '#fcd34d' }}
          title="Test Eye Gaze Warning"
        >
          <span>Gaze</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTriggerSimulatedExtraPerson}
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', color: '#fda4af' }}
          title="Test Multiple Faces Warning"
        >
          <span>Faces</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTriggerPhoneWarning}
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', color: '#f87171' }}
          title="Test Phone Detection Warning"
        >
          <span>Phone</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTriggerEarphoneWarning}
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', color: '#e879f9' }}
          title="Test Earphones Detection Warning"
        >
          <span>Earphones</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTriggerTabSwitchWarning}
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', color: '#fb923c' }}
          title="Test Tab Switch Warning"
        >
          <span>Tab Switch</span>
        </button>
      </div>

    </div>
  );
}
