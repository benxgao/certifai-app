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
      ? estimateExamGenerationProgress(examState.started_at)
      : null;

  return {
    examState,
    isValidatingExamState,
    forceStatusCheck: () => mutateExamState(),
    generationProgress,
    shouldShowCheckButton: shouldShowStatusCheckButton(examState),
  };
}
