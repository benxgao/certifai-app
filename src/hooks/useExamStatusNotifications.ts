import { useEffect, useRef } from 'react';
import { toastHelpers } from '@/src/lib/toast';

/**
 * Hook to detect exam status changes and provide user feedback
 * Particularly useful for detecting when generation completes
 */
export function useExamStatusNotifications(examState: any) {
  const previousStatusRef = useRef<string | null>(null);
  const notificationShownRef = useRef<boolean>(false);

  useEffect(() => {
    const currentStatus = examState?.exam_status;
    const previousStatus = previousStatusRef.current;

    // Detect when exam generation completes
    if (
      previousStatus === 'QUESTIONS_GENERATING' &&
      currentStatus === 'READY' &&
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
    if (
      previousStatus === 'QUESTIONS_GENERATING' &&
      currentStatus === 'QUESTION_GENERATION_FAILED'
    ) {
      toastHelpers.error.examCreationFailed(
        'Exam generation failed. Please try creating a new exam.',
      );
    }

    // Reset notification flag if user starts a new generation
    if (currentStatus === 'QUESTIONS_GENERATING' && previousStatus !== 'QUESTIONS_GENERATING') {
      notificationShownRef.current = false;
    }

    previousStatusRef.current = currentStatus;
  }, [examState?.exam_status]);

  // Return utility to manually reset notifications (useful for testing)
  return {
    resetNotifications: () => {
      notificationShownRef.current = false;
      previousStatusRef.current = null;
    },
  };
}
