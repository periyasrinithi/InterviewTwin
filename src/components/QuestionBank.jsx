import React, { useState } from 'react';
import { QUESTION_BANK, ROLES, INTERVIEW_TYPES } from '../data/questionBank';
import { BookOpen, Search, Filter, Volume2, Play, CheckCircle2, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';
import { speechSynthesisInstance } from '../services/speechSynthesis';

export default function QuestionBank({ onSelectQuestionToPractice }) {
  const [selectedRole, setSelectedRole] = useState('swe');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const roleQuestions = QUESTION_BANK[selectedRole] || {};
  let allQuestionsList = [];

  Object.keys(roleQuestions).forEach(typeKey => {
    if (selectedType === 'all' || selectedType === typeKey) {
      const qList = roleQuestions[typeKey] || [];
      allQuestionsList = [...allQuestionsList, ...qList.map(q => ({ ...q, typeKey }))];
    }
  });

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    allQuestionsList = allQuestionsList.filter(item =>
      item.question.toLowerCase().includes(q) || item.title.toLowerCase().includes(q)
    );
  }

  const handlePlayModelAudio = (questionItem) => {
    if (playingAudioId === questionItem.id) {
      speechSynthesisInstance.cancel();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(questionItem.id);
    speechSynthesisInstance.speak(questionItem.modelAnswer, {
      onEnd: () => setPlayingAudioId(null)
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <BookOpen size={16} />
            <span>Curated Question Repository</span>
          </div>
          <h1 style={{ fontSize: '2rem' }} className="gradient-text">Interview Question & Model Answer Library</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Browse industry-standard behavioral and technical questions complete with STAR framework guides and benchmark answers.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.4rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`btn ${selectedRole === role.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}
            >
              {role.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Search Input */}
        <div className="glass-panel" style={{ flex: 1, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search questions by keyword or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'white',
              outline: 'none',
              fontSize: '0.92rem'
            }}
          />
        </div>

        {/* Type Filter */}
        <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              outline: 'none',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            <option value="all" style={{ background: '#121826' }}>All Question Types</option>
            {INTERVIEW_TYPES.map(t => (
              <option key={t.id} value={t.id} style={{ background: '#121826' }}>{t.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Question List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {allQuestionsList.map(q => {
          const isExpanded = expandedId === q.id;
          const isAudioPlaying = playingAudioId === q.id;

          return (
            <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', transition: 'all 0.2s ease' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                      {q.typeKey === 'behavioral' ? 'Behavioral (STAR)' : q.typeKey === 'system_design' ? 'System Design' : 'Technical'}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>{q.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    "{q.question}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePlayModelAudio(q)}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <Volume2 size={16} color={isAudioPlaying ? 'var(--accent-cyan)' : 'white'} />
                    <span>{isAudioPlaying ? 'Stop Audio' : 'Listen Sample'}</span>
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectQuestionToPractice(q)}
                    style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                  >
                    <Play size={14} fill="white" />
                    <span>Practice Voice</span>
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: 'white', padding: '0.55rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded STAR & Model Answer View */}
              {isExpanded && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
                  
                  {/* STAR hints grid */}
                  {q.starGuide && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '0.6rem' }}>STAR RESPONSE STRUCTURE:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                          <strong style={{ color: '#818cf8', display: 'block' }}>S - Situation:</strong> {q.starGuide.situation}
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                          <strong style={{ color: '#818cf8', display: 'block' }}>T - Task:</strong> {q.starGuide.task}
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                          <strong style={{ color: '#818cf8', display: 'block' }}>A - Action:</strong> {q.starGuide.action}
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                          <strong style={{ color: '#818cf8', display: 'block' }}>R - Result:</strong> {q.starGuide.result}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Benchmark Audio Answer Text */}
                  <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div style={{ fontWeight: 600, color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={15} />
                      <span>Benchmark Answer Script</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{q.modelAnswer}"
                    </p>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
