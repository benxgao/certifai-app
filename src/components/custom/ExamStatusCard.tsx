'use client';

import React from 'react';
import { InfoTooltip } from '@/src/components/custom/InfoTooltip';
import { ExamOverview } from './ExamOverview';
import { ExamCustomPromptDisplay } from './ExamCustomPromptDisplay';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';
import { StatusBadge } from '@/src/components/ui/status-badge';

interface ExamStatusCardProps {
  examState: any;
  submittedAt: number | null;
  score: number | null;
  pagination: any;
  examId: string | null;
}

export const ExamStatusCard: React.FC<ExamStatusCardProps> = ({
  examState,
  submittedAt,
  score,
  pagination,
  examId,
}) => {
  return (
    <DashboardCard className="rounded-3xl">
      <DashboardCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 tracking-tight">
              <span>Exam Progress</span>
              <InfoTooltip content="Your answers are automatically saved as you select them. Take your time to review each question carefully." />
            </h2>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            {submittedAt !== null ? (
              <StatusBadge
                status={
                  examState?.status === 'PASSED'
                    ? 'passed'
                    : examState?.status === 'FAILED'
                    ? 'failed'
                    : 'completed'
                }
              />
            ) : examState?.exam_status === 'QUESTIONS_GENERATING' ? (
              <StatusBadge status="generating" />
            ) : examState?.exam_status === 'QUESTION_GENERATION_FAILED' ? (
              <StatusBadge status="generation_failed" />
            ) : examState?.exam_status === 'READY' ? (
              <StatusBadge status="ready" />
            ) : examState?.exam_status === 'PENDING_QUESTIONS' ? (
              <StatusBadge status="pending" />
            ) : (
              <StatusBadge status="in_progress" />
            )}
          </div>
        </div>
      </DashboardCardHeader>

      <DashboardCardContent>
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
          <ExamOverview examId={examId} pagination={pagination} fallbackSubmittedAt={submittedAt} />

          {/* Custom Prompt Display */}
          {examState?.custom_prompt_text && (
            <ExamCustomPromptDisplay customPromptText={examState.custom_prompt_text} />
          )}
        </div>
      </DashboardCardContent>
    </DashboardCard>
  );
};
