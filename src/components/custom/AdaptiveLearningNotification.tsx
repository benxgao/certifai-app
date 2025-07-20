'use client';

import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Brain, Sparkles } from 'lucide-react';
import AdaptiveLearningInterestModal from '@/src/components/custom/AdaptiveLearningInterestModalEnhanced';

const AdaptiveLearningNotification: React.FC = () => {
  return (
    <Alert className="border-violet-200/60 bg-gradient-to-r from-violet-50/90 to-purple-50/70 dark:border-violet-800/50 dark:bg-gradient-to-r dark:from-violet-900/25 dark:to-purple-900/15 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-center gap-4">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-100 via-violet-200 to-purple-200 dark:from-violet-900/50 dark:via-violet-800/50 dark:to-purple-700/50 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-violet-900 dark:text-violet-100 mb-1">
                � Adaptive Learning Engine - Coming Soon
              </h3>
              <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                Revolutionary AI that personalizes your learning experience with adaptive exams
                tailored to your progress.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <AdaptiveLearningInterestModal />
            </div>
          </div>

          {/* Features Preview - Compact */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Smart Questions
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Real-time Adaptation
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Optimized Learning
              </span>
            </div>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default AdaptiveLearningNotification;
