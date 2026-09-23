import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TargetSelector from './components/TargetSelector';
import SetupModal from './components/SetupModal';
import LiveSession from './components/LiveSession';
import AnalyticsReport from './components/AnalyticsReport';
import WeaknessGraph from './components/WeaknessGraph';
import TrainingPlan from './components/TrainingPlan';
import LongitudinalProgress from './components/LongitudinalProgress';
import QuestionBank from './components/QuestionBank';
import HistoryTracker from './components/HistoryTracker';
import SettingsModal from './components/SettingsModal';
import ResumeUpload from './components/ResumeUpload';
import TopicPractice from './components/TopicPractice';
import CourseKnowledgeModal from './components/CourseKnowledgeModal';
import AuthModal from './components/AuthModal';

import { QUESTION_BANK } from './data/questionBank';
import { weaknessTrackerInstance } from './services/weaknessTracker';
import { authServiceInstance } from './services/authService';

export default function App() {
  const [activeTab, setActiveTab] = useState('target'); // 'target' | 'graph' | 'plan' | 'progress' | 'session' | 'report' | 'course' | 'resume' | 'topics' | 'questions' | 'history' | 'settings'

  // User Authentication State - Default to showing Login Page first on open!
  const [currentUser, setCurrentUser] = useState(() => authServiceInstance.currentUser);
  const [showAuthModal, setShowAuthModal] = useState(() => !authServiceInstance.currentUser);

  // Current session configuration
  const [sessionConfig, setSessionConfig] = useState({
    companyId: 'tcs',
    companyName: 'TCS (Tata Consultancy Services)',
    roleId: 'sde',
    roleName: 'Software Development Engineer',
    roundId: 'full',
    roundName: 'Full Comprehensive Interview',
    questionCount: 3,
    typeName: 'Campus Placement Drive',
    experienceLabel: 'Placement Candidate',
    personaId: 'professional',
    persona: { id: 'professional', name: 'Professional & Direct', voicePitch: 1.0, voiceRate: 1.0 }
  });

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentSessionResult, setCurrentSessionResult] = useState(null);

  // Load history from Weakness Tracker
  const [history, setHistory] = useState(() => weaknessTrackerInstance.getInterviewHistory());

  // Current calculated Weakness Graph strictly from candidate evaluations
  const [currentWeaknessGraph, setCurrentWeaknessGraph] = useState(() => 
    weaknessTrackerInstance.computeWeaknessGraph(history[0]?.turnEvaluations || [])
  );

  // Generated 7-Day Training Plan
  const [trainingPlan, setTrainingPlan] = useState(() => 
    weaknessTrackerInstance.generate7DayTrainingPlan(currentWeaknessGraph)
  );

  // Ensure Login Modal opens first if user is not logged in or on initial app visit
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser]);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authServiceInstance.logout();
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  // Launch Session from Target Selector
  const handleSelectTarget = (targetConfig) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const fullConfig = { ...sessionConfig, ...targetConfig };
    setSessionConfig(fullConfig);

    const roleQuestions = QUESTION_BANK[targetConfig.roleId] || QUESTION_BANK.swe;
    let questionsPool = roleQuestions.behavioral || roleQuestions.technical || [];
    if (!questionsPool || questionsPool.length === 0) {
      questionsPool = QUESTION_BANK.swe.behavioral;
    }

    setActiveQuestions(questionsPool.slice(0, targetConfig.questionCount || 3));
    setActiveTab('session');
  };

  // Start Tailored Session from Resume Upload
  const handleStartResumeSession = ({ config, questions }) => {
    setSessionConfig(prev => ({ ...prev, ...config }));
    setActiveQuestions(questions);
    setActiveTab('session');
  };

  // Start Topic Session
  const handleStartTopicSession = ({ config, questions }) => {
    setSessionConfig(prev => ({ ...prev, ...config }));
    setActiveQuestions(questions);
    setActiveTab('session');
  };

  // Practice single question from Question Bank
  const handlePracticeSingleQuestion = (questionItem) => {
    setActiveQuestions([questionItem]);
    setActiveTab('session');
  };

  // Complete session -> Compute Weakness Graph strictly AFTER actual turn evaluations
  const handleFinishSession = (resultData) => {
    const fullResult = {
      ...resultData,
      candidateUser: currentUser,
      timestamp: new Date().toISOString()
    };
    setCurrentSessionResult(fullResult);

    // Save to longitudinal weakness tracker history
    const record = weaknessTrackerInstance.saveInterviewSession(fullResult);
    const updatedHistory = weaknessTrackerInstance.getInterviewHistory();
    setHistory(updatedHistory);

    // Recompute weakness graph and 7-day training plan dynamically
    const newGraph = weaknessTrackerInstance.computeWeaknessGraph(fullResult.turnEvaluations);
    const newPlan = weaknessTrackerInstance.generate7DayTrainingPlan(newGraph);
    setCurrentWeaknessGraph(newGraph);
    setTrainingPlan(newPlan);

    setActiveTab('report');
  };

  const handleLaunchReInterview = () => {
    const reInterviewConfig = {
      ...sessionConfig,
      typeName: 'Adaptive Re-Interview (Verification Round)'
    };
    setSessionConfig(reInterviewConfig);

    const roleQuestions = QUESTION_BANK.swe.behavioral.concat(QUESTION_BANK.swe.technical);
    setActiveQuestions(roleQuestions.slice(0, 3));
    setActiveTab('session');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your InterviewTwin longitudinal history?')) {
      localStorage.removeItem('interview_twin_history');
      setHistory([]);
      const emptyGraph = { hasData: false };
      setCurrentWeaknessGraph(emptyGraph);
      setTrainingPlan(weaknessTrackerInstance.generate7DayTrainingPlan(emptyGraph));
    }
  };

  const handleViewHistoricalReport = (historicalSession) => {
    setCurrentSessionResult(historicalSession);
    setActiveTab('report');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartNewSession={() => setActiveTab('target')}
        activeConfig={sessionConfig}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Login Authentication Gateway - Displayed First */}
      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => {
            if (currentUser) setShowAuthModal(false);
          }}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'target' && (
          <TargetSelector
            onSelectTarget={handleSelectTarget}
            currentConfig={sessionConfig}
          />
        )}

        {activeTab === 'graph' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <WeaknessGraph
              weaknessGraph={currentWeaknessGraph}
              onStartDiagnostic={() => setActiveTab('target')}
              onGeneratePlan={() => setActiveTab('plan')}
            />
          </div>
        )}

        {activeTab === 'plan' && (
          <TrainingPlan
            trainingPlan={trainingPlan}
            onLaunchReInterview={handleLaunchReInterview}
          />
        )}

        {activeTab === 'progress' && (
          <LongitudinalProgress
            history={history}
          />
        )}

        {activeTab === 'setup' && (
          <SetupModal
            onStartSession={(cfg) => handleSelectTarget(cfg)}
            activeConfig={sessionConfig}
          />
        )}

        {activeTab === 'course' && (
          <CourseKnowledgeModal
            onSaveCourseConfig={(courseObj) => {
              setSessionConfig(prev => ({
                ...prev,
                roleName: `${courseObj.code} (${courseObj.name.split(':')[0]})`
              }));
              setActiveTab('target');
            }}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeUpload
            onStartResumeSession={handleStartResumeSession}
          />
        )}

        {activeTab === 'topics' && (
          <TopicPractice
            onStartTopicSession={handleStartTopicSession}
          />
        )}

        {activeTab === 'session' && (
          <LiveSession
            sessionConfig={sessionConfig}
            questions={activeQuestions}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeTab === 'report' && (
          <AnalyticsReport
            sessionResult={currentSessionResult}
            onRestart={() => setActiveTab('target')}
            onGoToTrainingPlan={() => setActiveTab('plan')}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBank
            onSelectQuestionToPractice={handlePracticeSingleQuestion}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTracker
            history={history}
            onViewSessionReport={handleViewHistoricalReport}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{ borderRadius: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, padding: '1.25rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '3rem' }}>
        <p>InterviewTwin • Adaptive AI Skill-Gap Coach • Candidate Login Gateway</p>
      </footer>

    </div>
  );
}