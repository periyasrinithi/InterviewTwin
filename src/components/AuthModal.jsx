import React, { useState } from 'react';
import { authServiceInstance } from '../services/authService';
import { LogIn, UserPlus, Sparkles, Mail, Lock, User, Zap, Calendar, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthModal({ onAuthSuccess }) {
  const [isLoginView, setIsLoginView] = useState(false); // Default to Create Account as shown in design
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const res = authServiceInstance.login(email, password, !isLoginView ? name : null);
    if (res.success) {
      if (onAuthSuccess) onAuthSuccess(res.user);
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  const handleDemoSignIn = () => {
    const res = authServiceInstance.login('rohan.sharma@sih.edu', 'demo123');
    if (res.success && onAuthSuccess) {
      onAuthSuccess(res.user);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#090d16',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      
      {/* Outer Split Card matching Crextio Design */}
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        minHeight: '620px',
        background: '#f8fafc',
        borderRadius: '32px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        color: '#1e293b'
      }}>

        {/* LEFT PANEL: Form Controls */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)' }}>
          
          <div>
            {/* Top Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.25rem' }}>
              <img
                src="/logo.jpg"
                alt="InterviewTwin Logo"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                  Interview<span style={{ color: '#6366f1' }}>Twin</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Practice • Improve • Get Hired</span>
              </div>
            </div>

            {/* Form Title & Subtitle */}
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
              {isLoginView ? 'Welcome back' : 'Create an account'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.75rem' }}>
              {isLoginView ? 'Sign in to access your interview twin & weakness graph' : 'Sign up and get adaptive skill-gap AI coaching'}
            </p>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.65rem 0.9rem', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLoginView && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Full name</label>
                  <input
                    type="text"
                    placeholder="Amélie Laurent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '9999px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      color: '#0f172a',
                      outline: 'none',
                      fontSize: '0.9rem',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Email address</label>
                <input
                  type="email"
                  placeholder="amelielaurent7622@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    outline: 'none',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    outline: 'none',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                  }}
                  required
                />
              </div>

              {/* Submit Button (Glow Warm Yellow/Gold) */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  color: '#0f172a',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)',
                  marginTop: '0.5rem',
                  transition: 'transform 0.15s ease'
                }}
              >
                {isLoginView ? 'Sign In' : 'Submit'}
              </button>

              {/* 1-Click Presentation Demo Sign-In */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '9999px',
                  background: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Zap size={16} fill="white" />
                <span>1-Click Demo Sign-In (Rohan Sharma)</span>
              </button>
            </form>
          </div>

          {/* Bottom Switcher Links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '2rem' }}>
            <div>
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isLoginView ? 'Sign up' : 'Sign in'}
              </button>
            </div>
            <span style={{ color: '#94a3b8' }}>Terms & Conditions</span>
          </div>

        </div>

        {/* RIGHT PANEL: Sleek Professional Photo */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          margin: '0.75rem',
          background: '#0f172a'
        }}>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80"
            alt="Professional Candidate Interview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          {/* Subtle Bottom Gradient Shade for depth */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4), transparent)',
            pointerEvents: 'none'
          }} />
        </div>

      </div>

    </div>
  );
}
