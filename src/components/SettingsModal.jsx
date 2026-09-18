import React, { useState, useEffect } from 'react';
import { speechSynthesisInstance } from '../services/speechSynthesis';
import { Settings, Volume2, Mic, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

export default function SettingsModal({ onSaveSettings }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [soundEffects, setSoundEffects] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const vList = speechSynthesisInstance.getVoices();
    setVoices(vList);
    if (vList.length > 0 && !selectedVoiceName) {
      setSelectedVoiceName(speechSynthesisInstance.selectedVoice?.name || vList[0].name);
    }
  }, []);

  const handleTestVoice = () => {
    speechSynthesisInstance.setVoiceByName(selectedVoiceName);
    speechSynthesisInstance.speak('Hello! I am your AI interview coach. This is a preview of my voice synthesis.', {
      pitch: parseFloat(pitch),
      rate: parseFloat(rate)
    });
  };

  const handleSave = () => {
    speechSynthesisInstance.setVoiceByName(selectedVoiceName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <Settings size={22} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.5rem' }}>Audio & Speech Synthesis Settings</h2>
        </div>

        {/* Voice Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            AI Interviewer Voice (Text-to-Speech Engine):
          </label>
          <select
            value={selectedVoiceName}
            onChange={(e) => setSelectedVoiceName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              outline: 'none',
              fontSize: '0.92rem'
            }}
          >
            {voices.length > 0 ? (
              voices.map((v, i) => (
                <option key={i} value={v.name} style={{ background: '#121826' }}>
                  {v.name} ({v.lang})
                </option>
              ))
            ) : (
              <option style={{ background: '#121826' }}>Default System English Voice</option>
            )}
          </select>
        </div>

        {/* Sliders for Pitch and Rate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Speaking Speed Rate:</span>
              <strong style={{ color: 'white' }}>{rate}x</strong>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Voice Pitch:</span>
              <strong style={{ color: 'white' }}>{pitch}</strong>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-secondary)' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={handleTestVoice}>
            <Volume2 size={16} />
            <span>Test Voice Audio</span>
          </button>

          <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
            {saved ? <CheckCircle2 size={16} /> : <Sliders size={16} />}
            <span>{saved ? 'Settings Applied!' : 'Save Voice Preferences'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
