'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface ExamProgressInfoProps {
  pagination: any;
  examState: any;
  submittedAt: number | null;
}

export const ExamProgressInfo: React.FC<ExamProgressInfoProps> = ({
  pagination,
  examState,
  submittedAt,
}) => {
  return (
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
  );
};
