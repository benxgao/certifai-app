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
  const isInitialMount = useRef(true);
  const hasStableState = useRef(false);
  const lastRequestTime = useRef<number>(0);
  const REQUEST_COOLDOWN = 5000; // 5 seconds minimum between requests

  // Force immediate status check only on initial mount and only if needed
  useEffect(() => {
    if (
      apiUserId &&
      certId &&
      examId &&
      isInitialMount.current &&
      !examState &&
      !hasStableState.current
    ) {
      // Only do immediate check if we haven't made a request recently
      const now = Date.now();
      if (now - lastRequestTime.current > REQUEST_COOLDOWN) {
        mutateExamState();
        lastRequestTime.current = now;
      }
      isInitialMount.current = false;
    }
  }, [apiUserId, certId, examId, examState, mutateExamState]);

  // Set up smart polling only for generating exams and stop all polling for stable states
  useEffect(() => {
    const currentStatus = examState?.exam_status;

    // Mark as stable state to prevent future unnecessary requests
    if (
      currentStatus &&
      currentStatus !== 'QUESTIONS_GENERATING' &&
      currentStatus !== 'PENDING_QUESTIONS'
    ) {
      hasStableState.current = true;
    }

    if (currentStatus === 'QUESTIONS_GENERATING' && !hasStableState.current) {
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      // Use smart polling interval based on estimated progress
      const pollingInterval = getSmartPollingInterval(examState);

      // Only start polling if interval is greater than 0
      if (pollingInterval > 0) {
        checkIntervalRef.current = setInterval(() => {
          const now = Date.now();
          // Only make request if not already validating, not in stable state, and cooldown has passed
          if (
            !isValidatingExamState &&
            !hasStableState.current &&
            now - lastRequestTime.current > REQUEST_COOLDOWN
          ) {
            mutateExamState();
            lastRequestTime.current = now;
          }
        }, Math.max(pollingInterval, REQUEST_COOLDOWN)); // Ensure minimum interval respects cooldown
      }

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    } else {
      // Clear polling for non-generating states or stable states
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    }
  }, [examState, mutateExamState, isValidatingExamState]);

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
