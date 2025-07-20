'use client';

import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Brain } from 'lucide-react';
import AdaptiveLearningInterestModal from '@/src/components/custom/AdaptiveLearningInterestModalEnhanced';

const AdaptiveLearningNotification: React.FC = () => {
  return (
    <Alert className="border-violet-200/60 bg-gradient-to-r from-violet-50/90 to-purple-50/70 dark:border-violet-800/50 dark:bg-gradient-to-r dark:from-violet-900/25 dark:to-purple-900/15 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-violet-900 dark:text-violet-100">
          Adaptive Learning Engine - Coming Soon
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed mb-6">
        Revolutionary AI that personalizes your learning experience with adaptive exams tailored to
        your progress.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3 border border-violet-200/40 dark:border-violet-700/40">
          <div className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
            Smart Questions
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            AI-powered question selection
          </div>
        </div>
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3 border border-blue-200/40 dark:border-blue-700/40">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            Real-time Adaptation
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Dynamic difficulty adjustment
          </div>
        </div>
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3 border border-emerald-200/40 dark:border-emerald-700/40">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
            Optimized Learning
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Personalized study paths</div>
        </div>
      </div>

      {/* CTA Button - Full Width */}
      <div className="w-full">
        <AdaptiveLearningInterestModal />
      </div>
    </Alert>
  );
};

export default AdaptiveLearningNotification;
