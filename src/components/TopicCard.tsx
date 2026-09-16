import React from 'react';
import { 
  Percent, 
  Scale, 
  TrendingUp, 
  Cpu, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Play
} from 'lucide-react';
import type { TopicType, TopicProgress } from '../types';
import { calculateTopicStats } from '../utils/storage';

interface TopicCardProps {
  topic: TopicType;
  totalQuestions: number;
  progress: TopicProgress;
  onSelectTopic: (topic: TopicType, mode?: 'all' | 'wrong-only') => void;
  onResetTopic: (topic: TopicType) => void;
}

const topicMeta: Record<TopicType, {
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  tag: string;
}> = {
  'Percentage': {
    icon: Percent,
    gradient: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700 border-blue-200',
    description: 'Successive changes, consumption invariance, population, elections & mixtures.',
    tag: 'Quantitative Aptitude',
  },
  'Ratio & Proportion': {
    icon: Scale,
    gradient: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700 border-emerald-200',
    description: 'Mean proportion, coin sets, age comparisons, partnerships & alligation.',
    tag: 'Arithmetic Reasoning',
  },
  'Profit & Loss': {
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700 border-amber-200',
    description: 'Markup vs discount, dishonest dealers, false weights & break-even margins.',
    tag: 'Business Math',
  },
  'DSA': {
    icon: Cpu,
    gradient: 'from-indigo-600 to-violet-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700 border-indigo-200',
    description: 'Arrays, Two Pointers, Trees, Graphs, DP, Heaps, Stacks & Complexity.',
    tag: 'Technical Core',
  },
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  totalQuestions,
  progress,
  onSelectTopic,
  onResetTopic,
}) => {
  const meta = topicMeta[topic];
  const stats = calculateTopicStats(progress, totalQuestions);
  const IconComponent = meta.icon;

  const hasStarted = stats.totalAnswered > 0;
  const isComplete = stats.isCompleted;
  const hasWrongAnswers = stats.wrongCount > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Card Header Top Accent */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${meta.gradient}`} />

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Tag & Icon Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeText} mb-1`}>
                  {meta.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {topic}
                </h3>
              </div>
            </div>

            {/* Questions count pill */}
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              {totalQuestions} MCQs
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            {meta.description}
          </p>
        </div>

        {/* Progress & Stats Area */}
        <div className="pt-4 border-t border-slate-100 mt-2">
          {hasStarted ? (
            <div className="space-y-3 mb-4">
              {/* Progress Bar & percentage */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>{stats.totalAnswered} of {totalQuestions} answered</span>
                  <span className="font-semibold text-slate-900">{stats.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${meta.gradient}`}
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Accuracy & Breakdown Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Correct: <strong>{stats.correctCount}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-700 font-medium">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Wrong: <strong>{stats.wrongCount}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 py-2 px-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center justify-between">
              <span>Status: <strong className="text-slate-700">Not started</strong></span>
              <span className="text-indigo-600 font-semibold">25 New Questions</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => onSelectTopic(topic, 'all')}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-[0.98] ${
                hasStarted && !isComplete
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  : isComplete
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {hasStarted && !isComplete ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Continue Quiz</span>
                </>
              ) : isComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed ({stats.accuracy}% Accuracy)</span>
                </>
              ) : (
                <>
                  <span>Start Practice</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Secondary Action: Retry Wrong Only if any wrong answers */}
            {hasWrongAnswers && (
              <button
                onClick={() => onSelectTopic(topic, 'wrong-only')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-colors flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry {stats.wrongCount} Wrong Answers</span>
              </button>
            )}

            {/* Quick reset button if started */}
            {hasStarted && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onResetTopic(topic)}
                  className="text-[11px] text-slate-500 hover:text-rose-600 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Progress</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
