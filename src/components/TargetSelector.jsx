import React, { useState } from 'react';
import { TARGET_COMPANIES, TARGET_ROLES, INTERVIEW_ROUNDS } from '../data/companyProfiles';
import { Building2, Briefcase, Award, CheckCircle2, Play, Sparkles, Shield, Target, Zap } from 'lucide-react';

export default function TargetSelector({ onSelectTarget, currentConfig }) {
  const [selectedCompany, setSelectedCompany] = useState(currentConfig?.companyId || 'tcs');
  const [selectedRole, setSelectedRole] = useState(currentConfig?.roleId || 'sde');
  const [selectedRound, setSelectedRound] = useState(currentConfig?.roundId || 'full');
  const [questionCount, setQuestionCount] = useState(3);

  const companyObj = TARGET_COMPANIES.find(c => c.id === selectedCompany) || TARGET_COMPANIES[0];
  const roleObj = TARGET_ROLES.find(r => r.id === selectedRole) || TARGET_ROLES[0];
  const roundObj = INTERVIEW_ROUNDS.find(r => r.id === selectedRound) || INTERVIEW_ROUNDS[0];

  const handleLaunch = () => {
    onSelectTarget({
      companyId: selectedCompany,
      companyName: companyObj.name,
      roleId: selectedRole,
      roleName: roleObj.name,
      roundId: selectedRound,
      roundName: roundObj.name,
      questionCount: parseInt(questionCount, 10),
      typeName: `${roundObj.name} (${companyObj.name.split(' ')[0]})`,
      experienceLabel: 'Placement Candidate'
    });
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.12) 100%)', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.88rem', fontWeight: 600, gap: '0.4rem', marginBottom: '1rem' }}>
          <Target size={16} />
          <span>InterviewTwin • Placement & Enterprise Target Hub</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }} className="gradient-text">
          Configure Your Placement Interview Target
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '1rem' }}>
          Tailor your mock interview to top Indian campus placement drives & global tech companies. Select company patterns, specific roles, and interview rounds.
        </p>

        {/* Presentation Shortcut */}
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          <button
            className="btn btn-secondary"
            onClick={handleLaunch}
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <Zap size={15} color="#fcd34d" />
            <span>Quick Start {companyObj.name.split(' ')[0]} Diagnostic Interview</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Step 1: Target Company */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Building2 size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>1. Target Company</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {TARGET_COMPANIES.map(company => {
              const isSelected = selectedCompany === company.id;
              return (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)', fontSize: '0.92rem' }}>
                      {company.name}
                    </div>
                    {isSelected && <CheckCircle2 size={16} color="var(--accent-primary)" />}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {company.category} • {company.difficulty}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Role */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Briefcase size={20} color="var(--accent-secondary)" />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>2. Target Role</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {TARGET_ROLES.map(role => {
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)', fontSize: '0.92rem' }}>
                      {role.name}
                    </div>
                    {isSelected && <CheckCircle2 size={16} color="var(--accent-secondary)" />}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {role.focus}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Interview Round */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Award size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>3. Interview Round</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {INTERVIEW_ROUNDS.map(round => {
                const isSelected = selectedRound === round.id;
                return (
                  <div
                    key={round.id}
                    onClick={() => setSelectedRound(round.id)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)', fontSize: '0.92rem' }}>
                        {round.name}
                      </div>
                      {isSelected && <CheckCircle2 size={16} color="var(--accent-cyan)" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {round.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Launch CTA */}
          <button
            className="btn btn-primary"
            onClick={handleLaunch}
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
          >
            <Play size={18} fill="white" />
            <span>Launch {companyObj.name.split(' ')[0]} {roleObj.name.split(' ')[0]} Session</span>
          </button>

        </div>

      </div>

    </div>
  );
}
