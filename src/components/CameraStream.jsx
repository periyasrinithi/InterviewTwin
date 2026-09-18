import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Eye, AlertTriangle, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { soundEffectsInstance } from '../services/soundEffects';

export default function CameraStream({ isLive = false, onProctorWarning = () => {} }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Proctoring States
  const [eyeContactScore, setEyeContactScore] = useState(94);
  const [gazeWarning, setGazeWarning] = useState(false);
  const [extraPersonDetected, setExtraPersonDetected] = useState(false);
  const [detectedFacesCount, setDetectedFacesCount] = useState(1);
  const [totalWarnings, setTotalWarnings] = useState(0);

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
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video play error:', e));
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or blocked. Please allow webcam permissions in browser address bar.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();

    // AI Gaze & Multiple Person Detection Simulation Loop
    const interval = setInterval(() => {
      if (!streamRef.current) return;

      const randomVal = Math.random();

      // 1. Occasional Eye Gaze Deviation Simulation (15% chance during practice)
      if (randomVal < 0.15) {
        setGazeWarning(true);
        setEyeContactScore(Math.floor(45 + Math.random() * 20));
        onProctorWarning('Eye Gaze Off-Screen / Looking Away');
        setTimeout(() => setGazeWarning(false), 2500);
      } else {
        setGazeWarning(false);
        setEyeContactScore(Math.floor(90 + Math.random() * 8));
      }

      // 2. Extra Person Detection Simulation (8% chance)
      if (randomVal > 0.92) {
        setExtraPersonDetected(true);
        setDetectedFacesCount(2);
        onProctorWarning('Multiple People Detected in Camera');
        setTimeout(() => {
          setExtraPersonDetected(false);
          setDetectedFacesCount(1);
        }, 3000);
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

  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Camera size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>AI Proctoring & Gaze Detector</span>
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
        height: '210px',
        borderRadius: 'var(--radius-md)',
        background: '#0a0e17',
        border: `2px solid ${extraPersonDetected || gazeWarning ? '#f43f5e' : 'var(--border-glass)'}`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}>

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
            display: cameraActive ? 'block' : 'none'
          }}
        />

        {!cameraActive && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
            <CameraOff size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <div style={{ fontSize: '0.85rem' }}>{cameraError || 'Webcam Stream Inactive'}</div>
          </div>
        )}

        {/* Live Status Overlay Badges */}
        {cameraActive && (
          <>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              color: detectedFacesCount > 1 ? '#fda4af' : '#6ee7b7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: `1px solid ${detectedFacesCount > 1 ? 'rgba(244, 63, 94, 0.5)' : 'rgba(16, 185, 129, 0.4)'}`
            }}>
              <Users size={12} />
              <span>Faces Detected: {detectedFacesCount}</span>
            </div>

            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              color: eyeContactScore < 70 ? '#fcd34d' : '#67e8f9',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: '1px solid var(--border-glass)'
            }}>
              <Eye size={12} />
              <span>Eye Contact: {eyeContactScore}%</span>
            </div>
          </>
        )}

        {/* Active Warning Overlay Banner 1: Eye Gaze Deviation */}
        {gazeWarning && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
            color: 'white',
            padding: '0.5rem 0.75rem',
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

        {/* Active Warning Overlay Banner 2: Multiple People Detected */}
        {extraPersonDetected && (
          <div className="animate-pulse" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.95) 0%, rgba(159, 18, 57, 0.95) 100%)',
            color: 'white',
            padding: '0.5rem 0.75rem',
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

      {/* Class Presentation Demo Controls for Proctoring Warnings */}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={handleTriggerSimulatedGazeWarning}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: '#fcd34d' }}
          title="Test Eye Gaze Warning for Presentation"
        >
          <span>Test Eye Warning</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTriggerSimulatedExtraPerson}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: '#fda4af' }}
          title="Test Extra Person Warning for Presentation"
        >
          <span>Test Extra Person Warning</span>
        </button>
      </div>

    </div>
  );
}
