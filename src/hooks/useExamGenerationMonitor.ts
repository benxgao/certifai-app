import { useEffect, useRef } from 'react';
import { useExamState } from '@/src/swr/exams';
import {
  getSmartPollingInterval,
  shouldShowStatusCheckButton,
  estimateExamGenerationProgress,
} from '@/src/lib/examGenerationUtils';

/**
 * Hook to monitor exam generation status and force immediate updates
 * This helps reduce the delay between batch completion and status update
 */
export function useExamGenerationMonitor(
  apiUserId: string | null,
  certId: number | null,
  examId: string | null,
) {
  const { examState, mutateExamState, isValidatingExamState } = useExamState(
    apiUserId,
    certId,
    examId,
  );
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastStatusRef = useRef<string | null>(null);

  // Force immediate status check when component mounts or exam ID changes
  useEffect(() => {
    if (apiUserId && certId && examId) {
      // Immediate check on mount
      mutateExamState();

      // Set up smart polling for generating exams
      if (examState?.exam_status === 'QUESTIONS_GENERATING') {
        // Clear any existing interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }

        // Use smart polling interval based on estimated progress
        const pollingInterval = getSmartPollingInterval(examState);

        checkIntervalRef.current = setInterval(() => {
          if (!isValidatingExamState) {
            mutateExamState();
          }
        }, pollingInterval);

        return () => {
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
          }
        };
      }
    }
  }, [apiUserId, certId, examId, examState, mutateExamState, isValidatingExamState]);

  // Clean up interval when status changes from generating
  useEffect(() => {
    const currentStatus = examState?.exam_status;

    if (
      lastStatusRef.current === 'QUESTIONS_GENERATING' &&
      currentStatus !== 'QUESTIONS_GENERATING' &&
      checkIntervalRef.current
    ) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    lastStatusRef.current = currentStatus || null;
  }, [examState?.exam_status]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Calculate generation progress for UI display
  const generationProgress =
    examState?.exam_status === 'QUESTIONS_GENERATING' && examState?.started_at
      ? examState?.generation_progress
        ? // Use real progress data from backend if available
          {
            isLikelyComplete: examState.generation_progress.completion_percentage >= 100,
            estimatedTimeRemaining:
              examState.generation_progress.completion_percentage >= 100 ? 0 : 10000, // 10 seconds if not complete
            completionPercentage: examState.generation_progress.completion_percentage,
            nextCheckTime: 3000, // Check every 3 seconds when we have real data
            stage:
              examState.generation_progress.completion_percentage >= 100
                ? 'complete'
                : 'generating',
            questionsProgress: examState.generation_progress.target_questions
              ? (examState.generation_progress.questions_generated /
                  examState.generation_progress.target_questions) *
                100
              : undefined,
            // Include real batch progress
            realProgress: {
              currentBatch: examState.generation_progress.current_batch,
              totalBatches: examState.generation_progress.total_batches,
              questionsGenerated: examState.generation_progress.questions_generated,
              targetQuestions: examState.generation_progress.target_questions,
            },
          }
        : // Fall back to time-based estimation if no real data
          estimateExamGenerationProgress(examState.started_at, {
            totalBatches: 5, // Default estimate
            estimatedCompletionTime: 180000, // 3 minutes
            averageBatchTime: 35000, // 35 seconds per batch
          })
      : null;

  return {
    examState,
    isValidatingExamState,
    forceStatusCheck: () => mutateExamState(),
    generationProgress,
    shouldShowCheckButton: shouldShowStatusCheckButton(examState),
  };
}
