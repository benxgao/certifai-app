'use client';

import React from 'react';
import { ActionButton } from './ActionButton';
import ResponsiveTooltip from '@/src/components/custom/ResponsiveTooltip';
import { StatsCard } from '@/src/components/custom/StatsCard';
import { ExamListItem } from '@/swr/exams';
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

import {
  FaClipboardList,
  FaChartLine,
  FaRegFileAlt,
  FaCertificate,
  FaTrophy,
  FaClock,
} from 'react-icons/fa';

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
  // Calculate stats
  const completedExams = exams?.filter((exam) => exam.submitted_at !== null).length || 0;
  const averageScore =
    exams && exams.length > 0
      ? Math.round(
          exams
            .filter((exam) => exam.score !== null)
            .reduce((sum, exam) => sum + (exam.score || 0), 0) /
            exams.filter((exam) => exam.score !== null).length,
        ) || 0
      : 0;

  return (
    <div className="mb-8 relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden">
      {/* Decorative gradient orbs - matching dashboard */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                {displayCertification?.name || 'Certification Overview'}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Monitor your exam progress and create new practice tests
              </p>
            </div>

            {/* Desktop Action Button */}
            <div className="hidden sm:flex">
              <ActionButton
                size="lg"
                variant="primary"
                className="shadow-md hover:shadow-lg transition-all duration-200"
                disabled={!canCreateExam}
                onClick={onCreateExamClick}
                icon={<FaRegFileAlt className="w-4 h-4" />}
              >
                New Exam
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Rate Limit Info - Enhanced Design */}
        {rateLimitInfo && !isLoadingRateLimit && (
          <div className="px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/80 dark:bg-blue-900/50 rounded-xl flex items-center justify-center shadow-sm">
                  <FaClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      Exam Creation Limit
                    </span>
                    <ResponsiveTooltip content="You can create at most 3 exams every 24 hours to ensure fair usage and optimal system performance.">
                      <svg
                        className="w-4 h-4 text-blue-600/70 dark:text-blue-400/70"
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
                  <div className="flex items-center space-x-2 mt-1">
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

        {/* Enhanced Stats Grid */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Exams */}
            <StatsCard
              icon={<FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              title="Total Exams"
              value={exams?.length || 0}
            />

            {/* Questions per Exam */}
            <StatsCard
              icon={<FaCertificate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              title="Questions"
              value={displayCertification?.max_quiz_counts || 25}
              subtitle="per exam"
            />

            {/* Completed */}
            <StatsCard
              icon={<FaTrophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
              title="Completed"
              value={completedExams}
              subtitle={`${exams?.length || 0} total`}
            />

            {/* Average Score */}
            <StatsCard
              icon={<FaChartLine className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              title="Avg Score"
              value={averageScore > 0 ? `${averageScore}%` : '—'}
              subtitle={
                averageScore > 0
                  ? `${exams?.filter((e) => e.score !== null).length || 0} scored`
                  : 'No scores yet'
              }
            />
          </div>

          {/* Mobile Action Button */}
          <div className="sm:hidden">
            <ActionButton
              size="lg"
              variant="primary"
              className="shadow-md hover:shadow-lg transition-all duration-200"
              disabled={!canCreateExam}
              onClick={onCreateExamClick}
              icon={<FaRegFileAlt className="w-4 h-4" />}
              fullWidth
            >
              New Exam
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
