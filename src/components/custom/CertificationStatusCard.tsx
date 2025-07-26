'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import ResponsiveTooltip from '@/src/components/custom/ResponsiveTooltip';
import { ExamListItem } from '@/swr/exams';
import { CertificationListItem } from '@/src/swr/certifications';
import { RateLimitInfo } from '@/src/lib/rateLimitUtils';

// Flexible certification type to handle different certification objects
type CertificationData = {
  cert_id?: number;
  name?: string;
  min_quiz_counts?: number;
  max_quiz_counts?: number;
  pass_score?: number;
  firm_id?: number;
  exam_guide_url?: string;
} | null;
import { FaClipboardList, FaChartLine, FaRegFileAlt } from 'react-icons/fa';

interface CertificationStatusCardProps {
  displayCertification: CertificationData;
  exams: ExamListItem[] | null;
  rateLimitInfo: RateLimitInfo | null;
  isLoadingRateLimit: boolean;
  onCreateExamClick: () => void;
  canCreateExam: boolean;
}

export function CertificationStatusCard({
  displayCertification,
  exams,
  rateLimitInfo,
  isLoadingRateLimit,
  onCreateExamClick,
  canCreateExam,
}: CertificationStatusCardProps) {
  return (
    <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
      {/* Status Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-50">
              {displayCertification?.name || 'Certification Overview'}
            </h2>
          </div>

          {/* Action Buttons - desktop only */}
          <div className="hidden sm:flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              size="lg"
              className="exam-action-button w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base bg-slate-500 hover:bg-slate-600 focus:bg-slate-600 active:bg-slate-300 text-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:bg-slate-600 dark:active:bg-slate-500 dark:text-slate-100 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!canCreateExam}
              onClick={onCreateExamClick}
            >
              <FaRegFileAlt className="w-4 h-4 mr-2" />
              New Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Rate Limit Summary */}
      {rateLimitInfo && !isLoadingRateLimit && (
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 border-b border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-blue-900/50 rounded-full flex items-center justify-center shadow-sm">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Exam Creation Limit
                  </span>
                  <ResponsiveTooltip
                    content="You can create at most 3 exams every 24 hours to ensure fair usage and optimal system performance."
                    className="max-w-[280px]"
                  >
                    <svg
                      className="w-5 h-5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </ResponsiveTooltip>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    {rateLimitInfo.currentCount}/3
                  </span>
                  <span className="text-sm text-blue-700 dark:text-blue-300">exams used</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        <div className="space-y-6">
          {/* Certification Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Exams */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Exams
                  </p>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                  {exams ? exams.length : '...'}
                </p>
              </div>
            </div>

            {/* Questions per Exam */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Questions
                  </p>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                  {displayCertification?.max_quiz_counts || '25'}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FaChartLine className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Progress
                  </p>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                  {exams && exams.length > 0
                    ? `${exams.filter((exam) => exam.submitted_at !== null).length}/${exams.length}`
                    : '0/0'}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile New Exam Button */}
          <div className="sm:hidden mt-6">
            <Button
              size="lg"
              className="exam-action-button w-full font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:bg-slate-600 dark:active:bg-slate-500 dark:text-slate-100 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!canCreateExam}
              onClick={onCreateExamClick}
            >
              <FaRegFileAlt className="w-4 h-4 mr-2" />
              New Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
