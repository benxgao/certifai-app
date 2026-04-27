'use client';

import React, { useState, useEffect, memo } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { FaPlay, FaClipboardList, FaChartLine, FaTrophy, FaRedo } from 'react-icons/fa';
import { ExamReport } from './ExamReport';
import { CustomAccordion } from './CustomAccordion';
import { ActionButton } from './ActionButton';
import { DeleteIconButton } from './DeleteIconButton';
import { ExamGenerationProgressBar } from '@/src/components/custom/ExamGenerationProgressBar';
import { DeleteExamModal } from '@/src/components/custom/DeleteExamModal';
import { ExamListItem } from '@/swr/exams';
import {
  getDerivedExamStatus,
  getExamStatusInfo,
  ExamGenerationStage,
} from '@/src/types/exam-status';
import { useExamLiveStatus } from '@/src/swr/useExamLiveStatus';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

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

interface ExamCardProps {
  exam: ExamListItem;
  displayCertification: CertificationData;
  onStartExam: (examId: string) => void;
  onDeleteExam: (examId: string) => Promise<void>;
  navigatingExamId: string | null;
  isDeletingExam: boolean;
  deleteExamError: any;
}

export const ExamCard = memo(function ExamCard({
  exam,
  displayCertification,
  onStartExam,
  onDeleteExam,
  navigatingExamId,
  isDeletingExam,
  deleteExamError,
}: ExamCardProps) {
  const { apiUserId } = useFirebaseAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Use real-time progress tracking for generating exams via live-status endpoint
  // Only poll if backend says it's actively generating
  const { liveStatus } = useExamLiveStatus(
    apiUserId || null,
    exam.exam_id || null,
    exam.exam_status === 'QUESTIONS_GENERATING', // Poll only during active generation
  );

  // Get typed exam status and info
  let examStatus = getDerivedExamStatus(exam);

  // OVERRIDE: If live-status shows generation is complete (100%, is_complete=true),
  // override the derived status to 'ready' to prevent UI flashing when the database
  // is still catching up with the backend exam_status field transition
  const isGenerationComplete =
    liveStatus?.is_complete === true && liveStatus?.progress_percentage === 100;

  if (isGenerationComplete && (examStatus === 'generating' || examStatus === 'in_progress')) {
    examStatus = 'ready';
  }

  const statusInfo = getExamStatusInfo(examStatus);
  const isCompleted = exam.submitted_at !== null;
  const hasStarted = exam.started_at !== null;
  const hasScore = exam.score !== null && exam.score !== undefined;

  // Convert status labels to one-word alternatives
  const getOneWordStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'Not Started': 'Pending',
      Ready: 'Ready',
      'Generating Questions...': 'Generating',
      'Generation Failed': 'Failed',
      'In Progress': 'Active',
      Completed: 'Done',
      'Score Above Threshold': 'Excellent',
      'Score Below Threshold': 'Review',
    };
    return statusMap[status] || status;
  };
  const generationEstimate =
    liveStatus && examStatus === 'generating'
      ? {
          completionPercentage: liveStatus.progress_percentage,
          estimatedTimeRemaining: liveStatus.estimated_seconds_remaining * 1000,
          isLikelyComplete: liveStatus.is_complete,
          stage: liveStatus.is_complete
            ? ExamGenerationStage.Complete
            : ExamGenerationStage.Generating,
          realProgress: {
            currentBatch: Math.ceil(
              (liveStatus.topics_with_questions / liveStatus.total_topics) * 5,
            ),
            totalBatches: 5,
            questionsGenerated: liveStatus.topics_with_questions,
            targetQuestions: liveStatus.total_topics,
          },
        }
      : null;

  // Determine button variant based on exam status
  const getButtonVariant = () => {
    switch (examStatus) {
      case 'completed_successful':
      case 'completed_review':
      case 'completed':
        return 'success' as const;
      case 'in_progress':
        return 'primary' as const;
      case 'ready':
        return 'primary' as const;
      case 'generating':
      case 'generation_failed':
        return 'secondary' as const;
      default:
        return 'primary' as const;
    }
  };

  // Get button text and icon
  const getButtonContent = () => {
    if (navigatingExamId === exam.exam_id) {
      return { text: 'Loading Exam...', icon: null };
    }

    switch (examStatus) {
      case 'generating':
        return { text: 'Generating Questions...', icon: null };
      case 'generation_failed':
        return {
          text: 'Generation Failed',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
      case 'completed_successful':
        return { text: 'View Results & Certificate', icon: <FaTrophy className="w-4 h-4" /> };
      case 'completed_review':
        return {
          text: 'View Results & Explanations',
          icon: <FaClipboardList className="w-4 h-4" />,
        };
      case 'completed':
        return { text: 'View Results', icon: <FaChartLine className="w-4 h-4" /> };
      case 'in_progress':
        return { text: 'Resume Exam', icon: <FaRedo className="w-4 h-4" /> };
      case 'ready':
        return { text: 'Begin Exam', icon: <FaPlay className="w-4 h-4" /> };
      default:
        return { text: 'Begin Exam', icon: <FaPlay className="w-4 h-4" /> };
    }
  };

  const buttonContent = getButtonContent();

  useEffect(() => {
    console.log(`
      | progress: ${liveStatus?.progress_percentage}
      | examStatus: ${examStatus}`);
  }, [examStatus, liveStatus]);

  return (
    <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl hover:shadow-3xl hover:shadow-violet-500/10 dark:hover:shadow-violet-400/10 transition-all duration-500 rounded-xl overflow-hidden group">
      {/* Enhanced decorative orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/30 dark:bg-violet-600/20 rounded-bl-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-100/20 dark:bg-emerald-600/10 rounded-tr-full blur-lg"></div>

      {/* Enhanced delete button with better styling */}
      <DeleteIconButton
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isDeletingExam}
        title="Delete this exam"
        className="absolute top-4 right-4 z-20"
        data-testid="exam-card-delete-button"
      />

      <div className="relative z-10">
        {/* Enhanced header section */}
        <div className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-700/60 p-5 sm:p-7 backdrop-blur-sm">
          {/* Enhanced exam ID badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-violet-100/80 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-bold border border-violet-200/60 dark:border-violet-700/60 shadow-md backdrop-blur-sm tracking-wide">
              Exam #{exam.exam_id.toString().substring(0, 8)}
            </span>
          </div>

          {/* Enhanced timing information with better visual hierarchy */}
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            {isCompleted && exam.submitted_at ? (
              <div className="space-y-1.5">
                {/* Show started date for completed exams */}
                {hasStarted && exam.started_at && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500"></div>
                    <span className="font-medium text-slate-500 dark:text-slate-400">Started:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                      {format(new Date(exam.started_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500"></div>
                  <span className="font-medium text-slate-500 dark:text-slate-400">Completed:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    {format(new Date(exam.submitted_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
                {/* Show duration if both dates are available */}
                {hasStarted &&
                  exam.started_at &&
                  (() => {
                    const startTime = new Date(exam.started_at);
                    const endTime = new Date(exam.submitted_at);
                    const durationMinutes = differenceInMinutes(endTime, startTime);
                    const hours = Math.floor(durationMinutes / 60);
                    const minutes = durationMinutes % 60;

                    return (
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500"></div>
                        <span>Duration:</span>
                        <span className="font-semibold text-violet-600 dark:text-violet-400">
                          {hours > 0 ? `${hours}h ` : ''}
                          {minutes}m
                        </span>
                      </div>
                    );
                  })()}
              </div>
            ) : hasStarted && exam.started_at ? (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500"></div>
                <span className="font-medium text-slate-500 dark:text-slate-400">Started:</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {format(new Date(exam.started_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <span className="text-slate-500 dark:text-slate-400 italic">Not yet attempted</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced main content section */}
        <div className="p-5 sm:p-7">
          {/* Enhanced exam statistics with better visual hierarchy */}
          <div
            className={`grid gap-4 sm:gap-5 mb-8 ${
              hasScore ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {/* Enhanced Questions Badge */}
            <div className="relative bg-blue-50/90 dark:bg-blue-900/30 p-5 sm:p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/40 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 hover:border-blue-300/70 dark:hover:border-blue-600/60 transition-all duration-400 group/stat backdrop-blur-md overflow-hidden">
              {/* Subtle decorative element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 dark:bg-blue-400/10 rounded-bl-full group-hover/stat:scale-110 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500"></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Questions
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {exam.total_questions || displayCertification?.max_quiz_counts || '25'}
                </p>
              </div>
            </div>

            {/* Enhanced Status Badge */}
            <div className="relative bg-cyan-50/90 dark:bg-cyan-900/30 p-5 sm:p-6 rounded-2xl border border-cyan-200/50 dark:border-cyan-700/40 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:border-cyan-300/70 dark:hover:border-cyan-600/60 transition-all duration-400 group/stat backdrop-blur-md overflow-hidden">
              {/* Subtle decorative element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-200/20 dark:bg-cyan-400/10 rounded-bl-full group-hover/stat:scale-110 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 dark:bg-cyan-500"></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                  {getOneWordStatus(statusInfo.label)}
                </p>
              </div>
            </div>

            {/* Enhanced Score Badge with celebration effect */}
            {hasScore && (
              <div className="relative bg-emerald-50/90 dark:bg-emerald-900/30 p-5 sm:p-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/40 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 hover:border-emerald-300/70 dark:hover:border-emerald-600/60 transition-all duration-400 group/stat backdrop-blur-md overflow-hidden">
                {/* Celebration sparkle effect for high scores */}
                {exam.score && exam.score >= (displayCertification?.pass_score || 80) && (
                  <div className="absolute inset-0 bg-emerald-100/20 dark:bg-emerald-400/10 animate-pulse"></div>
                )}
                {/* Subtle decorative element */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200/20 dark:bg-emerald-400/10 rounded-bl-full group-hover/stat:scale-110 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Score
                    </span>
                    {exam.score && exam.score >= (displayCertification?.pass_score || 80) && (
                      <FaTrophy className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                    )}
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {exam.score}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Generation Progress Bar */}
          {examStatus === 'generating' && generationEstimate && !isGenerationComplete && (
            <div className="mt-6 p-5 sm:p-6 bg-violet-50/90 dark:bg-violet-950/40 rounded-2xl border border-violet-200/60 dark:border-violet-700/50 shadow-lg backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Generating Questions
                </span>
              </div>
              <ExamGenerationProgressBar
                progress={generationEstimate.completionPercentage}
                estimatedTimeRemaining={generationEstimate.estimatedTimeRemaining}
                stage={generationEstimate.stage}
                className="w-full"
                showPercentage={true}
                showTimeRemaining={true}
                isAnimated={true}
              />
            </div>
          )}

          {/* Enhanced Action Button Section */}
          <div className="space-y-4 pt-4">
            {/* Main action button with premium styling */}
            <ActionButton
              onClick={() => onStartExam(exam.exam_id)}
              disabled={
                navigatingExamId === exam.exam_id ||
                examStatus === 'generating' ||
                examStatus === 'generation_failed'
              }
              variant={getButtonVariant()}
              size="lg"
              className="w-full font-bold px-6 sm:px-8 py-3.5 sm:py-4 text-base shadow-xl hover:shadow-2xl hover:shadow-violet-500/25 dark:hover:shadow-violet-400/20 transition-all duration-500 rounded-xl backdrop-blur-sm border-0 focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
              isLoading={navigatingExamId === exam.exam_id || examStatus === 'generating'}
              loadingText={
                navigatingExamId === exam.exam_id ? 'Loading Exam...' : 'Generating Questions...'
              }
              icon={buttonContent.icon}
            >
              {buttonContent.text}
            </ActionButton>

            {/* Enhanced Error display */}
            {deleteExamError && (
              <div className="p-4 sm:p-5 bg-red-50/90 dark:bg-red-900/30 border border-red-200/60 dark:border-red-700/50 rounded-xl backdrop-blur-sm shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500"></div>
                  <p className="text-sm sm:text-base text-red-700 dark:text-red-300 font-medium">
                    {deleteExamError.message || 'Failed to delete exam. Please try again.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Exam Report Section */}
          {isCompleted && (
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-6 mt-6">
              <CustomAccordion
                items={[
                  {
                    id: 'exam-report',
                    icon: (
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl group-hover:bg-violet-100/80 dark:group-hover:bg-violet-800/60 transition-all duration-300 shadow-sm">
                        <FaChartLine className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300" />
                      </div>
                    ),
                    trigger: (
                      <div>
                        <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                          AI Exam Report
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Detailed performance analysis and insights
                        </p>
                      </div>
                    ),
                    content: (
                      <ExamReport
                        examId={exam.exam_id}
                        isCompleted={isCompleted}
                        className="border-0 mt-0 pt-0"
                      />
                    ),
                  },
                ]}
                type="single"
                collapsible={true}
                variant="default"
                className=""
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteExamModal
        exam={exam}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteExam}
        isDeleting={isDeletingExam}
      />
    </div>
  );
});
