import React, { useState } from 'react';
import { TOPIC_CATEGORIES, TOPIC_QUESTIONS } from '../data/topicQuestions';
import { Cpu, Coffee, Layers, Database, Globe, Cloud, Terminal, Play, Volume2, Sparkles, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { speechSynthesisInstance } from '../services/speechSynthesis';

const ICON_MAP = {
  Cpu: Cpu,
  Coffee: Coffee,
  Layers: Layers,
  Database: Database,
  Globe: Globe,
  Cloud: Cloud,
  Terminal: Terminal
};

export default function TopicPractice({ onStartTopicSession }) {
  const [activeTopicId, setActiveTopicId] = useState('dsa');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const activeTopicObj = TOPIC_CATEGORIES.find(t => t.id === activeTopicId) || TOPIC_CATEGORIES[0];
  const activeQuestions = TOPIC_QUESTIONS[activeTopicId] || TOPIC_QUESTIONS.dsa || [];

  const handlePlayAudio = (q) => {
    if (playingAudioId === q.id) {
      speechSynthesisInstance.cancel();
      setPlayingAudioId(null);
      return;
    }
    setPlayingAudioId(q.id);
    speechSynthesisInstance.speak(q.modelAnswer, {
      onEnd: () => setPlayingAudioId(null)
    });
  };

  const handleStartFullTopicSession = () => {
    onStartTopicSession({
      config: {
        roleId: activeTopicObj.id,
        roleName: activeTopicObj.name,
        typeName: 'Topic Deep Dive',
        experienceLabel: 'Technical Subject',
        companyName: 'Domain Practice'
      },
      questions: activeQuestions
    });
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Sparkles size={16} />
            <span>Targeted Domain Practice Studio</span>
          </div>
          <h1 style={{ fontSize: '2.1rem' }} className="gradient-text">Topic-Based Practice Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Master specific technical domains with curated DSA, Java, SQL, System Design, and Cloud questions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleStartFullTopicSession} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)' }}>
          <Play size={16} fill="white" />
          <span>Launch All {activeTopicObj.name.split(' ')[0]} Questions</span>
        </button>
      </div>

      {/* Grid of Topic Category Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
        {TOPIC_CATEGORIES.map(topic => {
          const IconComp = ICON_MAP[topic.icon] || Cpu;
          const isSelected = activeTopicId === topic.id;

          return (
            <div
              key={topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              className="glass-card"
              style={{
                padding: '1rem',
                cursor: 'pointer',
                background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)'}`,
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem auto', color: isSelected ? 'white' : 'var(--text-muted)' }}>
                <IconComp size={20} />
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                {topic.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {topic.name.includes('(') ? topic.name.split('(')[1].replace(')', '') : 'Deep-Dive'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Topic Question List */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className={`badge ${activeTopicObj.badgeColor}`} style={{ fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              {activeTopicObj.name}
            </span>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>Practice Questions ({activeQuestions.length})</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTopicObj.description}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeQuestions.map((q, idx) => {
            const isAudioPlaying = playingAudioId === q.id;

            return (
              <div key={q.id} style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                      {idx + 1}. {q.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{q.question}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handlePlayAudio(q)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      <Volume2 size={15} color={isAudioPlaying ? 'var(--accent-cyan)' : 'white'} />
                      <span>{isAudioPlaying ? 'Stop Audio' : 'Listen Sample'}</span>
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => onStartTopicSession({ config: { roleId: activeTopicId, roleName: activeTopicObj.name, typeName: 'Topic Session', experienceLabel: 'Technical Subject', companyName: 'Practice' }, questions: [q] })}
                      style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                    >
                      <Play size={14} fill="white" />
                      <span>Practice Voice</span>
                    </button>
                  </div>
                </div>

                {/* Key keywords */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KEY CONCEPTS:</span>
                  {q.keyKeywords.map((kw, i) => (
                    <span key={i} className="badge badge-indigo" style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Benchmark Answer Preview */}
                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: '#a5b4fc', display: 'block', marginBottom: '0.2rem' }}>MODEL ANSWER BENCHMARK:</strong>
                  {q.modelAnswer}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
