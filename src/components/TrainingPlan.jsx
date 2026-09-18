import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Play, Sparkles, Target, ArrowRight } from 'lucide-react';

export default function TrainingPlan({ trainingPlan = [], onLaunchReInterview }) {
  const [completedDays, setCompletedDays] = useState([1]);

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
          <span>InterviewTwin Personalized Action Engine</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }} className="gradient-text-cyan">
          Your Next 7-Day Targeted Training Plan
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '1rem' }}>
          Auto-generated practice schedule targeting your exact weaknesses (Trees, Graphs, DP, STAR Specificity). Complete daily drills and launch your Adaptive Re-Interview.
        </p>
      </div>

      {/* Days Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {trainingPlan.map((dayPlan) => {
          const isDone = completedDays.includes(dayPlan.day);
          const isDay7 = dayPlan.day === 7;

          return (
            <div
              key={dayPlan.day}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                border: isDay7 ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-glass)',
                background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(18, 24, 38, 0.7)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isDone ? '#10b981' : isDay7 ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    {dayPlan.day}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{dayPlan.title}</h3>
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
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>ACTION ITEMS:</div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {dayPlan.tasks.map((task, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>{task}</li>
                  ))}
                </ul>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
