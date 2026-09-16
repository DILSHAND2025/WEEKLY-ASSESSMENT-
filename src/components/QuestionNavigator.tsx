import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import type { Question, TopicProgress } from '../types';

interface QuestionNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  progress: TopicProgress;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  onSelectIndex,
  progress,
}) => {
  if (!isOpen) return null;

  const totalAnswered = Object.keys(progress.answers).length;
  const correctCount = Object.values(progress.answers).filter(a => a.isCorrect).length;
  const wrongCount = totalAnswered - correctCount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col border-l border-slate-200 animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Question Navigator</h3>
            <p className="text-xs text-slate-500">Jump directly to any question</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100/70 border-b border-slate-200 text-center text-xs">
          <div className="bg-white py-1.5 px-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total</span>
            <span className="font-bold text-slate-900">{questions.length}</span>
          </div>
          <div className="bg-emerald-50 py-1.5 px-2 rounded-lg border border-emerald-200 text-emerald-800">
            <span className="block text-[10px] uppercase font-semibold">Correct</span>
            <span className="font-bold">{correctCount}</span>
          </div>
          <div className="bg-rose-50 py-1.5 px-2 rounded-lg border border-rose-200 text-rose-800">
            <span className="block text-[10px] uppercase font-semibold">Wrong</span>
            <span className="font-bold">{wrongCount}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 bg-slate-50 text-[11px] text-slate-600 flex flex-wrap gap-3 border-b border-slate-200">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Correct</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
            <span>Wrong</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Flagged</span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-2.5">
            {questions.map((q, idx) => {
              const answerRecord = progress.answers[q.id];
              const isCurrent = idx === currentIndex;
              const isBookmarked = progress.bookmarkedIds.includes(q.id);

              let buttonStyle = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
              if (answerRecord) {
                if (answerRecord.isCorrect) {
                  buttonStyle = "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold";
                } else {
                  buttonStyle = "bg-rose-50 text-rose-800 border-rose-300 font-semibold";
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectIndex(idx);
                    onClose();
                  }}
                  className={`relative h-11 rounded-xl text-xs flex flex-col items-center justify-center border transition-all active:scale-95 ${buttonStyle} ${
                    isCurrent ? 'ring-2 ring-indigo-600 ring-offset-1 font-bold shadow-xs' : ''
                  }`}
                >
                  <span>{idx + 1}</span>
                  {answerRecord && (
                    <span className="text-[9px] mt-0.5">
                      {answerRecord.isCorrect ? (
                        <Check className="w-3 h-3 text-emerald-600 inline" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-rose-600 inline" />
                      )}
                    </span>
                  )}
                  {isBookmarked && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
};
