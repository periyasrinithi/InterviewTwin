import React, { useState } from 'react';
import { resumeParserInstance, SAMPLE_RESUMES } from '../services/resumeParser';
import { Upload, FileText, CheckCircle2, Sparkles, Code, Play, Shield, RefreshCw, Zap } from 'lucide-react';

export default function ResumeUpload({ onStartResumeSession }) {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setResumeText(text);
      const parsed = resumeParserInstance.parseResumeText(text);
      setParsedData(parsed);
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const handleTextPasteChange = (e) => {
    const text = e.target.value;
    setResumeText(text);
    if (text.length > 50) {
      const parsed = resumeParserInstance.parseResumeText(text);
      setParsedData(parsed);
    } else {
      setParsedData(null);
    }
  };

  const handleLoadSample = (sampleKey) => {
    const sampleText = SAMPLE_RESUMES[sampleKey];
    if (!sampleText) return;
    setFileName(`Sample_${sampleKey.toUpperCase()}.txt`);
    setResumeText(sampleText);
    const parsed = resumeParserInstance.parseResumeText(sampleText);
    setParsedData(parsed);
  };

  const handleLaunchSession = () => {
    if (!parsedData) return;
    const questions = resumeParserInstance.generateTailoredQuestions(parsedData);

    onStartResumeSession({
      config: {
        roleId: 'custom_resume',
        roleName: parsedData.primaryFocus || 'Resume-Tailored Role',
        typeName: 'Resume & Behavioral Deep Dive',
        experienceLabel: 'Custom Resume Profile',
        companyName: 'Target Enterprise'
      },
      questions: questions
    });
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#67e8f9', fontSize: '0.85rem', fontWeight: 600, gap: '0.4rem', marginBottom: '1rem' }}>
          <Sparkles size={16} />
          <span>Resume-Based AI Personalization</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }} className="gradient-text-cyan">
          Upload Resume & Practice Tailored Questions
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '0.98rem' }}>
          Our AI extracts your technical stack, project accomplishments, and core skills to craft custom interview questions specifically tailored to your background.
        </p>

        {/* Quick Sample Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={14} color="#fcd34d" />
            <span>Quick Test with Sample Resume:</span>
          </span>
          <button className="btn btn-secondary" onClick={() => handleLoadSample('java_dev')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}>
            ☕ Java Backend Developer
          </button>
          <button className="btn btn-secondary" onClick={() => handleLoadSample('fullstack_swe')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}>
            ⚛️ Full-Stack Engineer
          </button>
          <button className="btn btn-secondary" onClick={() => handleLoadSample('data_engineer')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}>
            🐍 Data Engineer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: parsedData ? '1fr 1fr' : '1fr', gap: '1.5rem', transition: 'all 0.3s ease' }}>
        
        {/* Upload Zone & Text Area */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <span>Upload or Paste Your Resume</span>
          </h3>

          {/* File Drag and Drop Box */}
          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--border-glow)',
            background: 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
            marginBottom: '1.25rem',
            transition: 'all 0.2s ease'
          }}>
            <Upload size={32} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
              {fileName ? fileName : 'Click to select or drag & drop resume file'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Supports .TXT, .PDF, .DOC, .DOCX
            </span>
            <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem', margin: '0.75rem 0' }}>
            — OR PASTE RAW RESUME TEXT —
          </div>

          <textarea
            rows={8}
            placeholder="Paste your resume text here (experience, skills, projects)..."
            value={resumeText}
            onChange={handleTextPasteChange}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              outline: 'none',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              resize: 'vertical'
            }}
          />

          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <Shield size={14} />
            <span>100% Private: Resume processing runs completely inside your browser.</span>
          </div>
        </div>

        {/* Parsed Extracted Skills & Preview */}
        {parsedData && (
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Extracted Profile & Skills</h3>
                <span className="badge badge-emerald">Parsed Successfully</span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>DETECTED FOCUS:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#67e8f9' }}>{parsedData.primaryFocus}</div>
              </div>

              {/* Detected Skill Badges */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DETECTED TECH STACK ({parsedData.detectedSkills.length}):</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {parsedData.detectedSkills.length > 0 ? (
                    parsedData.detectedSkills.map((sk, idx) => (
                      <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.8rem' }}>
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>General Software Engineering</span>
                  )}
                </div>
              </div>

              {/* Project Highlights */}
              {parsedData.projectHighlights.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>RESUME HIGHLIGHTS:</div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {parsedData.projectHighlights.slice(0, 3).map((proj, i) => (
                      <li key={i} style={{ marginBottom: '0.35rem' }}>{proj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Launch Action */}
            <button
              className="btn btn-primary"
              onClick={handleLaunchSession}
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)' }}
            >
              <Play size={18} fill="white" />
              <span>Launch Resume-Tailored Mock Session</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
