'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { ExamGenerationProgressBar } from '@/src/components/custom/ExamGenerationProgressBar';

interface ExamEmptyStateProps {
  examState: any;
  generationProgress: any;
  shouldShowCheckButton: boolean;
  isValidatingExamState: boolean;
  onForceStatusCheck: () => void;
}

export const ExamEmptyState: React.FC<ExamEmptyStateProps> = ({
  examState,
  generationProgress,
  shouldShowCheckButton,
  isValidatingExamState,
  onForceStatusCheck,
}) => {
  return (
    <div className="text-center py-12 mt-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/60 dark:border-slate-700/60">
      {examState?.exam_status === 'QUESTIONS_GENERATING' ? (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Questions are being generated for this exam.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
            Please wait while we prepare your exam questions. This may take a few minutes.
          </p>

          {/* Enhanced progress display */}
          {generationProgress && (
            <div className="mt-6 mb-6 max-w-md mx-auto">
              <ExamGenerationProgressBar
                progress={generationProgress.completionPercentage}
                estimatedTimeRemaining={generationProgress.estimatedTimeRemaining}
                className="w-full"
                showPercentage={true}
                showTimeRemaining={true}
                isAnimated={true}
                realProgress={generationProgress.realProgress}
              />
            </div>
          )}

          {/* Smart check status button - only show when likely complete */}
          {shouldShowCheckButton && (
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onForceStatusCheck}
                disabled={isValidatingExamState}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm"
              >
                {isValidatingExamState ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-2"></div>
                    Checking...
                  </>
                ) : (
                  'Check Status'
                )}
              </Button>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Generation should be complete - click to check
              </p>
            </div>
          )}
        </>
      ) : examState?.exam_status === 'QUESTION_GENERATION_FAILED' ? (
        <>
          <FaTimes className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Question generation failed for this exam.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </>
      ) : examState?.exam_status === 'PENDING_QUESTIONS' ? (
        <>
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEdit className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            This exam is pending question setup.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
            Please wait while the exam is being prepared.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            No questions are currently available for this exam.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
            This might be an issue with the exam setup or the API.
          </p>
        </>
      )}
    </div>
  );
};
