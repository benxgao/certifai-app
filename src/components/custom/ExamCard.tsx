'use client';

import React from 'react';
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
    <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-100/20 to-transparent dark:from-violet-900/10 rounded-bl-full"></div>

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-slate-50/80 to-violet-50/20 dark:from-slate-700/50 dark:to-violet-950/20 border-b border-slate-100 dark:border-slate-700/50 p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left section: Title and metadata */}
            <div className="flex-1 min-w-0">
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
                        <span>
                          {new Date(exam.started_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    )}
                    <p className="flex items-center space-x-2">
                      <span className="font-medium">Completed:</span>
                      <span>
                        {new Date(exam.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
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
                    <span>
                      {new Date(exam.started_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">Not yet attempted</p>
                )}
              </div>
            </div>

            {/* Right section: Score display - Enhanced design */}
            {hasScore || examStatus === 'in_progress' ? (
              <div className="flex-shrink-0">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-600/60 shadow-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center font-semibold">
                    Score
                  </p>
                  <div
                    className={`text-2xl font-bold text-center ${
                      hasScore
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {hasScore ? `${exam.score}%` : '—'}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6">
          {/* Exam Statistics - Enhanced with StatsCard styling */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-slate-50 to-violet-50/30 dark:from-slate-700/50 dark:to-violet-900/30 p-4 rounded-lg border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md transition-all duration-200 group">
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

            <div className="bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-700/50 dark:to-amber-900/30 p-4 rounded-lg border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md transition-all duration-200 group">
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
            {/* Delete button for failed exams - Enhanced styling */}
            {examStatus === 'generation_failed' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onDeleteExam(exam.exam_id)}
                  disabled={isDeletingExam}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 text-sm font-medium rounded-lg border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 hover:text-red-800 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-600 dark:hover:text-red-300 shadow-sm hover:shadow-md transition-all duration-200"
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

            {/* Error display for delete operation - Enhanced styling */}
            {deleteExamError && (
              <div className="p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/60 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {deleteExamError.message || 'Failed to delete exam. Please try again.'}
                </p>
              </div>
            )}

            {/* Enhanced Main Action Button */}
            <div className="flex justify-end pt-1">
              <Button
                onClick={() => onStartExam(exam.exam_id)}
                disabled={
                  navigatingExamId === exam.exam_id ||
                  examStatus === 'generating' ||
                  examStatus === 'generation_failed'
                }
                size="lg"
                className={`w-full sm:w-auto font-semibold px-6 py-3 text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                  examStatus === 'completed_successful'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0'
                    : examStatus === 'completed_review'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
                    : examStatus === 'in_progress'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0'
                    : examStatus === 'generating'
                    ? 'bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 cursor-not-allowed opacity-70 border border-amber-300 dark:border-amber-700'
                    : examStatus === 'generation_failed'
                    ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300 cursor-not-allowed opacity-70 border border-red-300 dark:border-red-700'
                    : examStatus === 'ready'
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0'
                    : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0'
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
      </div>
    </div>
  );
}
