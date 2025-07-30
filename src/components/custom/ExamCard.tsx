'use client';

import React, { useState } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { ActionButton } from './ActionButton';
import { ExamGenerationProgressBar } from '@/src/components/custom/ExamGenerationProgressBar';
import { DeleteExamModal } from '@/src/components/custom/DeleteExamModal';
import { ExamListItem } from '@/swr/exams';
import { getDerivedExamStatus, getExamStatusInfo } from '@/src/types/exam-status';
import { useExamGeneratingProgress } from '@/src/swr/useExamGeneratingProgress';
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

import {
  FaPlay,
  FaClipboardList,
  FaChartLine,
  FaTrophy,
  FaRedo,
  FaTrash,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { ExamReport } from './ExamReport';

interface ExamCardProps {
  exam: ExamListItem;
  displayCertification: CertificationData;
  onStartExam: (examId: string) => void;
  onDeleteExam: (examId: string) => Promise<void>;
  navigatingExamId: string | null;
  isDeletingExam: boolean;
  deleteExamError: any;
}

export function ExamCard({
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
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  // Get typed exam status and info
  const examStatus = getDerivedExamStatus(exam);
  const statusInfo = getExamStatusInfo(examStatus);
  const isCompleted = exam.submitted_at !== null;
  const hasStarted = exam.started_at !== null;
  const hasScore = exam.score !== null && exam.score !== undefined;

  // Use simplified progress tracking for generating exams
  const { progress: rawProgress } = useExamGeneratingProgress(
    apiUserId || '',
    exam.exam_id || '',
    exam.exam_status,
  );

  // Transform progress to match expected UI format
  const generationEstimate =
    rawProgress && examStatus === 'generating'
      ? {
          completionPercentage: rawProgress.progress_percentage,
          estimatedTimeRemaining: rawProgress.estimated_time_remaining_seconds * 1000,
          isLikelyComplete: rawProgress.status === 'complete',
          stage: rawProgress.status,
          realProgress: {
            currentBatch: Math.ceil(
              (rawProgress.topics_with_questions / rawProgress.total_topics) * 5,
            ),
            totalBatches: 5,
            questionsGenerated: rawProgress.topics_with_questions,
            targetQuestions: rawProgress.total_topics,
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
        return { text: 'View Results & Explanations', icon: <FaChartLine className="w-4 h-4" /> };
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

  return (
    <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-100/20 to-transparent dark:from-violet-900/10 rounded-bl-full"></div>

      {/* Delete icon at top right corner */}
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isDeletingExam}
        className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/60 dark:border-slate-600/60 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm shadow-sm hover:shadow-md group/delete"
        title="Delete this exam"
      >
        <FaTrash className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover/delete:text-slate-700 dark:group-hover/delete:text-slate-300 group-hover/delete:scale-110 transition-all duration-200" />
      </button>

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-slate-50/80 to-violet-50/20 dark:from-slate-700/50 dark:to-violet-950/20 border-b border-slate-100 dark:border-slate-700/50 p-6">
          {/* Exam ID indicator - Enhanced styling */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold border border-violet-200/60 dark:border-violet-700/60 shadow-sm">
              <FaClipboardList className="w-3 h-3 mr-2" />
              Exam #{exam.exam_id.toString().substring(0, 8)}
            </span>
          </div>

          {/* Timing information - Enhanced layout */}
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            {isCompleted && exam.submitted_at ? (
              <>
                {/* Show started date for completed exams */}
                {hasStarted && exam.started_at && (
                  <p className="flex items-center space-x-2">
                    <span className="font-medium">Started:</span>
                    <span>{format(new Date(exam.started_at), 'MMM d, yyyy HH:mm')}</span>
                  </p>
                )}
                <p className="flex items-center space-x-2">
                  <span className="font-medium">Completed:</span>
                  <span>{format(new Date(exam.submitted_at), 'MMM d, yyyy HH:mm')}</span>
                </p>
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
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                        <span>Duration:</span>
                        <span className="font-medium">
                          {hours > 0 ? `${hours}h ` : ''}
                          {minutes}m
                        </span>
                      </p>
                    );
                  })()}
              </>
            ) : hasStarted && exam.started_at ? (
              <p className="flex items-center space-x-2">
                <span className="font-medium">Started:</span>
                <span>{format(new Date(exam.started_at), 'MMM d, yyyy HH:mm')}</span>
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">Not yet attempted</p>
            )}
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6">
          {/* Exam Statistics - Enhanced with StatsCard styling */}
          <div className="flex gap-4 mb-6">
            {/* Questions Badge - takes up available space */}
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-violet-50/30 dark:from-slate-700/50 dark:to-violet-900/30 p-4 rounded-lg border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Questions
                </span>
              </div>
              <p className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-700 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">
                {exam.total_questions || displayCertification?.max_quiz_counts || '25'}
              </p>
            </div>

            {/* Status Badge - takes up available space */}
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-700/50 dark:to-amber-900/30 p-4 rounded-lg border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaTrophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </span>
              </div>
              <p className="text-lg font-bold bg-gradient-to-r from-slate-900 to-amber-700 dark:from-slate-100 dark:to-amber-300 bg-clip-text text-transparent">
                {statusInfo.label}
              </p>
            </div>

            {/* Score Badge - Square shape, only shown when there's a score */}
            {hasScore && (
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-blue-50/30 dark:from-emerald-900/30 dark:to-blue-900/30 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-700/60 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Score
                </span>
                <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent text-center">
                  {exam.score}%
                </p>
              </div>
            )}
          </div>

          {/* Generation Progress Bar - only show for generating exams */}
          {examStatus === 'generating' && generationEstimate && (
            <div className="mt-4 p-4 bg-gradient-to-r from-violet-50/80 to-blue-50/80 dark:from-violet-950/30 dark:to-blue-950/30 rounded-lg border border-violet-200/60 dark:border-violet-700/60">
              <ExamGenerationProgressBar
                progress={generationEstimate.completionPercentage}
                estimatedTimeRemaining={generationEstimate.estimatedTimeRemaining}
                className="w-full"
                showPercentage={true}
                showTimeRemaining={true}
                isAnimated={true}
              />
            </div>
          )}

          {/* Enhanced Action Buttons Section */}
          <div className="space-y-3 pt-2">
            {/* Main action button - now full width */}
            <ActionButton
              onClick={() => onStartExam(exam.exam_id)}
              disabled={
                navigatingExamId === exam.exam_id ||
                examStatus === 'generating' ||
                examStatus === 'generation_failed'
              }
              variant={getButtonVariant()}
              size="lg"
              className="w-full font-semibold px-6 py-3 text-sm shadow-md hover:shadow-lg transition-all duration-300"
              isLoading={navigatingExamId === exam.exam_id || examStatus === 'generating'}
              loadingText={
                navigatingExamId === exam.exam_id ? 'Loading Exam...' : 'Generating Questions...'
              }
              icon={buttonContent.icon}
            >
              {buttonContent.text}
            </ActionButton>

            {/* Error display for delete operation - Enhanced styling */}
            {deleteExamError && (
              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {deleteExamError.message || 'Failed to delete exam. Please try again.'}
                </p>
              </div>
            )}
          </div>

          {/* Simplified Exam Report Section */}
          {isCompleted && (
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-4 mt-4">
              {/* Report Toggle Button */}
              <button
                onClick={() => setIsReportExpanded(!isReportExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-violet-50/20 dark:from-slate-800/50 dark:to-violet-950/20 border border-slate-200/60 dark:border-slate-600/60 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FaFileAlt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      AI Exam Report
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isReportExpanded ? 'Click to collapse' : 'Click to view detailed analysis'}
                    </p>
                  </div>
                </div>
                {isReportExpanded ? (
                  <FaChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200" />
                ) : (
                  <FaChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200" />
                )}
              </button>

              {/* Collapsible Report Content */}
              {isReportExpanded && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                  <ExamReport
                    examId={exam.exam_id}
                    isCompleted={isCompleted}
                    className="border-0 mt-0 pt-0"
                  />
                </div>
              )}
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
}
