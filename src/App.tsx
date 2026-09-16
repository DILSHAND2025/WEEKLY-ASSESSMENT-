import { useState, useEffect, useMemo } from 'react';
import rawQuestions from './data/questions.json';
import type { TopicType, Question, QuizMode, OptionKey } from './types';
import { 
  loadStorageData, 
  recordQuestionAnswer, 
  toggleQuestionBookmark, 
  resetTopicProgress, 
  clearAllTopicProgress, 
  calculateGlobalStats,
  updateLastActiveIndex
} from './utils/storage';
import { Header } from './components/Header';
import { LandingScreen } from './components/LandingScreen';
import { QuizScreen } from './components/QuizScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { ImportModal } from './components/ImportModal';

const builtInQuestions = rawQuestions as Question[];
const CUSTOM_Q_KEY = 'mcq_portal_custom_questions_v1';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'summary'>('home');
  const [activeTopic, setActiveTopic] = useState<TopicType | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>('all');
  const [storageData, setStorageData] = useState(loadStorageData);
  const [resetConfirmTopic, setResetConfirmTopic] = useState<TopicType | 'all' | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_Q_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const allQuestions = useMemo(() => {
    // Avoid duplicate IDs
    const existingIds = new Set(builtInQuestions.map(q => q.id));
    const filteredCustom = customQuestions.filter(q => !existingIds.has(q.id));
    return [...builtInQuestions, ...filteredCustom];
  }, [customQuestions]);

  // Sync state with storage on mount
  useEffect(() => {
    setStorageData(loadStorageData());
  }, []);

  const handleImportQuestions = (newQs: Question[]) => {
    setCustomQuestions(prev => {
      const updated = [...prev, ...newQs];
      try {
        localStorage.setItem(CUSTOM_Q_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist custom questions:', err);
      }
      return updated;
    });
  };

  // Filter questions for active topic
  const topicQuestions = useMemo(() => {
    if (!activeTopic) return [];
    return allQuestions.filter(q => q.topic === activeTopic);
  }, [activeTopic, allQuestions]);

  // Global statistics
  const globalStats = useMemo(() => {
    return calculateGlobalStats(storageData);
  }, [storageData]);

  // Handlers
  const handleSelectTopic = (topic: TopicType, mode: QuizMode = 'all') => {
    setActiveTopic(topic);
    setQuizMode(mode);
    setCurrentView('quiz');
  };

  const handleAnswerQuestion = (questionId: string, selectedAnswer: OptionKey, isCorrect: boolean) => {
    if (!activeTopic) return;
    const updated = recordQuestionAnswer(activeTopic, questionId, selectedAnswer, isCorrect);
    setStorageData({ ...updated });
  };

  const handleToggleBookmark = (questionId: string) => {
    if (!activeTopic) return;
    toggleQuestionBookmark(activeTopic, questionId);
    setStorageData(loadStorageData());
  };

  const handleConfirmReset = () => {
    if (resetConfirmTopic === 'all') {
      const fresh = clearAllTopicProgress();
      setStorageData({ ...fresh });
      setCurrentView('home');
      setActiveTopic(null);
    } else if (resetConfirmTopic) {
      const updated = resetTopicProgress(resetConfirmTopic);
      setStorageData({ ...updated });
      if (activeTopic === resetConfirmTopic && currentView === 'quiz') {
        updateLastActiveIndex(resetConfirmTopic, 0);
      }
    }
    setResetConfirmTopic(null);
  };

  const handleRetryWrongOnly = () => {
    setQuizMode('wrong-only');
    if (activeTopic) {
      updateLastActiveIndex(activeTopic, 0);
    }
    setCurrentView('quiz');
  };

  const handleRestartTopic = () => {
    if (activeTopic) {
      const updated = resetTopicProgress(activeTopic);
      setStorageData({ ...updated });
      setQuizMode('all');
      setCurrentView('quiz');
    }
  };

  const handleReviewSpecificQuestion = (questionIndex: number) => {
    if (activeTopic) {
      updateLastActiveIndex(activeTopic, questionIndex);
      setQuizMode('all');
      setCurrentView('quiz');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        activeTopic={activeTopic}
        globalStats={globalStats}
        onGoHome={() => setCurrentView('home')}
        onResetAll={() => setResetConfirmTopic('all')}
        onOpenImport={() => setIsImportOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingScreen
            questions={allQuestions}
            progressByTopic={storageData.progressByTopic}
            globalStats={globalStats}
            onSelectTopic={handleSelectTopic}
            onResetTopic={(topic) => setResetConfirmTopic(topic)}
          />
        )}

        {currentView === 'quiz' && activeTopic && (
          <QuizScreen
            key={`${activeTopic}-${quizMode}`}
            topic={activeTopic}
            questions={topicQuestions}
            mode={quizMode}
            progress={storageData.progressByTopic[activeTopic]}
            onAnswerQuestion={handleAnswerQuestion}
            onToggleBookmark={handleToggleBookmark}
            onFinishQuiz={() => setCurrentView('summary')}
            onBackToHome={() => setCurrentView('home')}
            onResetTopic={() => setResetConfirmTopic(activeTopic)}
          />
        )}

        {currentView === 'summary' && activeTopic && (
          <SummaryScreen
            topic={activeTopic}
            questions={topicQuestions}
            progress={storageData.progressByTopic[activeTopic]}
            onRetryWrongOnly={handleRetryWrongOnly}
            onRestartTopic={handleRestartTopic}
            onBackToHome={() => setCurrentView('home')}
            onReviewQuestion={handleReviewSpecificQuestion}
          />
        )}
      </main>

      {/* Reset Confirmation Modal */}
      {resetConfirmTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold text-slate-900">
              {resetConfirmTopic === 'all' ? 'Reset All Progress?' : `Reset ${resetConfirmTopic}?`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {resetConfirmTopic === 'all'
                ? 'This will erase all answered questions, scores, and bookmarks across all 4 topics from your browser storage. This cannot be undone.'
                : `This will reset your answers and score for ${resetConfirmTopic}.`}
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setResetConfirmTopic(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document / Question Importer Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportQuestions={handleImportQuestions}
      />

      {/* Modern Minimal Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AcuPrep MCQ Practice Portal • 100 High-Yield Practice Questions
          </p>
          <div className="flex items-center space-x-4">
            <span>Percentage</span>
            <span>•</span>
            <span>Ratio & Proportion</span>
            <span>•</span>
            <span>Profit & Loss</span>
            <span>•</span>
            <span>DSA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
