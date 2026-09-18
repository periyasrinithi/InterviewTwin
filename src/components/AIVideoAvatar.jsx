import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, User, Radio, Video, Sliders, ShieldCheck } from 'lucide-react';

export const AVATAR_PERSONAS = [
  { id: 'alex', name: 'Alex Vance', role: 'Senior Tech Lead & SDE Architect', theme: 'indigo', suitColor: '#312e81', hairColor: '#1e1b4b', skinColor: '#ffdfd3', bgGlow: '#6366f1' },
  { id: 'sophia', name: 'Sophia Reed', role: 'Executive HR & Behavioral Director', theme: 'emerald', suitColor: '#064e3b', hairColor: '#451a03', skinColor: '#fcd5ce', bgGlow: '#10b981' },
  { id: 'marcus', name: 'Marcus Sterling', role: 'Principal System Architect', theme: 'obsidian', suitColor: '#1c1917', hairColor: '#18181b', skinColor: '#d08c5b', bgGlow: '#f59e0b' }
];

export default function AIVideoAvatar({ state = 'idle', isSpeaking = false, selectedPersonaId = 'alex', onSelectPersona }) {
  // state: 'idle' | 'speaking' | 'listening' | 'thinking'
  const [activePersonaId, setActivePersonaId] = useState(selectedPersonaId);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blink, setBlink] = useState(false);
  const animationFrameRef = useRef(null);

  const persona = AVATAR_PERSONAS.find(p => p.id === activePersonaId) || AVATAR_PERSONAS[0];

  const handlePersonaChange = (id) => {
    setActivePersonaId(id);
    if (onSelectPersona) onSelectPersona(id);
  };

  // Lip Sync & Facial Animation Loop
  useEffect(() => {
    let frame = 0;
    let blinkTimer = 0;

    const animate = () => {
      frame++;
      blinkTimer++;

      // Eye blink every ~3.5 seconds
      if (blinkTimer % 200 < 12) {
        setBlink(true);
      } else {
        setBlink(false);
      }

      // Smooth fluid lip sync mouth animation when speaking
      if (isSpeaking || state === 'speaking') {
        const mouthOscillation = (Math.sin(frame * 0.28) + 1) * 0.5; // 0 to 1 fluid oscillation
        setMouthOpen(mouthOscillation);
      } else {
        setMouthOpen(0);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, isSpeaking]);

  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      
      {/* Avatar Header & Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Video size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>3D AI Video Avatar</span>
        </div>

        {/* Persona Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          {AVATAR_PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => handlePersonaChange(p.id)}
              style={{
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                border: 'none',
                background: activePersonaId === p.id ? 'var(--accent-primary)' : 'transparent',
                color: activePersonaId === p.id ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* HD Video Studio Canvas Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        borderRadius: 'var(--radius-lg)',
        background: 'radial-gradient(circle at 50% 30%, #1c2333 0%, #090d16 100%)',
        border: `2px solid ${state === 'speaking' ? persona.bgGlow : state === 'listening' ? '#10b981' : 'var(--border-glass)'}`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: state === 'speaking' ? `0 0 30px ${persona.bgGlow}66` : 'none',
        transition: 'all 0.3s ease'
      }}>
        
        {/* Studio Ambient Background Glow */}
        <div style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${persona.bgGlow} 0%, transparent 70%)`,
          opacity: state === 'speaking' ? 0.65 : 0.25,
          transition: 'opacity 0.3s ease'
        }} />

        {/* High-Definition 3D Vector AI Avatar SVG */}
        <svg width="240" height="240" viewBox="0 0 200 200" style={{ position: 'relative', zIndex: 2 }}>
          <defs>
            <linearGradient id={`suitGrad_${persona.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={persona.suitColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id={`skinGrad_${persona.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={persona.skinColor} />
              <stop offset="100%" stopColor="#e2a898" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Shoulders & Designer Suit */}
          <path d="M 30 200 C 30 140, 170 140, 170 200 Z" fill={`url(#suitGrad_${persona.id})`} />
          {/* Shirt & Tie/Collar */}
          <polygon points="82,145 100,185 118,145" fill="#ffffff" />
          <polygon points="94,145 100,195 106,145" fill={persona.bgGlow} />

          {/* Neck */}
          <rect x="87" y="112" width="26" height="38" rx="6" fill={`url(#skinGrad_${persona.id})`} />

          {/* Head Geometry */}
          <ellipse cx="100" cy="82" rx="43" ry="50" fill={`url(#skinGrad_${persona.id})`} />

          {/* Persona Hair Styling */}
          {persona.id === 'sophia' ? (
            <path d="M 52 85 C 48 30, 152 30, 148 85 C 155 125, 140 140, 138 120 C 130 50, 70 50, 62 120 Z" fill={persona.hairColor} />
          ) : (
            <path d="M 56 75 C 52 30, 148 30, 144 75 C 138 45, 62 45, 56 75 Z" fill={persona.hairColor} />
          )}

          {/* Glasses for Alex */}
          {persona.id === 'alex' && (
            <g stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.85">
              <rect x="68" y="70" width="24" height="18" rx="4" />
              <rect x="108" y="70" width="24" height="18" rx="4" />
              <line x1="92" y1="78" x2="108" y2="78" />
            </g>
          )}

          {/* Eyes */}
          {!blink ? (
            <>
              {/* Left Eye */}
              <ellipse cx="78" cy="78" rx="6.5" ry="7.5" fill="#ffffff" />
              <circle cx="78" cy="78" r="3.8" fill="#0f172a" />
              <circle cx="79.5" cy="76.5" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="122" cy="78" rx="6.5" ry="7.5" fill="#ffffff" />
              <circle cx="122" cy="78" r="3.8" fill="#0f172a" />
              <circle cx="123.5" cy="76.5" r="1.2" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Blinking eyes closed lines */}
              <path d="M 72 78 Q 78 82 84 78" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 116 78 Q 122 82 128 78" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M 70 67 Q 78 63 86 67" stroke={persona.hairColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M 114 67 Q 122 63 130 67" stroke={persona.hairColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* Nose */}
          <path d="M 100 80 L 97 94 L 103 94" stroke="#c48a7b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Lip-Sync Animated Mouth */}
          <ellipse
            cx="100"
            cy="108"
            rx={10 + mouthOpen * 4.5}
            ry={3.5 + mouthOpen * 7.5}
            fill="#a23b5a"
          />
          {mouthOpen > 0.25 && (
            <rect x="93" y="104" width="14" height="3.5" rx="1.5" fill="#ffffff" />
          )}

        </svg>

        {/* Audio Wave Indicator when AI Speaking */}
        {state === 'speaking' && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: `1px solid ${persona.bgGlow}`
          }}>
            <Volume2 size={14} color={persona.bgGlow} className="animate-pulse" />
            <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>{persona.name} Speaking...</span>
          </div>
        )}

      </div>

      {/* Persona Info */}
      <div style={{ marginTop: '0.75rem' }}>
        <h4 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>{persona.name}</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{persona.role}</p>
      </div>

    </div>
  );
}
