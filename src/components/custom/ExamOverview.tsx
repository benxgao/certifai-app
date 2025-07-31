'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { format, isToday, isThisYear, isValid, parseISO } from 'date-fns';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useExamInfo } from '@/src/swr/examInfo';

interface ExamOverviewProps {
  examId: string | null;
  pagination?: any; // Fallback for pagination data
  fallbackSubmittedAt?: number | null; // Fallback for submitted at
}

export const ExamOverview: React.FC<ExamOverviewProps> = ({
  examId,
  pagination,
  fallbackSubmittedAt,
}) => {
  const { apiUserId } = useFirebaseAuth();

  // Fetch exam info data independently
  const { examInfoData, isLoadingExamInfo, examInfoError } = useExamInfo(apiUserId, examId);

  // Use exam info data if available, otherwise fall back to props
  const totalQuestions = examInfoData?.total_questions || pagination?.totalItems;
  const submittedAt = examInfoData?.submitted_at || fallbackSubmittedAt;

  // Helper function to format the started date using date-fns
  const formatStartedDate = (startedAt: string | null | undefined) => {
    if (!startedAt) {
      return 'Not Started';
    }

    try {
      let startDate: Date;

      // Handle different date formats that might come from the backend
      if (typeof startedAt === 'string') {
        // Try to parse as ISO string first (most common from APIs)
        startDate = parseISO(startedAt);

        // If that fails, try regular Date constructor
        if (!isValid(startDate)) {
          startDate = new Date(startedAt);
        }
      } else {
        startDate = new Date(startedAt);
      }

      // Check if the date is valid after parsing attempts
      if (!isValid(startDate)) {
        return 'Invalid Date';
      }

      // Format based on recency
      if (isToday(startDate)) {
        // If today, show time only (e.g., "2:30 PM")
        return format(startDate, 'h:mm a');
      } else if (isThisYear(startDate)) {
        // If this year, show month/day and time (e.g., "Jan 15, 2:30 PM")
        return format(startDate, 'MMM d, h:mm a');
      } else {
        // If different year, include year (e.g., "Jan 15, 2023 2:30 PM")
        return format(startDate, 'MMM d, yyyy h:mm a');
      }
    } catch (error) {
      console.error('Error formatting started_at date:', error, startedAt);
      return 'Date Error';
    }
  };

  // Show loading state if data is being fetched
  if (isLoadingExamInfo) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm animate-pulse"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
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
            {totalQuestions || '...'}
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
            {formatStartedDate(examInfoData?.started_at)}
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
              {submittedAt ? format(new Date(submittedAt), 'MMM d, h:mm a') : 'Not Submitted'}
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
