import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  RotateCcw, 
  Shuffle, 
  Layers, 
  Bookmark, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import type { Question, TopicType, OptionKey, TopicProgress, QuizMode } from '../types';
import { QuestionNavigator } from './QuestionNavigator';

interface QuizScreenProps {
  topic: TopicType;
  questions: Question[];
  mode: QuizMode;
  progress: TopicProgress;
  onAnswerQuestion: (questionId: string, selectedAnswer: OptionKey, isCorrect: boolean) => void;
  onToggleBookmark: (questionId: string) => void;
  onFinishQuiz: () => void;
  onBackToHome: () => void;
  onResetTopic: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  topic,
  questions,
  mode,
  progress,
  onAnswerQuestion,
  onToggleBookmark,
  onFinishQuiz,
  onBackToHome,
  onResetTopic,
}) => {
  // Filter questions if mode is 'wrong-only'
  const activeQuestionList = React.useMemo(() => {
    if (mode === 'wrong-only') {
      const wrongList = questions.filter(q => {
        const record = progress.answers[q.id];
        return record && !record.isCorrect;
      });
      return wrongList.length > 0 ? wrongList : questions;
    }
    return questions;
  }, [questions, mode, progress.answers]);

  // Active question index
  const [currentIndex, setCurrentIndex] = useState(() => {
    // If progress has a saved index within bounds, use it
    if (progress.lastActiveIndex >= 0 && progress.lastActiveIndex < activeQuestionList.length) {
      return progress.lastActiveIndex;
    }
    return 0;
  });

  // Question Navigator Drawer state
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Shuffle mode toggle
  const [isShuffled, setIsShuffled] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState<Question[]>(activeQuestionList);

  useEffect(() => {
    if (isShuffled) {
      const shuffled = [...activeQuestionList].sort(() => Math.random() - 0.5);
      setDisplayQuestions(shuffled);
      setCurrentIndex(0);
    } else {
      setDisplayQuestions(activeQuestionList);
    }
  }, [isShuffled, activeQuestionList]);

  // Ensure index stays valid
  const currentQuestion = displayQuestions[currentIndex] || displayQuestions[0];
  const questionNumber = currentIndex + 1;
  const totalQuestions = displayQuestions.length;

  // Check if current question has already been answered
  const currentRecord = currentQuestion ? progress.answers[currentQuestion.id] : undefined;
  const isAnswered = !!currentRecord;
  const selectedAnswer = currentRecord?.selectedAnswer;
  const isBookmarked = currentQuestion ? progress.bookmarkedIds.includes(currentQuestion.id) : false;

  // Running Score Calculation
  const answeredInTopic = Object.keys(progress.answers);
  const correctCount = answeredInTopic.filter(id => progress.answers[id]?.isCorrect).length;
  const totalAnsweredCount = answeredInTopic.length;
  const runningAccuracy = totalAnsweredCount > 0 ? Math.round((correctCount / totalAnsweredCount) * 100) : 0;

  // Progress percentage
  const progressPercent = totalQuestions > 0 ? Math.round((questionNumber / totalQuestions) * 100) : 0;

  const handleOptionClick = (optionKey: OptionKey) => {
    if (isAnswered || !currentQuestion) return; // Locked once answered
    const isCorrect = optionKey === currentQuestion.correctAnswer;
    onAnswerQuestion(currentQuestion.id, optionKey, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const optionLetters: OptionKey[] = ['A', 'B', 'C', 'D'];

  if (!currentQuestion) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-600">No questions available for this selection.</p>
        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
        >
          Return to Topics
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {topic} {mode === 'wrong-only' && '• Retry Mode'}
          </span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsShuffled(prev => !prev)}
            title={isShuffled ? "Shuffle active (click to reset order)" : "Shuffle questions"}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 flex items-center space-x-1 ${
              isShuffled 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-semibold' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
          </button>

          <button
            onClick={() => setIsNavOpen(true)}
            title="Open Question Palette"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 flex items-center space-x-1 text-xs"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Palette</span>
          </button>

          <button
            onClick={() => onToggleBookmark(currentQuestion.id)}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
              isBookmarked 
                ? 'bg-amber-50 border-amber-300 text-amber-600' 
                : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={onResetTopic}
            title="Reset this topic"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Running Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="font-semibold text-slate-900 text-sm">
            Question {questionNumber} of {totalQuestions}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-slate-500">Score:</span>
              <span className="font-bold text-slate-900">{correctCount}</span>
              <span className="text-slate-400">/ {totalAnsweredCount}</span>
            </div>
            {totalAnsweredCount > 0 && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                runningAccuracy >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {runningAccuracy}%
              </span>
            )}
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6 transition-all">
        {/* Question Id and text */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {currentQuestion.id}
            </span>
            {isAnswered && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                currentRecord?.isCorrect 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {currentRecord?.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Correct</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Incorrect</span>
                  </>
                )}
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Clickable Option Buttons */}
        <div className="space-y-3">
          {optionLetters.map((optKey) => {
            const optionText = currentQuestion.options[optKey];
            const isThisCorrect = optKey === currentQuestion.correctAnswer;
            const isThisSelected = selectedAnswer === optKey;

            // Determine styling according to exact prompt specs:
            // 1. Unanswered state: neutral gray border, interactive hover
            // 2. Locked on selection:
            //    - Correct option: always green (#16a34a) with checkmark
            //    - If user picked wrong: user's wrong option highlighted in red (#dc2626) with cross
            //    - Other unselected options: neutral gray disabled
            let buttonClasses = "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50/80 cursor-pointer shadow-2xs";
            let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";
            let icon = null;

            if (isAnswered) {
              if (isThisCorrect) {
                // Correct option ALWAYS highlighted in green (#16a34a)
                buttonClasses = "border-[#16a34a] bg-emerald-50/90 text-emerald-950 font-medium ring-2 ring-[#16a34a]/30 shadow-xs";
                badgeClasses = "bg-[#16a34a] text-white border-[#16a34a]";
                icon = <Check className="w-4 h-4 text-[#16a34a]" strokeWidth={3} />;
              } else if (isThisSelected && !currentRecord?.isCorrect) {
                // User picked wrong option: highlight in red (#dc2626) with cross
                buttonClasses = "border-[#dc2626] bg-rose-50/90 text-rose-950 font-medium ring-2 ring-[#dc2626]/30 shadow-xs";
                badgeClasses = "bg-[#dc2626] text-white border-[#dc2626]";
                icon = <X className="w-4 h-4 text-[#dc2626]" strokeWidth={3} />;
              } else {
                // Neutral disabled gray
                buttonClasses = "border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-default";
                badgeClasses = "bg-slate-200 text-slate-500 border-slate-300";
              }
            }

            return (
              <button
                key={optKey}
                disabled={isAnswered}
                onClick={() => handleOptionClick(optKey)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base flex items-center justify-between transition-all duration-200 ${buttonClasses}`}
              >
                <div className="flex items-center space-x-3.5 flex-1 pr-2">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border shrink-0 transition-colors ${badgeClasses}`}>
                    {optKey}
                  </span>
                  <span className="leading-snug">{optionText}</span>
                </div>

                {icon && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Panel (reveals smoothly with transition on selection) */}
        {isAnswered && (
          <div className="animate-slide-down space-y-4 pt-4 border-t border-slate-100">
            {/* Answer Result Callout */}
            <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
              currentRecord?.isCorrect 
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}>
              <div className="pt-0.5 shrink-0">
                {currentRecord?.isCorrect ? (
                  <span className="text-xl">✅</span>
                ) : (
                  <span className="text-xl">❌</span>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">
                  {currentRecord?.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            {/* Separate 🧠 Memory Trick Callout Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/90 text-amber-950 shadow-2xs space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <span className="text-base">🧠</span>
                <span>Memory Trick & Fast Shortcut</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                {currentQuestion.memoryTrick}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Button Bar */}
        <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${
              currentIndex === 0 
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {/* If on last question or answered, can view summary */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Summary'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {!isAnswered && (
              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span>Skip</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Navigator Drawer */}
      <QuestionNavigator
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        questions={displayQuestions}
        currentIndex={currentIndex}
        onSelectIndex={(newIdx) => setCurrentIndex(newIdx)}
        progress={progress}
      />
    </div>
  );
};
