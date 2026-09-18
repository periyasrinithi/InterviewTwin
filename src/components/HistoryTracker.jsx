import React from 'react';
import { History, Award, Calendar, ChevronRight, Trash2, Sparkles, Clock, BarChart3 } from 'lucide-react';

export default function HistoryTracker({ history = [], onViewSessionReport, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3.5rem 2rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--accent-primary)' }}>
            <History size={30} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>No Interview Sessions Yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
            Complete your first voice-based AI mock interview to track your performance improvement, filler word reductions, and STAR scores over time.
          </p>
        </div>
      </div>
    );
  }

  const totalSessions = history.length;
  const avgScore = Math.round(history.reduce((acc, h) => {
    const turns = h.turnEvaluations || [];
    const sessAvg = turns.reduce((a, t) => a + t.evaluation.overallScore, 0) / (turns.length || 1);
    return acc + sessAvg;
  }, 0) / totalSessions);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <History size={16} />
            <span>Practice Progress Tracker</span>
          </div>
          <h1 style={{ fontSize: '2rem' }} className="gradient-text">Past Session History & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Review past mock interview evaluations, score breakdowns, and track improvement over time.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={onClearHistory} style={{ color: '#fda4af' }}>
          <Trash2 size={16} />
          <span>Clear History</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Mock Sessions</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.3rem' }}>{totalSessions}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Overall Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.3rem' }}>{avgScore}/100</div>
        </div>
      </div>

      {/* Session List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {history.map((sess, idx) => {
          const turns = sess.turnEvaluations || [];
          const sessAvg = Math.round(turns.reduce((a, t) => a + t.evaluation.overallScore, 0) / (turns.length || 1));
          const dateStr = sess.timestamp ? new Date(sess.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : `Session ${idx + 1}`;

          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.8rem' }}>{sess.config?.roleName || 'Software Engineer'}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} />
                    <span>{dateStr}</span>
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                  {sess.config?.companyName} • {sess.config?.typeName} ({turns.length} Questions)
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: sessAvg >= 80 ? '#10b981' : sessAvg >= 70 ? '#a5b4fc' : '#f59e0b' }}>
                    {sessAvg}/100
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Score</div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => onViewSessionReport(sess)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <span>View Full Report</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
