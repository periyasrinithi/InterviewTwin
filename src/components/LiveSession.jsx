import React, { useState, useEffect, useRef } from 'react';
import VoiceOrb from './VoiceOrb';
import AudioVisualizer from './AudioVisualizer';
import CameraStream from './CameraStream';
import AIVideoAvatar from './AIVideoAvatar';
import { speechRecognitionInstance } from '../services/speechRecognition';
import { speechSynthesisInstance } from '../services/speechSynthesis';
import { interviewEngineInstance } from '../services/interviewEngine';
import { soundEffectsInstance } from '../services/soundEffects';
import { Mic, MicOff, Send, Volume2, HelpCircle, RefreshCw, CheckCircle, Clock, AlertTriangle, Sparkles, ChevronRight, MessageSquare, Award, Zap, Camera, ShieldAlert, Video } from 'lucide-react';

export default function LiveSession({ sessionConfig, questions = [], onFinishSession }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionState, setSessionState] = useState('question_intro'); // 'question_intro' | 'listening' | 'evaluating' | 'followup'
  const [orbState, setOrbState] = useState('speaking'); // 'idle' | 'speaking' | 'listening' | 'thinking'

  // Transcripts & Real-time Metrics
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [manualText, setManualText] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [speechMetrics, setSpeechMetrics] = useState({
    wpm: 0,
    totalWords: 0,
    totalFillers: 0,
    fillerWordCounts: {},
    durationSeconds: 0
  });

  // Proctoring Warnings Log
  const [proctorWarnings, setProctorWarnings] = useState([]);
  const [activeWarningToast, setActiveWarningToast] = useState(null);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Turn History
  const [turnEvaluations, setTurnEvaluations] = useState([]);
  const [currentFollowUp, setCurrentFollowUp] = useState(null);
  const [showStarGuide, setShowStarGuide] = useState(true);
  const [showCamera, setShowCamera] = useState(true);
  const [viewMode, setViewMode] = useState('video'); // 'video' | 'orb'

  const currentQuestion = questions[currentIdx] || questions[0];

  // Speak initial question on index or state change
  useEffect(() => {
    if (!currentQuestion) return;

    const textToSpeak = currentFollowUp ? currentFollowUp : currentQuestion.question;
    setOrbState('speaking');
    setSessionState('question_intro');

    speechSynthesisInstance.speak(textToSpeak, {
      pitch: sessionConfig?.persona?.voicePitch || 1.0,
      rate: sessionConfig?.persona?.voiceRate || 1.0,
      onStart: () => {
        setOrbState('speaking');
        setSessionState('question_intro');
      },
      onEnd: () => {
        setOrbState('idle');
        setSessionState('listening');
        startListening();
      }
    });

    return () => {
      speechSynthesisInstance.cancel();
      stopListening();
    };
  }, [currentIdx, currentFollowUp]);

  // Answer Timer effect
  useEffect(() => {
    if (isMicActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isMicActive]);

  const handleProctorWarning = (warningMessage) => {
    setProctorWarnings(prev => [...prev, { message: warningMessage, time: elapsedSeconds }]);
    setActiveWarningToast(warningMessage);
    soundEffectsInstance.playSubmitTone();
    setTimeout(() => setActiveWarningToast(null), 3000);
  };

  const startListening = () => {
    setSessionState('listening');
    setOrbState('listening');
    setIsMicActive(true);
    soundEffectsInstance.playStartMicTone();

    speechRecognitionInstance.start(
      (result) => {
        setTranscript(result.finalTranscript);
        setInterimText(result.interimTranscript);
      },
      (metrics) => {
        setSpeechMetrics(metrics);
      },
      (err) => {
        console.warn('Speech Rec error:', err);
      },
      () => {
        // Recognition ended
      }
    );
  };

  const stopListening = () => {
    speechRecognitionInstance.stop();
    setIsMicActive(false);
    if (orbState === 'listening') setOrbState('idle');
  };

  const handleToggleMic = () => {
    if (isMicActive) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Quick Demo Answer Filler for Class Presentations
  const handleLoadClassDemoAnswer = () => {
    stopListening();
    const demoText = `At my previous company, um, we had a major technical disagreement regarding database architecture. Basically, my team lead wanted to use MongoDB, but I argued for PostgreSQL due to strict ACID transaction compliance. Um, you know, instead of arguing in abstract, I spent half a day building a benchmark prototype with actual production workloads. The data demonstrated Postgres delivered 40% faster query speed for our multi-table joins. We presented the data collaboratively and launched the service with zero schema corruption.`;

    setTranscript(demoText);
    setSpeechMetrics({
      wpm: 142,
      totalWords: 78,
      totalFillers: 3,
      fillerWordCounts: { um: 2, basically: 1, 'you know': 1 },
      durationSeconds: 32
    });
    soundEffectsInstance.playSubmitTone();
  };

  const handleRephraseQuestion = () => {
    speechSynthesisInstance.cancel();
    stopListening();
    setOrbState('speaking');
    speechSynthesisInstance.speak(`Let me rephrase that: ${currentQuestion.question}`, {
      onEnd: () => {
        setOrbState('idle');
        startListening();
      }
    });
  };

  const handleEvaluateAnswer = () => {
    stopListening();
    soundEffectsInstance.playSubmitTone();
    setOrbState('thinking');
    setSessionState('evaluating');

    const finalCombinedText = (transcript + ' ' + interimText + ' ' + manualText).trim();

    // Evaluate with engine
    const evalResult = interviewEngineInstance.evaluateAnswer(
      currentQuestion,
      finalCombinedText,
      speechMetrics
    );

    if (evalResult.overallScore >= 85) {
      soundEffectsInstance.playSuccessChime();
    }

    const turnData = {
      question: currentQuestion,
      followUp: currentFollowUp,
      candidateAnswer: finalCombinedText,
      speechMetrics: { ...speechMetrics, durationSeconds: elapsedSeconds },
      evaluation: evalResult,
      proctorWarningsCount: proctorWarnings.length
    };

    const newEvaluations = [...turnEvaluations, turnData];
    setTurnEvaluations(newEvaluations);

    // AI Audio Feedback response summary
    const feedbackAudioText = `Thank you. You scored ${evalResult.overallScore} out of 100. ${evalResult.strengths[0] || ''} ${evalResult.improvements[0] || ''}`;

    speechSynthesisInstance.speak(feedbackAudioText, {
      onEnd: () => {
        setOrbState('idle');
      }
    });
  };

  const handleNextQuestion = () => {
    speechSynthesisInstance.cancel();
    stopListening();
    setCurrentFollowUp(null);
    setTranscript('');
    setInterimText('');
    setManualText('');
    setSpeechMetrics({
      wpm: 0,
      totalWords: 0,
      totalFillers: 0,
      fillerWordCounts: {},
      durationSeconds: 0
    });

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSessionState('question_intro');
    } else {
      // Session Complete!
      onFinishSession({
        config: sessionConfig,
        turnEvaluations: turnEvaluations,
        proctorWarnings: proctorWarnings
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEval = turnEvaluations[turnEvaluations.length - 1];
  const isLastQuestion = currentIdx + 1 >= questions.length;

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Session Top Status Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-indigo" style={{ fontSize: '0.85rem' }}>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {sessionConfig.roleName} ({sessionConfig.companyName})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.3)', padding: '0.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
            <button
              onClick={() => setViewMode('video')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                border: 'none',
                background: viewMode === 'video' ? 'var(--accent-primary)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              AI Video Mode
            </button>
            <button
              onClick={() => setViewMode('orb')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                border: 'none',
                background: viewMode === 'orb' ? 'var(--accent-primary)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Voice Orb Mode
            </button>
          </div>

          {/* Proctor Warnings Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: proctorWarnings.length > 0 ? '#fda4af' : 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
            <ShieldAlert size={16} />
            <span>Proctor Alerts: {proctorWarnings.length}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#67e8f9', fontSize: '0.9rem', fontWeight: 600 }}>
            <Clock size={16} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6ee7b7', fontSize: '0.9rem', fontWeight: 600 }}>
            <Award size={16} />
            <span>WPM: {speechMetrics.wpm || '--'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: speechMetrics.totalFillers > 3 ? '#fda4af' : '#fcd34d', fontSize: '0.9rem', fontWeight: 600 }}>
            <AlertTriangle size={16} />
            <span>Fillers: {speechMetrics.totalFillers || 0}</span>
          </div>
        </div>
      </div>

      {/* Active Proctor Toast Alert */}
      {activeWarningToast && (
        <div className="glass-panel animate-bounce" style={{ padding: '0.75rem 1.5rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(159, 18, 57, 0.25) 100%)', border: '1px solid rgba(239, 68, 68, 0.5)', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fda4af', fontSize: '0.9rem', fontWeight: 600 }}>
          <ShieldAlert size={18} color="#f43f5e" />
          <span>PROCTOR ALERT DETECTED: {activeWarningToast}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '1.5rem' }}>
        
        {/* Left Column: Question & Live Transcription Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Question Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-cyan" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {currentQuestion.id.includes('b') ? 'Behavioral (STAR)' : currentQuestion.id.includes('sd') ? 'System Design' : 'Technical'}
              </span>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleLoadClassDemoAnswer}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                  title="Auto-fill sample answer for class demonstration"
                >
                  <Zap size={14} color="#fcd34d" />
                  <span>Class Demo Auto-Fill</span>
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={handleRephraseQuestion}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Re-read</span>
                </button>
              </div>
            </div>

            <h2 style={{ fontSize: '1.35rem', color: '#ffffff', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {currentFollowUp ? currentFollowUp : currentQuestion.question}
            </h2>

            {/* STAR Helper Accordion */}
            {currentQuestion.starGuide && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                <button 
                  onClick={() => setShowStarGuide(!showStarGuide)}
                  style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                >
                  <HelpCircle size={15} />
                  <span>{showStarGuide ? 'Hide STAR Response Hints' : 'Show STAR Response Hints'}</span>
                </button>

                {showStarGuide && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.75rem' }}>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.78rem' }}>
                      <strong style={{ color: '#818cf8', display: 'block' }}>S - Situation:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{currentQuestion.starGuide.situation}</span>
                    </div>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.78rem' }}>
                      <strong style={{ color: '#818cf8', display: 'block' }}>T - Task:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{currentQuestion.starGuide.task}</span>
                    </div>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.78rem' }}>
                      <strong style={{ color: '#818cf8', display: 'block' }}>A - Action:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{currentQuestion.starGuide.action}</span>
                    </div>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.78rem' }}>
                      <strong style={{ color: '#818cf8', display: 'block' }}>R - Result:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{currentQuestion.starGuide.result}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real-time Transcription Stream */}
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} color="var(--accent-primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>Live Answer Transcript</span>
              </div>
              {isMicActive && (
                <div className="badge badge-emerald animate-pulse">
                  <span>Microphone Active</span>
                </div>
              )}
            </div>

            <div style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--border-glass)',
              overflowY: 'auto',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'var(--text-main)',
              minHeight: '120px'
            }}>
              {transcript || interimText || manualText ? (
                <>
                  <span>{transcript} </span>
                  <span style={{ color: '#a5b4fc', italic: true }}>{interimText}</span>
                  {manualText && <div style={{ marginTop: '0.5rem', color: '#67e8f9' }}>{manualText}</div>}
                </>
              ) : (
                <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  Speak into your microphone or type below... Your speech will be transcribed in real time.
                </div>
              )}
            </div>

            {/* Manual text input fallback */}
            <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Or type additional answer details here..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className={`btn ${isMicActive ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleToggleMic}
              style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-lg)' }}
            >
              {isMicActive ? <MicOff size={20} /> : <Mic size={20} />}
              <span>{isMicActive ? 'Mute Microphone' : 'Start Speaking'}</span>
            </button>

            <button
              className="btn btn-success"
              onClick={handleEvaluateAnswer}
              disabled={sessionState === 'evaluating' || (!transcript && !manualText && !interimText)}
              style={{ flex: 1.2, padding: '1rem', borderRadius: 'var(--radius-lg)' }}
            >
              <Send size={20} />
              <span>Submit & Evaluate Answer</span>
            </button>
          </div>

        </div>

        {/* Right Column: AI Video Avatar / Voice Orb, Live Camera & Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* AI Video Interviewer Avatar or Orb */}
          {viewMode === 'video' ? (
            <AIVideoAvatar
              state={orbState}
              interviewerName={sessionConfig.persona?.name.split(' ')[0] || 'Alex'}
              avatarType={sessionConfig.personaId === 'encouraging' ? 'sophia' : sessionConfig.personaId === 'strict' ? 'marcus' : 'alex'}
              isSpeaking={orbState === 'speaking'}
            />
          ) : (
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <VoiceOrb
                state={orbState}
                interviewerName={`${sessionConfig.persona?.name.split(' ')[0] || 'Alex'} (${sessionConfig.personaId})`}
                volumeLevel={isMicActive ? 0.6 : orbState === 'speaking' ? 0.8 : 0}
              />
              <AudioVisualizer
                isActive={isMicActive || orbState === 'speaking'}
                isSpeaking={orbState === 'speaking'}
                isListening={isMicActive}
                height={45}
              />
            </div>
          )}

          {/* Live Webcam Stream with Proctoring Detector */}
          {showCamera && (
            <CameraStream
              isLive={isMicActive}
              onProctorWarning={handleProctorWarning}
            />
          )}

          {/* Live Feedback / Turn Evaluation Card */}
          {currentEval && (
            <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ color: '#ffffff', fontSize: '1rem' }}>AI Feedback Summary</h4>
                <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem' }}>
                  Score: {currentEval.evaluation.overallScore}/100
                </span>
              </div>

              {/* Strengths */}
              {currentEval.evaluation.strengths.length > 0 && (
                <div style={{ marginBottom: '0.6rem', fontSize: '0.82rem', color: '#6ee7b7' }}>
                  <strong>✓ Key Strength:</strong> {currentEval.evaluation.strengths[0]}
                </div>
              )}

              {/* Improvements */}
              {currentEval.evaluation.improvements.length > 0 && (
                <div style={{ marginBottom: '0.85rem', fontSize: '0.82rem', color: '#fcd34d' }}>
                  <strong>💡 Tip:</strong> {currentEval.evaluation.improvements[0]}
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
              >
                <span>{isLastQuestion ? 'View Final Report' : 'Next Question'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
