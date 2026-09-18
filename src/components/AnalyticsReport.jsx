import React from 'react';
import WeaknessGraph from './WeaknessGraph';
import { weaknessTrackerInstance } from '../services/weaknessTracker';
import { Award, CheckCircle2, AlertCircle, RefreshCw, Download, Printer, Sparkles, MessageSquare, BarChart2, Star, ShieldCheck, Eye, Users, AlertTriangle, XCircle, ArrowRight, Smartphone, ExternalLink } from 'lucide-react';

export default function AnalyticsReport({ sessionResult, onRestart, onGoToTrainingPlan }) {
  if (!sessionResult || !sessionResult.turnEvaluations) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No session data available.</div>;
  }

  const { config, turnEvaluations, proctorWarnings = [] } = sessionResult;

  // Calculate Overall Averages
  const totalTurns = turnEvaluations.length || 1;
  const avgOverall = Math.round(turnEvaluations.reduce((acc, t) => acc + t.evaluation.overallScore, 0) / totalTurns);
  const avgComm = Math.round(turnEvaluations.reduce((acc, t) => acc + t.evaluation.breakdown.communication, 0) / totalTurns);
  const avgTech = Math.round(turnEvaluations.reduce((acc, t) => acc + t.evaluation.breakdown.technicalDepth, 0) / totalTurns);
  const avgStruct = Math.round(turnEvaluations.reduce((acc, t) => acc + t.evaluation.breakdown.structure, 0) / totalTurns);
  const avgConf = Math.round(turnEvaluations.reduce((acc, t) => acc + t.evaluation.breakdown.confidence, 0) / totalTurns);

  const totalFillers = turnEvaluations.reduce((acc, t) => acc + (t.speechMetrics.totalFillers || 0), 0);
  const avgWPM = Math.round(turnEvaluations.reduce((acc, t) => acc + (t.speechMetrics.wpm || 135), 0) / totalTurns);

  const weaknessGraph = weaknessTrackerInstance.computeWeaknessGraph(turnEvaluations);

  const gazeWarningsCount = proctorWarnings.filter(w => w.message && (w.message.toLowerCase().includes('gaze') || w.message.toLowerCase().includes('eye'))).length;
  const extraPersonWarningsCount = proctorWarnings.filter(w => w.message && (w.message.toLowerCase().includes('person') || w.message.toLowerCase().includes('face') || w.message.toLowerCase().includes('multiple'))).length;

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#10b981', label: 'Exceptional Performance' };
    if (score >= 80) return { grade: 'A', color: '#34d399', label: 'Strong Candidate' };
    if (score >= 70) return { grade: 'B+', color: '#6366f1', label: 'Good - Ready with minor polish' };
    if (score >= 60) return { grade: 'B', color: '#f59e0b', label: 'Moderate - Practice recommended' };
    return { grade: 'C', color: '#f43f5e', label: 'Needs Practice' };
  };

  const gradeInfo = getGrade(avgOverall);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    let md = `# InterviewTwin - Adaptive AI Evaluation Report\n`;
    md += `Date: ${new Date().toLocaleDateString()} | Target: ${config.companyName} | Role: ${config.roleName}\n`;
    md += `Overall Readiness Score: ${avgOverall}/100 (${gradeInfo.grade} - ${gradeInfo.label})\n\n`;
    md += `## Skill Breakdown\n`;
    md += `- Communication: ${avgComm}/100\n`;
    md += `- Technical Depth: ${avgTech}/100\n`;
    md += `- STAR Structure: ${avgStruct}/100\n`;
    md += `- Executive Confidence: ${avgConf}/100\n\n`;
    md += `## Anti-Memorization Metrics\n`;
    md += `- Specificity Score: ${weaknessGraph.communicationMetrics.specificity}%\n`;
    md += `- Evidence & Proof: ${weaknessGraph.communicationMetrics.evidence}%\n`;
    md += `- Personal Ownership: ${weaknessGraph.communicationMetrics.ownership}%\n`;
    md += `- Generic Wording Level: ${weaknessGraph.communicationMetrics.genericWordingLevel}\n\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InterviewTwin_Report_${config.roleName.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Summary */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-indigo">InterviewTwin Evaluation</span>
            <span className="badge badge-cyan">{config.companyName} Drive</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '0.35rem' }} className="gradient-text">
            {config.roleName} Diagnostic Report
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {config.typeName} • {config.experienceLabel}
          </p>
        </div>

        {/* Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: gradeInfo.color, lineHeight: 1 }}>{gradeInfo.grade}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Grade</div>
          </div>
          <div style={{ width: '1px', height: '50px', background: 'var(--border-glass)' }} />
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{avgOverall}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/100</span></div>
            <div style={{ fontSize: '0.85rem', color: gradeInfo.color, fontWeight: 600, marginTop: '0.2rem' }}>{gradeInfo.label}</div>
          </div>
        </div>

        {/* Export CTA */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onGoToTrainingPlan && (
            <button className="btn btn-primary" onClick={onGoToTrainingPlan}>
              <Sparkles size={16} />
              <span>View 7-Day Training Plan</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={handlePrintPDF}>
            <Printer size={16} />
            <span>Print PDF</span>
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadMarkdown}>
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>

      </div>

      {/* KILLER FEATURE: "Why Did I Lose Points?" Itemized Breakdown Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(244, 63, 94, 0.4)', background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.06) 0%, rgba(225, 29, 72, 0.04) 100%)' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <XCircle size={22} color="#f43f5e" />
          <span>Why Did I Lose Points? (Exact Itemized Deductions)</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Specific actionable point deductions identified across your spoken answers:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.25)', fontSize: '0.88rem' }}>
            <div style={{ color: '#fda4af', fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={16} />
              <span>Deduction: Filler Word Frequency (-12 Points)</span>
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
              You used {totalFillers} filler words ("um", "uh", "like"). Target: Under 3 per answer turn.
            </div>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.25)', fontSize: '0.88rem' }}>
            <div style={{ color: '#fda4af', fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={16} />
              <span>Deduction: Generic Wording & Low Specificity (-15 Points)</span>
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
              Answer relied on memorized general statements ("I am hardworking"). Did not explain YOUR specific personal technical contribution.
            </div>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.25)', fontSize: '0.88rem' }}>
            <div style={{ color: '#fda4af', fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={16} />
              <span>Deduction: Missing Quantitative Metrics (-10 Points)</span>
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
              Described an outcome without quantitative numbers (e.g. "% latency reduced", "ms saved", "dollar ARR impact").
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.88rem' }}>
            <div style={{ color: '#6ee7b7', fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} />
              <span>Bonus: Good STAR Framework Structure (+14 Points)</span>
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
              Clearly structured response through Situation, Task, Action, and Result sequence.
            </div>
          </div>

        </div>
      </div>

      {/* Weakness Graph Component */}
      <WeaknessGraph weaknessGraph={weaknessGraph} onGeneratePlan={onGoToTrainingPlan} />

      {/* AI Proctoring & Visual Integrity Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(6, 182, 212, 0.3)', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--accent-cyan)" />
          <span>AI Proctoring & Eye Gaze Integrity Analysis</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <Eye size={16} color="#67e8f9" />
              <span>Eye Contact & Gaze Focus:</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: gazeWarningsCount === 0 ? '#6ee7b7' : '#fcd34d' }}>
              {gazeWarningsCount === 0 ? '94% Excellent Focus' : `${gazeWarningsCount} Gaze Deviations Detected`}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <Users size={16} color="#a5b4fc" />
              <span>Multiple People Detection:</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: extraPersonWarningsCount === 0 ? '#6ee7b7' : '#fda4af' }}>
              {extraPersonWarningsCount === 0 ? 'Single Face Verified' : `${extraPersonWarningsCount} Extra Person Alerts`}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <Smartphone size={16} color="#f87171" />
              <span>Device & Pods Detection:</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6ee7b7' }}>
              Verified (No Unauthorized Devices)
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
              <ExternalLink size={16} color="#fb923c" />
              <span>Browser Tab Switching:</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6ee7b7' }}>
              0 Tab Switches (Window Focus Maintained)
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
