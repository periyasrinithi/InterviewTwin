import React, { useState } from 'react';
import { courseKnowledgeInstance, DEFAULT_COURSES } from '../services/courseKnowledge';
import { GraduationCap, BookOpen, CheckCircle2, FileText, Sparkles, Upload, ShieldCheck } from 'lucide-react';

export default function CourseKnowledgeModal({ onSaveCourseConfig }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courseKnowledgeInstance.activeCourseId);
  const [customSyllabus, setCustomSyllabus] = useState(courseKnowledgeInstance.customSyllabusText);
  const [saved, setSaved] = useState(false);

  const activeCourse = DEFAULT_COURSES.find(c => c.id === selectedCourseId) || DEFAULT_COURSES[0];

  const handleSave = () => {
    courseKnowledgeInstance.setActiveCourse(selectedCourseId);
    courseKnowledgeInstance.setCustomSyllabus(customSyllabus);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSaveCourseConfig) onSaveCourseConfig(activeCourse);
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c084fc', fontSize: '0.85rem', fontWeight: 600, gap: '0.4rem', marginBottom: '1rem' }}>
          <GraduationCap size={16} />
          <span>Course Knowledge & Curriculum Evaluator</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }} className="gradient-text">
          Evaluate Spoken Answers Against Course Syllabus
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '0.98rem' }}>
          Select your course curriculum or paste your class lecture notes. The AI interviewer checks candidate answers directly against your course material!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Step 1: Select Active Course */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="var(--accent-secondary)" />
            <span>Select Course Curriculum</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {DEFAULT_COURSES.map(course => {
              const isSelected = selectedCourseId === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>{course.code}</span>
                    {isSelected && <CheckCircle2 size={18} color="var(--accent-secondary)" />}
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', marginTop: '0.4rem' }}>{course.name}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{course.instructor}</p>
                </div>
              );
            })}
          </div>

          {/* Active Course Key Concepts Preview */}
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 600, marginBottom: '0.5rem' }}>ACTIVE SYLLABUS CONCEPTS EVALUATED:</div>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {activeCourse.keyConcepts.map((kc, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{kc}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step 2: Custom Syllabus Text Uploader */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--accent-cyan)" />
              <span>Custom Lecture Notes & Syllabus (Optional)</span>
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Paste your specific university class lecture notes or exam syllabus below. The AI will evaluate candidate responses against your exact text!
            </p>

            <textarea
              rows={9}
              placeholder="Paste your course syllabus, lecture 5 notes, or exam study guide text here..."
              value={customSyllabus}
              onChange={(e) => setCustomSyllabus(e.target.value)}
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
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)', marginTop: '1.5rem', boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' }}
          >
            {saved ? <CheckCircle2 size={18} /> : <GraduationCap size={18} />}
            <span>{saved ? 'Course Knowledge Updated!' : `Apply ${activeCourse.code} Course Evaluator`}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
