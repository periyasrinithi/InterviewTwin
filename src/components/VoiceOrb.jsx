import React from 'react';
import { Mic, Volume2, Cpu, Radio } from 'lucide-react';

export default function VoiceOrb({ state = 'idle', interviewerName = 'Alex (AI Interviewer)', volumeLevel = 0 }) {
  // state: 'idle' | 'speaking' | 'listening' | 'thinking'

  const getStateColors = () => {
    switch (state) {
      case 'speaking':
        return {
          primary: '#6366f1',
          secondary: '#06b6d4',
          glow: 'rgba(99, 102, 241, 0.6)',
          border: '#818cf8',
          statusText: 'AI Speaking...',
          icon: <Volume2 size={24} className="animate-pulse" />
        };
      case 'listening':
        return {
          primary: '#10b981',
          secondary: '#34d399',
          glow: 'rgba(16, 185, 129, 0.6)',
          border: '#6ee7b7',
          statusText: 'Listening to your response...',
          icon: <Mic size={24} className="animate-pulse" />
        };
      case 'thinking':
        return {
          primary: '#f59e0b',
          secondary: '#8b5cf6',
          glow: 'rgba(245, 158, 11, 0.6)',
          border: '#fbbf24',
          statusText: 'Evaluating response & strategy...',
          icon: <Cpu size={24} className="animate-spin" />
        };
      default:
        return {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          glow: 'rgba(99, 102, 241, 0.3)',
          border: 'rgba(255, 255, 255, 0.2)',
          statusText: 'Ready',
          icon: <Radio size={24} />
        };
    }
  };

  const colors = getStateColors();

  // Dynamic scale based on volume level or state
  const orbScale = state === 'speaking' || state === 'listening' ? 1 + Math.min(volumeLevel * 0.4, 0.35) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      
      {/* Outer Pulse Container */}
      <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Ring 3 (Outer ambient pulse) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          transform: `scale(${orbScale * 1.25})`,
          transition: 'transform 0.15s ease-out, opacity 0.3s ease',
          opacity: state === 'idle' ? 0.4 : 0.85
        }} />

        {/* Ring 2 (Rotating Dashed Orbit) */}
        <div style={{
          position: 'absolute',
          width: '88%',
          height: '88%',
          borderRadius: '50%',
          border: `2px dashed ${colors.border}`,
          animation: state === 'speaking' || state === 'thinking' ? 'spin 12s linear infinite' : 'none',
          opacity: 0.6
        }} />

        {/* Ring 1 (Inner Glowing Orb Core) */}
        <div style={{
          position: 'relative',
          width: '68%',
          height: '68%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${colors.primary} 45%, ${colors.secondary} 100%)`,
          boxShadow: `0 0 45px ${colors.glow}, inset 0 0 25px rgba(255, 255, 255, 0.5)`,
          transform: `scale(${orbScale})`,
          transition: 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          {colors.icon}
        </div>

      </div>

      {/* Interviewer Name & Status */}
      <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 600 }}>{interviewerName}</h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{colors.statusText}</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}
