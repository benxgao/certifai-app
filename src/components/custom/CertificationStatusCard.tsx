'use client';

import React from 'react';
import { ActionButton } from './ActionButton';
import ResponsiveTooltip from '@/src/components/custom/ResponsiveTooltip';
import { InfoTooltip } from '@/src/components/custom/InfoTooltip';
import { StatsCard } from '@/src/components/custom/StatsCard';
import { ExamListItem } from '@/swr/exams';
import { RateLimitInfo } from '@/src/lib/rateLimitUtils';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';
import { StatusBadge } from '@/src/components/ui/status-badge';

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

import { FaRegFileAlt, FaShieldAlt } from 'react-icons/fa';

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

  // Determine certification status
  const getCertificationStatus = () => {
    if (!canCreateExam) return 'inactive';
    if (exams && exams.length > 0) return 'active';
    return 'ready';
  };

  const getCertificationStatusText = () => {
    if (!canCreateExam) return 'Limited Access';
    if (exams && exams.length > 0) return `${exams.length} Exam${exams.length !== 1 ? 's' : ''}`;
    return 'Ready to Start';
  };

  return (
    <DashboardCard className="mb-8">
      <DashboardCardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              {displayCertification?.name || 'Certification Overview'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Monitor your exam progress and create new practice tests
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Certification Status Badge */}
            <StatusBadge
              status={getCertificationStatus()}
              customText={getCertificationStatusText()}
            />

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
      </DashboardCardHeader>

      {/* Rate Limit Info - Simplified Design */}
      {rateLimitInfo && !isLoadingRateLimit && (
        <div className="px-6 sm:px-8 py-4 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-violet-50/70 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-violet-950/20 border-b border-blue-200/40 dark:border-blue-800/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Left side - Info */}
            <div className="flex items-center space-x-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-blue-800 dark:text-blue-200 uppercase tracking-wider">
                    Daily Exam Limit
                  </span>
                  <InfoTooltip content="You can create at most 3 exams every 24 hours to ensure fair usage and optimal system performance." />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {rateLimitInfo.currentCount}/3
                  </span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    exams created today
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Simple Progress Bar */}
            <div className="w-20 h-2 bg-blue-200/60 dark:bg-blue-800/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(rateLimitInfo.currentCount / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <DashboardCardContent>
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Total Exams */}
          <StatsCard
            dotColor="bg-blue-400 dark:bg-blue-500"
            title="Total Exams"
            value={exams?.length || 0}
            variant="overview"
          />

          {/* Completed */}
          <StatsCard
            dotColor="bg-violet-400 dark:bg-violet-500"
            title="Completed"
            value={completedExams}
            subtitle={`${exams?.length || 0} total`}
            variant="overview"
          />

          {/* Average Score */}
          <StatsCard
            dotColor="bg-amber-400 dark:bg-amber-500"
            title="Avg Score"
            value={averageScore > 0 ? `${averageScore}%` : '—'}
            subtitle={
              averageScore > 0
                ? `${exams?.filter((e) => e.score !== null).length || 0} scored`
                : 'No scores yet'
            }
            variant="overview"
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
      </DashboardCardContent>
    </DashboardCard>
  );
}
