import React from 'react';
import { Mic, Sparkles, BookOpen, FileText, Cpu, History, Settings, Play, ShieldCheck, GraduationCap, Target, GitCommit, Calendar, TrendingUp, UserCheck, LogIn, LogOut } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onStartNewSession, activeConfig, currentUser, onOpenAuth, onLogout }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, sticky: 'top', top: 0, zIndex: 100, padding: '0.85rem 1.75rem' }}>
      <div style={{ maxWidth: '1480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('target')}>
          <img
            src="/logo.jpg"
            alt="InterviewTwin Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              objectFit: 'cover',
              boxShadow: '0 0 18px rgba(99, 102, 241, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Interview<span className="gradient-text">Twin</span>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>AI COACH</span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>Practice • Improve • Get Hired</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.3rem 0.45rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          <button 
            className={`btn ${activeTab === 'target' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('target')}
          >
            <Target size={14} />
            <span>Placement Target</span>
          </button>

          <button 
            className={`btn ${activeTab === 'graph' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('graph')}
          >
            <GitCommit size={14} color={activeTab === 'graph' ? 'white' : '#a5b4fc'} />
            <span>Weakness Graph</span>
          </button>

          <button 
            className={`btn ${activeTab === 'plan' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('plan')}
          >
            <Calendar size={14} color={activeTab === 'plan' ? 'white' : '#67e8f9'} />
            <span>7-Day Plan</span>
          </button>

          <button 
            className={`btn ${activeTab === 'progress' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('progress')}
          >
            <TrendingUp size={14} color={activeTab === 'progress' ? 'white' : '#6ee7b7'} />
            <span>Improvement</span>
          </button>

          <button 
            className={`btn ${activeTab === 'course' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('course')}
          >
            <GraduationCap size={14} />
            <span>Course AI</span>
          </button>

          <button 
            className={`btn ${activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('resume')}
          >
            <FileText size={14} />
            <span>Resume AI</span>
          </button>
        </nav>

        {/* Right User & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Logged in User Profile Badge */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                {currentUser.name.charAt(0)}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>{currentUser.name.split(' ')[0]}</span>
              <button onClick={onLogout} title="Sign Out" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.1rem', display: 'flex', alignItems: 'center' }}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={onOpenAuth} style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}>
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          <button className="btn btn-secondary btn-icon" title="Settings" onClick={() => setActiveTab('settings')}>
            <Settings size={18} />
          </button>

          <button className="btn btn-primary" onClick={onStartNewSession} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Play size={15} fill="white" />
            <span>New Session</span>
          </button>
        </div>

      </div>
    </header>
  );
}
