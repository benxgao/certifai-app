'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

interface ExamCustomPromptDisplayProps {
  customPromptText: string;
}

export const ExamCustomPromptDisplay: React.FC<ExamCustomPromptDisplayProps> = ({
  customPromptText,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/25 dark:via-indigo-900/25 dark:to-purple-900/25 p-5 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-lg flex items-center justify-center shadow-sm">
            <FaLightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Custom Focus Area
          </h4>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border border-blue-100 dark:border-blue-700/30">
          <blockquote className="text-base sm:text-lg font-medium text-blue-900 dark:text-blue-100 leading-relaxed italic">
            &ldquo;{customPromptText}&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
};
