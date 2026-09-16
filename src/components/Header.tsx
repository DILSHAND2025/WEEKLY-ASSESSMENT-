import React from 'react';
import { Sparkles, BarChart3, RotateCcw, Home, Upload } from 'lucide-react';
import type { GlobalStats, TopicType } from '../types';

interface HeaderProps {
  currentView: 'home' | 'quiz' | 'summary';
  activeTopic: TopicType | null;
  globalStats: GlobalStats;
  onGoHome: () => void;
  onResetAll: () => void;
  onOpenImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeTopic,
  globalStats,
  onGoHome,
  onResetAll,
  onOpenImport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          onClick={onGoHome}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                AcuPrep
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline-block">
                MCQ Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              High-Yield Practice • Worked Solutions • Memory Tricks
            </p>
          </div>
        </div>

        {/* Middle Breadcrumb (if active in quiz or summary) */}
        {activeTopic && currentView !== 'home' && (
          <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-600">
            <button 
              onClick={onGoHome}
              className="hover:text-indigo-600 flex items-center space-x-1 font-medium text-slate-500 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Topics</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200">
              {activeTopic}
            </span>
          </div>
        )}

        {/* Right Stats & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-4 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-1.5 text-xs font-medium">
            <div className="flex items-center space-x-1.5 text-slate-700">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Answered: <strong className="text-slate-900">{globalStats.totalAttempted}</strong></span>
            </div>
            <div className="w-px h-3.5 bg-slate-200"></div>
            <div className="flex items-center space-x-1.5 text-slate-700">
              <span>Accuracy: <strong className={globalStats.overallAccuracy >= 70 ? 'text-emerald-600 font-bold' : 'text-slate-900'}>{globalStats.overallAccuracy}%</strong></span>
            </div>
          </div>

          {currentView !== 'home' ? (
            <button
              onClick={onGoHome}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 px-3 py-1.5 rounded-lg transition-all active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">All Topics</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={onOpenImport}
                title="Import questions from .docx or .json"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import DOCX</span>
              </button>

              <button
                onClick={onResetAll}
                title="Reset all progress in localStorage"
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
