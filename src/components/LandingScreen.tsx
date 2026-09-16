import React from 'react';
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Layers, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import type { TopicType, Question, GlobalStats, TopicProgress } from '../types';
import { TopicCard } from './TopicCard';

interface LandingScreenProps {
  questions: Question[];
  progressByTopic: Record<TopicType, TopicProgress>;
  globalStats: GlobalStats;
  onSelectTopic: (topic: TopicType, mode?: 'all' | 'wrong-only') => void;
  onResetTopic: (topic: TopicType) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  questions,
  progressByTopic,
  globalStats,
  onSelectTopic,
  onResetTopic,
}) => {
  const topics: TopicType[] = ['Percentage', 'Ratio & Proportion', 'Profit & Loss', 'DSA'];

  const getQuestionCountByTopic = (topic: TopicType) => {
    return questions.filter(q => q.topic === topic).length;
  };

  const masteredTopicsCount = topics.filter(topic => {
    const topicQuestions = getQuestionCountByTopic(topic);
    const prog = progressByTopic[topic];
    if (!prog || topicQuestions === 0) return false;
    const answered = Object.keys(prog.answers).length;
    const correct = Object.values(prog.answers).filter(a => a.isCorrect).length;
    return answered === topicQuestions && (correct / answered) >= 0.8;
  }).length;

  return (
    <div className="py-8 sm:py-12 space-y-10">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-700 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Study Suite • 100 High-Yield MCQs</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Master Concepts with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Instant Feedback & Memory Tricks
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Practice one question at a time with instant color-coded feedback, detailed step-by-step mathematical solutions, and mnemonic shortcuts designed for rapid retention.
        </p>
      </section>

      {/* Global Performance Ribbon */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center space-x-3.5 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total MCQs</p>
              <p className="text-xl font-bold text-slate-900">{questions.length}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Attempted</p>
              <p className="text-xl font-bold text-slate-900">{globalStats.totalAttempted}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Global Accuracy</p>
              <p className="text-xl font-bold text-emerald-600">
                {globalStats.totalAttempted > 0 ? `${globalStats.overallAccuracy}%` : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Mastered (≥80%)</p>
              <p className="text-xl font-bold text-amber-600">{masteredTopicsCount} / 4</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Topic Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Select Practice Topic</h2>
            <p className="text-xs sm:text-sm text-slate-500">Choose a subject to practice questions or review your answers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {topics.map(topic => (
            <TopicCard
              key={topic}
              topic={topic}
              totalQuestions={getQuestionCountByTopic(topic)}
              progress={progressByTopic[topic]}
              onSelectTopic={onSelectTopic}
              onResetTopic={onResetTopic}
            />
          ))}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Instant Visual Feedback</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clicks immediately lock the question. Correct answers glow in green (<code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-emerald-700">#16a34a</code>) with a checkmark, while wrong answers reveal in red with a cross.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Step Solutions & 🧠 Memory Tricks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single question comes complete with a worked-out 2–4 line step-by-step mathematical explanation plus a high-speed mnemonic memory trick.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Persistent Offline Practice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All progress, active question index, bookmarks, and scores are automatically saved to your browser&apos;s localStorage, surviving page reloads seamlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
