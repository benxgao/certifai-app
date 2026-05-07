import { useEffect, useRef } from 'react';
import { toastHelpers } from '@/src/lib/toast';
import { ExamState } from '@/src/swr/exams';
import {
  BackendExamStatus,
  isExamGeneratingStatus,
  isGenerationCompletedTransition,
  isGenerationFailedTransition,
} from '@/src/types/exam-status';

/**
 * Hook to detect exam status changes and provide user feedback
 * Particularly useful for detecting when generation completes
 */
export function useExamStatusNotifications(examState: ExamState | null | undefined) {
  const previousStatusRef = useRef<BackendExamStatus | null>(null);
  const notificationShownRef = useRef<boolean>(false);

  useEffect(() => {
    const currentStatus = examState?.exam_status;
    const previousStatus = previousStatusRef.current;

    // Detect when exam generation completes
    if (
      isGenerationCompletedTransition(previousStatus, currentStatus) &&
      !notificationShownRef.current
    ) {
      // Show success notification
      toastHelpers.success.examCreated();

      // Add a specific info toast for generation completion
      setTimeout(() => {
        toastHelpers.info.examAutoSave(); // Use existing auto-save info toast
      }, 1000);
      notificationShownRef.current = true;

      // Optional: Play a subtle notification sound
      if ('Audio' in window) {
        try {
          // Using a short, pleasant notification sound
          const audio = new Audio(
            'data:audio/wav;base64,UklGRvwAAABXQVZFZm10IBAAAAABAAABAA4AAAAgAAAAAQAQAGRhdGDYAAAA',
          );
          audio.volume = 0.1; // Keep it subtle
          audio.play().catch(() => {}); // Ignore if audio fails
        } catch (e) {
          // Audio not supported or failed, ignore
        }
      }
    }

    // Detect generation failure
    if (isGenerationFailedTransition(previousStatus, currentStatus)) {
      toastHelpers.error.examCreationFailed(
        'Exam generation failed. Please try creating a new exam.',
      );
    }

    // Reset notification flag if user starts a new generation
    if (isExamGeneratingStatus(currentStatus) && !isExamGeneratingStatus(previousStatus)) {
      notificationShownRef.current = false;
    }

    previousStatusRef.current = currentStatus ?? null;
  }, [examState?.exam_status]);

  // Return utility to manually reset notifications (useful for testing)
  return {
    resetNotifications: () => {
      notificationShownRef.current = false;
      previousStatusRef.current = null;
    },
  };
}
