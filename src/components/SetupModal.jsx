import React, { useState } from 'react';
import { ROLES, INTERVIEW_TYPES, EXPERIENCE_LEVELS, INTERVIEWER_PERSONAS } from '../data/questionBank';
import { Sparkles, Code, Layers, Database, TrendingUp, Users, CheckCircle2, Sliders, Play, Mic, AlertCircle } from 'lucide-react';

const ICON_MAP = {
  Code: Code,
  Layers: Layers,
  Database: Database,
  TrendingUp: TrendingUp,
  Users: Users,
};

export default function SetupModal({ onStartSession, activeConfig }) {
  const [selectedRole, setSelectedRole] = useState(activeConfig?.roleId || 'swe');
  const [selectedType, setSelectedType] = useState(activeConfig?.typeId || 'behavioral');
  const [selectedExp, setSelectedExp] = useState(activeConfig?.expId || 'senior');
  const [selectedPersona, setSelectedPersona] = useState(activeConfig?.personaId || 'professional');
  const [companyName, setCompanyName] = useState(activeConfig?.companyName || 'Google / Meta');
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [questionCount, setQuestionCount] = useState(3);
  const [micTested, setMicTested] = useState(false);
  const [testingMic, setTestingMic] = useState(false);

  const handleTestMic = () => {
    setTestingMic(true);
    setTimeout(() => {
      setTestingMic(false);
      setMicTested(true);
    }, 1500);
  };

  const handleStart = () => {
    const roleObj = ROLES.find(r => r.id === selectedRole);
    const typeObj = INTERVIEW_TYPES.find(t => t.id === selectedType);
    const expObj = EXPERIENCE_LEVELS.find(e => e.id === selectedExp);
    const personaObj = INTERVIEWER_PERSONAS.find(p => p.id === selectedPersona);

    onStartSession({
      roleId: selectedRole,
      roleName: customRoleTitle.trim() || roleObj?.name || 'Software Engineer',
      typeId: selectedType,
      typeName: typeObj?.name || 'Behavioral',
      expId: selectedExp,
      experienceLabel: expObj?.label || 'Senior',
      personaId: selectedPersona,
      persona: personaObj,
      companyName: companyName.trim() || 'Tech Enterprise',
      questionCount: parseInt(questionCount, 10)
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'inline-flex', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.88rem', fontWeight: 600, gap: '0.4rem', marginBottom: '1rem' }}>
          <Sparkles size={16} />
          <span>Configure Your AI Voice Mock Session</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.6rem' }} className="gradient-text">
          Prepare for Your Dream Interview
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1rem' }}>
          Simulate a real-time voice interview with AI. Get immediate speech speed, filler word analysis, and STAR structured evaluation.
        </p>
      </div>

      {/* Configuration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* Step 1: Target Role */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>1</div>
            <h3 style={{ fontSize: '1.1rem' }}>Select Target Role</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROLES.map(role => {
              const IconComp = ICON_MAP[role.icon] || Code;
              const isSelected = selectedRole === role.id;
              return (
                <div 
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? 'white' : 'var(--text-muted)' }}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: isSelected ? 'white' : 'var(--text-main)', fontSize: '0.95rem' }}>{role.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{role.description}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={18} color="var(--accent-primary)" />}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Target Company / Employer (Optional):</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              placeholder="e.g. Google, Amazon, Stripe, Goldman Sachs"
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Step 2: Format & Experience */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>2</div>
              <h3 style={{ fontSize: '1.1rem' }}>Interview Type & Experience Level</h3>
            </div>

            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Interview Focus:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {INTERVIEW_TYPES.map(type => {
                const isSelected = selectedType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: isSelected ? 'white' : 'var(--text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {type.name}
                  </div>
                );
              })}
            </div>

            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Experience Level:</label>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem',
                marginBottom: '1.25rem'
              }}
            >
              {EXPERIENCE_LEVELS.map(exp => (
                <option key={exp.id} value={exp.id} style={{ background: '#121826' }}>{exp.label}</option>
              ))}
            </select>

            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>AI Interviewer Tone:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {INTERVIEWER_PERSONAS.map(p => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    type="button"
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)'}`,
                      color: isSelected ? '#67e8f9' : 'var(--text-muted)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Hardware Test */}
          <div style={{ marginTop: '1.5rem', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Mic size={16} color={micTested ? '#10b981' : 'var(--text-muted)'} />
              <span>{micTested ? 'Microphone verified ready' : 'Test Mic & Audio input'}</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={handleTestMic} disabled={testingMic}>
              {testingMic ? 'Testing...' : micTested ? 'Verified ✓' : 'Run Test'}
            </button>
          </div>

        </div>

      </div>

      {/* Start CTA */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleStart}
          style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: 'var(--radius-full)', boxShadow: '0 0 35px rgba(99, 102, 241, 0.6)' }}
        >
          <Play size={20} fill="white" />
          <span>Launch AI Voice Session</span>
        </button>
      </div>

    </div>
  );
}
