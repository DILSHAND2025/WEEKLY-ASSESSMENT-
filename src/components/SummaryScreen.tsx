import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw
} from 'lucide-react';
import type { Question, TopicType, TopicProgress, OptionKey } from '../types';
import { calculateTopicStats } from '../utils/storage';

interface SummaryScreenProps {
  topic: TopicType;
  questions: Question[];
  progress: TopicProgress;
  onRetryWrongOnly: () => void;
  onRestartTopic: () => void;
  onBackToHome: () => void;
  onReviewQuestion: (questionIndex: number) => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  topic,
  questions,
  progress,
  onRetryWrongOnly,
  onRestartTopic,
  onBackToHome,
  onReviewQuestion,
}) => {
  const stats = calculateTopicStats(progress, questions.length);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Trigger confetti on high performance
  useEffect(() => {
    if (stats.accuracy >= 75 && stats.totalAnswered >= 5) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [stats.accuracy, stats.totalAnswered]);

  // List of missed questions
  const missedQuestions = questions.filter(q => {
    const record = progress.answers[q.id];
    return record && !record.isCorrect;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(prev => (prev === id ? null : id));
  };

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Top Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Topics</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          {topic} Summary
        </span>
      </div>

      {/* Main Score & Analytics Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Practice Session Complete!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Here is your performance breakdown for {topic}
          </p>
        </div>

        {/* Circular Accuracy Display */}
        <div className="flex justify-center items-center py-2">
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-50 border-8 border-indigo-100 shadow-inner">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats.accuracy}%
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Accuracy
              </span>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <p className="text-xs font-semibold text-emerald-800">Correct</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-700">{stats.correctCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80">
            <p className="text-xs font-semibold text-rose-800">Wrong</p>
            <p className="text-xl sm:text-2xl font-black text-rose-700">{stats.wrongCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600">Attempted</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800">
              {stats.totalAnswered} / {questions.length}
            </p>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {missedQuestions.length > 0 && (
            <button
              onClick={onRetryWrongOnly}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry {missedQuestions.length} Wrong Answers</span>
            </button>
          )}

          <button
            onClick={onRestartTopic}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart Full Topic</span>
          </button>
        </div>
      </div>

      {/* Missed Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">
              Review Missed Questions ({missedQuestions.length})
            </h3>
          </div>
          {missedQuestions.length > 0 && (
            <span className="text-xs text-slate-500">
              Click any question to inspect step solution & memory trick
            </span>
          )}
        </div>

        {missedQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Outstanding! No Missed Questions</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              You answered every attempted question in this topic correctly. Keep up the high score!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {missedQuestions.map((q) => {
              const record = progress.answers[q.id];
              const isExpanded = expandedQuestionId === q.id;
              const originalIndex = questions.findIndex(item => item.id === q.id);

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  {/* Collapsed Header */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-4 sm:p-5 flex items-start justify-between cursor-pointer hover:bg-slate-50/80 transition-colors gap-3 select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {q.id}
                        </span>
                        <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Picked: ({record?.selectedAnswer})
                        </span>
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Correct: ({q.correctAnswer})
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (originalIndex >= 0) onReviewQuestion(originalIndex);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
                      >
                        Interactive
                      </button>
                      <button className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Solution & Trick Drawer */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 space-y-4 animate-slide-down">
                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
                          const isCorrect = key === q.correctAnswer;
                          const wasUserPick = record?.selectedAnswer === key;

                          let style = "bg-white border-slate-200 text-slate-700";
                          if (isCorrect) style = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-400";
                          if (wasUserPick && !isCorrect) style = "bg-rose-50 border-rose-300 text-rose-900 font-semibold ring-1 ring-rose-400";

                          return (
                            <div key={key} className={`p-2 rounded-xl border flex items-center space-x-2 ${style}`}>
                              <span className="font-bold w-5 h-5 rounded-md flex items-center justify-center bg-white/80 border text-[11px] shrink-0">
                                {key}
                              </span>
                              <span className="leading-tight">{q.options[key]}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Worked Out Explanation */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1">
                        <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-indigo-700">
                          Step-by-Step Solution:
                        </span>
                        <p className="whitespace-pre-line leading-relaxed text-slate-700">
                          {q.explanation}
                        </p>
                      </div>

                      {/* 🧠 Memory Trick Callout Box */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-amber-800 text-xs uppercase tracking-wider">
                          <span>🧠</span>
                          <span>Memory Trick:</span>
                        </div>
                        <p className="font-medium text-amber-900 leading-relaxed">
                          {q.memoryTrick}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
