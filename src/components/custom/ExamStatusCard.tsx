'use client';

import React from 'react';
import { FaCheck, FaEdit, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
import { ExamProgressInfo } from './ExamProgressInfo';
import { ExamCustomPromptDisplay } from './ExamCustomPromptDisplay';

interface ExamStatusCardProps {
  examState: any;
  submittedAt: number | null;
  score: number | null;
  pagination: any;
}

export const ExamStatusCard: React.FC<ExamStatusCardProps> = ({
  examState,
  submittedAt,
  score,
  pagination,
}) => {
  return (
    <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-3xl overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Status Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 tracking-tight">
                <span>Exam Progress</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FaInfoCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Your answers are automatically saved as you select them. Take your time to
                      review each question carefully.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </h2>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              {submittedAt !== null ? (
                <span className="inline-flex items-center rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30 shadow-sm backdrop-blur-sm">
                  <FaCheck className="w-3 h-3 mr-1.5" />
                  {examState?.status === 'PASSED'
                    ? 'Completed'
                    : examState?.status === 'FAILED'
                    ? 'Completed'
                    : 'Completed'}
                </span>
              ) : examState?.exam_status === 'QUESTIONS_GENERATING' ? (
                <span className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 border border-blue-200/60 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30 shadow-sm backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-700 border-t-transparent mr-1.5"></div>
                  Generating Questions
                </span>
              ) : examState?.exam_status === 'QUESTION_GENERATION_FAILED' ? (
                <span className="inline-flex items-center rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 border border-red-200/60 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30 shadow-sm backdrop-blur-sm">
                  <FaTimes className="w-3 h-3 mr-1.5" /> Generation Failed
                </span>
              ) : examState?.exam_status === 'READY' ? (
                <span className="inline-flex items-center rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 border border-green-200/60 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30 shadow-sm backdrop-blur-sm">
                  <FaCheck className="w-3 h-3 mr-1.5" /> Ready
                </span>
              ) : examState?.exam_status === 'PENDING_QUESTIONS' ? (
                <span className="inline-flex items-center rounded-xl bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700 border border-yellow-200/60 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30 shadow-sm backdrop-blur-sm">
                  <FaEdit className="w-3 h-3 mr-1.5" /> Pending
                </span>
              ) : (
                <span className="inline-flex items-center rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 border border-violet-200/60 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700/30 shadow-sm backdrop-blur-sm">
                  <FaEdit className="w-3 h-3 mr-1.5" /> In Progress
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-8">
            {/* Score Section - only show if exam is completed */}
            {score !== null && submittedAt !== null && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-100/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                    Final Score
                  </p>
                  <p className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {score}%
                  </p>
                </div>
              </div>
            )}

            {/* Exam Information Grid */}
            <ExamProgressInfo
              pagination={pagination}
              examState={examState}
              submittedAt={submittedAt}
            />

            {/* Custom Prompt Display */}
            {examState?.custom_prompt_text && (
              <ExamCustomPromptDisplay customPromptText={examState.custom_prompt_text} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
