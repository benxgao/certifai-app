'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import { ExamGenerationProgressBar } from '@/src/components/custom/ExamGenerationProgressBar';
import { ExamListItem } from '@/swr/exams';
import { getDerivedExamStatus, getExamStatusInfo } from '@/src/types/exam-status';
import { estimateExamGenerationProgress } from '@/src/lib/examGenerationUtils';

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

import { FaPlay, FaClipboardList, FaChartLine, FaTrophy, FaRedo, FaTrash } from 'react-icons/fa';

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
  // Get typed exam status and info
  const examStatus = getDerivedExamStatus(exam);
  const statusInfo = getExamStatusInfo(examStatus);
  const isCompleted = exam.submitted_at !== null;
  const hasStarted = exam.started_at !== null;
  const hasScore = exam.score !== null && exam.score !== undefined;

  // Calculate generation progress for generating exams
  const generationEstimate =
    examStatus === 'generating' && exam.started_at
      ? estimateExamGenerationProgress(exam.started_at, {
          totalBatches: Math.ceil((exam.total_questions || 25) / 5), // Estimate 5 questions per batch
          estimatedCompletionTime: Math.max(120000, (exam.total_questions || 25) * 5000), // 5 seconds per question minimum, 2 minutes minimum
          averageBatchTime: 45000, // 45 seconds per batch
          questionsGenerated: 0, // We don't have this data in the list view
          totalQuestions: exam.total_questions || 25,
        })
      : null;

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group">
      <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left section: Title and metadata */}
          <div className="flex-1 min-w-0">
            {/* Exam ID indicator */}
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-600">
                Exam #{exam.exam_id.toString().substring(0, 8)}
              </span>
            </div>

            {/* Timing information */}
            <div className="text-sm text-slate-500 dark:text-slate-300 space-y-1">
              {isCompleted && exam.submitted_at ? (
                <>
                  {/* Show started date for completed exams */}
                  {hasStarted && exam.started_at && (
                    <p>
                      Started:{' '}
                      {new Date(exam.started_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  <p>
                    Completed:{' '}
                    {new Date(exam.submitted_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {/* Show duration if both dates are available */}
                  {hasStarted &&
                    exam.started_at &&
                    (() => {
                      const startTime = new Date(exam.started_at).getTime();
                      const endTime = new Date(exam.submitted_at).getTime();
                      const durationMs = endTime - startTime;
                      const durationMinutes = Math.round(durationMs / (1000 * 60));
                      const hours = Math.floor(durationMinutes / 60);
                      const minutes = durationMinutes % 60;

                      return (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Duration: {hours > 0 ? `${hours}h ` : ''}
                          {minutes}m
                        </p>
                      );
                    })()}
                </>
              ) : hasStarted && exam.started_at ? (
                <p>
                  Started:{' '}
                  {new Date(exam.started_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              ) : (
                <p>Not yet attempted</p>
              )}
            </div>
          </div>

          {/* Right section: Score display (if available) or progress for in-progress exams */}
          {hasScore || examStatus === 'in_progress' ? (
            <div className="flex-shrink-0 text-right">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-600 shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Score
                </p>
                <p
                  className={`text-xl font-bold ${
                    hasScore
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {hasScore ? `${exam.score}%` : '—'}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Exam Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600/50">
            <div className="flex items-center space-x-2 mb-1">
              <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Questions
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {exam.total_questions || displayCertification?.max_quiz_counts || '25'}
            </p>
          </div>

          {/* Show pass rate or attempts info */}
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600/50">
            <div className="flex items-center space-x-2 mb-1">
              <FaTrophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Status
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {statusInfo.label}
            </p>
          </div>
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

        {/* Action Buttons Section */}
        <div className="space-y-2">
          <div className="space-y-2">
            {/* Delete button for failed exams */}
            {examStatus === 'generation_failed' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onDeleteExam(exam.exam_id)}
                  disabled={isDeletingExam}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-sm font-medium rounded-lg border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {isDeletingExam ? (
                      <ButtonLoadingText
                        isLoading={true}
                        loadingText="Deleting..."
                        defaultText="Deleting..."
                        showSpinner={true}
                        spinnerSize="xs"
                      />
                    ) : (
                      <>
                        <FaTrash className="w-3 h-3" />
                        <span>Delete Exam</span>
                      </>
                    )}
                  </span>
                </Button>
              </div>
            )}

            {/* Error display for delete operation */}
            {deleteExamError && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {deleteExamError.message || 'Failed to delete exam. Please try again.'}
                </p>
              </div>
            )}

            {/* Main Action Button */}
            <div className="flex justify-end pt-1">
              <Button
                onClick={() => onStartExam(exam.exam_id)}
                disabled={
                  navigatingExamId === exam.exam_id ||
                  examStatus === 'generating' ||
                  examStatus === 'generation_failed'
                }
                size="lg"
                className={`exam-action-button w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 ${
                  examStatus === 'completed_successful'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : examStatus === 'completed_review'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : examStatus === 'in_progress'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : examStatus === 'generating'
                    ? 'bg-yellow-100 text-yellow-600 cursor-not-allowed opacity-60 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : examStatus === 'generation_failed'
                    ? 'bg-red-100 text-red-600 cursor-not-allowed opacity-60 dark:bg-red-900/20 dark:text-red-400'
                    : examStatus === 'ready'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {navigatingExamId === exam.exam_id ? (
                  <ButtonLoadingText
                    isLoading={true}
                    loadingText="Loading Exam..."
                    defaultText="Loading Exam..."
                    showSpinner={true}
                    spinnerSize="sm"
                  />
                ) : examStatus === 'generating' ? (
                  <ButtonLoadingText
                    isLoading={true}
                    loadingText="Generating Questions..."
                    defaultText="Generating Questions..."
                    showSpinner={true}
                    spinnerSize="sm"
                  />
                ) : examStatus === 'generation_failed' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="ml-2">Generation Failed</span>
                  </>
                ) : examStatus === 'completed_successful' ? (
                  <>
                    <FaTrophy className="w-4 h-4" />
                    <span className="ml-2">View Certificate</span>
                  </>
                ) : examStatus === 'completed_review' ? (
                  <>
                    <FaChartLine className="w-4 h-4" />
                    <span className="ml-2">View Results & Explanations</span>
                  </>
                ) : examStatus === 'completed' ? (
                  <>
                    <FaChartLine className="w-4 h-4" />
                    <span className="ml-2">View Results</span>
                  </>
                ) : examStatus === 'in_progress' ? (
                  <>
                    <FaRedo className="w-4 h-4" />
                    <span className="ml-2">Resume Exam</span>
                  </>
                ) : examStatus === 'ready' ? (
                  <>
                    <FaPlay className="w-4 h-4" />
                    <span className="ml-2">Begin Exam</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="w-4 h-4" />
                    <span className="ml-2">Begin Exam</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
