'use client';

import React from 'react';
import { FaCheck, FaEdit, FaLightbulb, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';

interface ExamStatusCardProps {
  examState: any;
  submittedAt: string | null;
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
    <div className="mb-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-xl overflow-hidden">
      {/* Status Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-violet-50/50 via-blue-50/30 to-purple-50/50 dark:from-violet-900/20 dark:via-blue-900/15 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
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
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 border border-emerald-200/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30">
                <FaCheck className="w-3 h-3 mr-1.5" />
                {examState?.status === 'PASSED'
                  ? 'Completed'
                  : examState?.status === 'FAILED'
                  ? 'Completed'
                  : 'Completed'}
              </span>
            ) : examState?.exam_status === 'QUESTIONS_GENERATING' ? (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200/50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-700 border-t-transparent mr-1.5"></div>
                Generating Questions
              </span>
            ) : examState?.exam_status === 'QUESTION_GENERATION_FAILED' ? (
              <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-200/50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30">
                <FaTimes className="w-3 h-3 mr-1.5" /> Generation Failed
              </span>
            ) : examState?.exam_status === 'READY' ? (
              <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 border border-green-200/50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30">
                <FaCheck className="w-3 h-3 mr-1.5" /> Ready
              </span>
            ) : examState?.exam_status === 'PENDING_QUESTIONS' ? (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 border border-yellow-200/50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30">
                <FaEdit className="w-3 h-3 mr-1.5" /> Pending
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 border border-violet-200/50 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700/30">
                <FaEdit className="w-3 h-3 mr-1.5" /> In Progress
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-4 sm:px-6 sm:py-6">
        <div className="space-y-6">
          {/* Score Section - only show if exam is completed */}
          {score !== null && submittedAt !== null && (
            <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="text-center">
                <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  Final Score
                </p>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {score}%
                </p>
              </div>
            </div>
          )}

          {/* Exam Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Questions */}
            <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-lg flex items-center justify-center shadow-sm">
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Questions
                  </p>
                </div>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
                  {pagination?.totalItems || examState?.total_questions || '...'}
                </p>
              </div>
            </div>

            {/* Started Date */}
            <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 rounded-lg flex items-center justify-center shadow-sm">
                    <svg
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Started
                  </p>
                </div>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
                  {examState?.started_at
                    ? new Date(examState.started_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '...'}
                </p>
              </div>
            </div>

            {/* Progress or Submission Date */}
            {submittedAt !== null ? (
              <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 rounded-lg flex items-center justify-center shadow-sm">
                      <FaCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Submitted
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
                    {new Date(submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-800/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-4 h-4 text-violet-600 dark:text-violet-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Progress
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
                    {pagination?.currentPage && pagination?.totalPages
                      ? `${pagination.currentPage}/${pagination.totalPages}`
                      : 'Active'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Custom Prompt Display */}
          {examState?.custom_prompt_text && (
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
                    &ldquo;{examState.custom_prompt_text}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
