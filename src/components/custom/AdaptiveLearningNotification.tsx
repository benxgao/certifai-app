'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Construction, Sparkles } from 'lucide-react';
import AdaptiveLearningInterestModal from '@/src/components/custom/AdaptiveLearningInterestModal';

const AdaptiveLearningNotification: React.FC = () => {
  return (
    <Alert className="border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/60 dark:border-amber-800/50 dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-orange-900/10 shadow-lg">
      <div className="flex items-start gap-4">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 via-amber-200 to-orange-200 dark:from-amber-900/40 dark:via-amber-800/40 dark:to-orange-700/40 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <Construction className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <AlertDescription className="text-base">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    🚧 Adaptive Learning Engine - Coming Soon!
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    We&apos;re building revolutionary AI that learns how YOU learn - creating truly
                    personalized exams that adapt to your performance in real-time.
                  </p>
                </div>

                {/* CTA Button - Desktop */}
                <div className="hidden sm:block flex-shrink-0">
                  <AdaptiveLearningInterestModal />
                </div>
              </div>

              {/* Features Preview */}
              <div className="bg-white/60 dark:bg-slate-800/40 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2 text-sm">
                  What&apos;s Coming:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Smart Question Selection
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Performance-Based Adaptation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Zero-Waste Study Time
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button - Mobile */}
              <div className="sm:hidden pt-2">
                <AdaptiveLearningInterestModal />
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default AdaptiveLearningNotification;
