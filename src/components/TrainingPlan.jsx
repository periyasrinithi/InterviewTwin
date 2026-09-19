import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Play, Sparkles, Target, ArrowRight, ExternalLink, BookOpen, DollarSign, Award, Code, Cpu, MessageSquare } from 'lucide-react';

export default function TrainingPlan({ trainingPlan = [], onLaunchReInterview }) {
  const [completedDays, setCompletedDays] = useState([1]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'free' | 'paid'

  const toggleDayComplete = (dayNum) => {
    if (completedDays.includes(dayNum)) {
      setCompletedDays(completedDays.filter(d => d !== dayNum));
    } else {
      setCompletedDays([...completedDays, dayNum]);
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(99, 102, 241, 0.12) 100%)', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.25)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#67e8f9', fontSize: '0.88rem', fontWeight: 600, gap: '0.4rem', marginBottom: '1rem' }}>
          <Sparkles size={16} />
          <span>InterviewTwin Personalized Action & Resource Engine</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }} className="gradient-text-cyan">
          Your Next 7-Day Targeted Training Plan
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.5 }}>
          Auto-generated practice schedule targeting your identified skill gaps. Complete daily tasks and explore handpicked <strong>Free (Unpaid)</strong> and <strong>Paid (Premium)</strong> external courses & practice sites.
        </p>

        {/* Resource Type Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button
            className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('all')}
            style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
          >
            <span>All Resources</span>
          </button>
          <button
            className={`btn ${filterType === 'free' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('free')}
            style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)', color: filterType === 'free' ? 'white' : '#6ee7b7' }}
          >
            <span>🟢 Free (Unpaid) Courses</span>
          </button>
          <button
            className={`btn ${filterType === 'paid' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('paid')}
            style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)', color: filterType === 'paid' ? 'white' : '#fcd34d' }}
          >
            <span>💎 Paid / Premium Platforms</span>
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {trainingPlan.map((dayPlan) => {
          const isDone = completedDays.includes(dayPlan.day);
          const isDay7 = dayPlan.day === 7;

          // Filter external resources
          const resources = (dayPlan.externalResources || []).filter(r => {
            if (filterType === 'free') return !r.isPaid;
            if (filterType === 'paid') return r.isPaid;
            return true;
          });

          return (
            <div
              key={dayPlan.day}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                border: isDay7 ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-glass)',
                background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(18, 24, 38, 0.7)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isDone ? '#10b981' : isDay7 ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    boxShadow: isDone ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                  }}>
                    {dayPlan.day}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{dayPlan.title}</h3>
                      <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>{dayPlan.targetArea}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <Clock size={13} />
                      <span>{dayPlan.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    className={`btn ${isDone ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => toggleDayComplete(dayPlan.day)}
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{isDone ? 'Completed ✓' : 'Mark Complete'}</span>
                  </button>

                  {isDay7 && (
                    <button
                      className="btn btn-primary"
                      onClick={onLaunchReInterview}
                      style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
                    >
                      <Play size={16} fill="white" />
                      <span>Launch Full Re-Interview</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>DAILY ACTION DRILLS:</div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {dayPlan.tasks.map((task, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>{task}</li>
                  ))}
                </ul>
              </div>

              {/* External Courses & Recommended Practice Sites */}
              {resources.length > 0 && (
                <div style={{ background: 'rgba(99, 102, 241, 0.04)', padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={15} color="#818cf8" />
                    <span>RECOMMENDED EXTERNAL COURSES & PRACTICE SITES (WEAKNESS-SPECIFIC):</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {resources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          background: 'rgba(15, 23, 42, 0.8)',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${res.isPaid ? 'rgba(234, 179, 8, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        className="glass-card"
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', background: res.isPaid ? 'rgba(234, 179, 8, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: res.isPaid ? '#fcd34d' : '#6ee7b7', border: `1px solid ${res.isPaid ? 'rgba(234, 179, 8, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
                              {res.isPaid ? `💎 PAID (${res.price || 'Premium'})` : '🟢 FREE (Unpaid)'}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.type}</span>
                          </div>

                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span>{res.name}</span>
                            <ExternalLink size={13} color="#a5b4fc" />
                          </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Platform: <strong>{res.platform}</strong></span>
                          <span style={{ color: 'var(--accent-cyan)' }}>Open Site ↗</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Master External Resources Catalog Showcase Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={22} color="#a5b4fc" />
          <span>Curated External Learning Platforms Matrix (Free vs Paid)</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Handpicked top platforms to target specific coding weaknesses, system design architecture, and behavioral STAR communication:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          
          {/* Free Section */}
          <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <h4 style={{ color: '#6ee7b7', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🟢 Top FREE (Unpaid) Resources</span>
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              <li><strong>NeetCode.io</strong>: Free Interactive Coding Roadmap & Video Solutions</li>
              <li><strong>TakeUForward (Striver)</strong>: A2Z Placement DSA & Dynamic Programming Sheet</li>
              <li><strong>LeetCode Free</strong>: Top 150 Interview Problem Sets</li>
              <li><strong>GitHub System Design Primer</strong>: 250k+ Stars Open Source Guide</li>
              <li><strong>MIT OpenCourseWare</strong>: 6.006 Intro to Algorithms Free Video Series</li>
            </ul>
          </div>

          {/* Paid Section */}
          <div style={{ background: 'rgba(234, 179, 8, 0.06)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
            <h4 style={{ color: '#fcd34d', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>💎 Top PAID / Premium Platforms</span>
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              <li><strong>Educative.io</strong>: Grokking the Coding Interview & System Design</li>
              <li><strong>AlgoExpert.io</strong>: 160 Handpicked Coding Questions & SystemsExpert</li>
              <li><strong>Udemy Masterclasses</strong>: Abdul Bari DSA & Executive Interview Answers (~$14)</li>
              <li><strong>LeetCode Premium</strong>: Company-Specific TCS/Google Mock Exams</li>
              <li><strong>ByteByteGo</strong>: System Design Interview Insider's Guide</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
