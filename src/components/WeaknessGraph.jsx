import React from 'react';
import { GitCommit, Cpu, MessageSquare, AlertTriangle, ShieldCheck, Sparkles, TrendingUp, ChevronRight, Play } from 'lucide-react';

export default function WeaknessGraph({ weaknessGraph, onStartDiagnostic, onGeneratePlan }) {
  // If no candidate performance data yet, render initial invitation state
  if (!weaknessGraph || !weaknessGraph.hasData) {
    return (
      <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <GitCommit size={32} />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Diagnostic Data Yet</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.75rem auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Your Interview Weakness Graph is generated dynamically <strong>after you complete your first interview turn or practice task</strong>. Perform an interview to discover your real-time skill bottlenecks!
        </p>

        {onStartDiagnostic && (
          <button
            className="btn btn-primary"
            onClick={onStartDiagnostic}
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', borderRadius: 'var(--radius-full)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
          >
            <Play size={18} fill="white" />
            <span>Launch Diagnostic Interview Session</span>
          </button>
        )}
      </div>
    );
  }

  const { overallReadiness, highLevel, dsaSubTopics, technicalSubTopics, communicationMetrics } = weaknessGraph;

  const getColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#38bdf8';
    if (val >= 45) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', margin: '1.5rem 0' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <GitCommit size={16} />
            <span>InterviewTwin Live Diagnostic Graph</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Your Real-Time Skill Bottleneck Graph</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Computed dynamically from your actual spoken interview turns & task evaluations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: getColor(overallReadiness) }}>{overallReadiness}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interview Readiness</div>
          </div>

          {onGeneratePlan && (
            <button className="btn btn-primary" onClick={onGeneratePlan} style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
              <Sparkles size={16} />
              <span>Generate 7-Day Training Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of 3 Diagnostic Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Column 1: High Level Breakdown */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} color="var(--accent-primary)" />
            <span>High-Level Performance</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(highLevel || {}).map(([key, val]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-main)' }}>{label}</span>
                    <strong style={{ color: getColor(val) }}>{val}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: getColor(val), transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: DSA Sub-Topics Granular Breakdown */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={16} color="var(--accent-cyan)" />
            <span>DSA Sub-Topic Breakdown</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(dsaSubTopics || {}).map(([key, val]) => {
              const label = key === 'dynamicProgramming' ? 'Dynamic Programming' : key === 'linkedLists' ? 'Linked Lists' : key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-main)' }}>{label}</span>
                    <strong style={{ color: getColor(val) }}>{val}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: getColor(val), transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Communication & Anti-Memorization Metrics */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={16} color="var(--accent-secondary)" />
            <span>Anti-Memorization & Delivery</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-main)' }}>Specificity & Detail Depth</span>
                <strong style={{ color: getColor(communicationMetrics?.specificity || 0) }}>{communicationMetrics?.specificity || 0}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${communicationMetrics?.specificity || 0}%`, height: '100%', background: getColor(communicationMetrics?.specificity || 0) }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-main)' }}>Evidence & Concrete Proof</span>
                <strong style={{ color: getColor(communicationMetrics?.evidence || 0) }}>{communicationMetrics?.evidence || 0}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${communicationMetrics?.evidence || 0}%`, height: '100%', background: getColor(communicationMetrics?.evidence || 0) }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-main)' }}>Personal Ownership ("I" vs "We")</span>
                <strong style={{ color: getColor(communicationMetrics?.ownership || 0) }}>{communicationMetrics?.ownership || 0}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${communicationMetrics?.ownership || 0}%`, height: '100%', background: getColor(communicationMetrics?.ownership || 0) }} />
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.8rem', color: '#fcd34d' }}>
              <strong>Generic Wording Level: {communicationMetrics?.genericWordingLevel || 'N/A'}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Evaluated live from your candidate turn transcript.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
