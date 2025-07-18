import { toast } from 'sonner';

/**
 * Standardized toast notification helpers for consistent UI/UX across the application
 */

export const toastHelpers = {
  // Success notifications
  success: {
    examSubmitted: () =>
      toast.success('🎉 Exam submitted successfully!', {
        description: 'Your answers have been recorded and your score will be calculated.',
        duration: 5000,
      }),

    answerSaved: () =>
      toast.success('Answer saved', {
        description: 'Your answer has been recorded.',
        duration: 2000,
      }),

    examCreated: (examId: string) =>
      toast.success('✅ Exam created successfully!', {
        description: `Your practice exam is ready. Click to start the exam.`,
        duration: 6000,
        action: {
          label: 'Start Exam',
          onClick: () => {
            const currentPath = window.location.pathname;
            const certId = currentPath.split('/')[3]; // Extract cert_id from path
            window.location.href = `/main/certifications/${certId}/exams/${examId}`;
          },
        },
      }),

    profileUpdated: () =>
      toast.success('✅ Profile updated successfully!', {
        description: 'Your changes have been saved.',
        duration: 3000,
      }),

    emailVerificationSent: () =>
      toast.success('📧 Email verification sent!', {
        description: 'Please check your inbox and follow the instructions.',
        duration: 5000,
      }),

    examDeleted: () =>
      toast.success('🗑️ Exam deleted successfully', {
        description: 'The exam has been removed from your account.',
        duration: 3000,
      }),

    certificationRegistered: (certificationName: string) =>
      toast.success('🎓 Registration successful!', {
        description: `Successfully registered for "${certificationName}".`,
        duration: 4000,
      }),
  },

  // Error notifications
  error: {
    examSubmissionFailed: (error?: string) =>
      toast.error('Failed to submit exam', {
        description: error || 'An unexpected error occurred. Please try again.',
        duration: 6000,
      }),

    answerSaveFailed: (error?: string) =>
      toast.error('Failed to save answer', {
        description: error || 'Please try selecting your answer again.',
        duration: 4000,
      }),

    examCreationFailed: (error?: string) =>
      toast.error('Failed to create exam', {
        description: error || 'Unable to create exam. Please try again.',
        duration: 5000,
      }),

    missingInformation: () =>
      toast.error('Cannot submit exam', {
        description: 'Missing necessary information. Please try refreshing the page.',
        duration: 5000,
      }),

    authenticationFailed: () =>
      toast.error('Authentication failed', {
        description: 'Please sign in again to continue.',
        duration: 5000,
      }),

    networkError: () =>
      toast.error('Network error', {
        description: 'Please check your internet connection and try again.',
        duration: 5000,
      }),

    rateLimitExceeded: (resetTime?: string) =>
      toast.error('Rate limit exceeded', {
        description: resetTime
          ? `You've reached the exam creation limit. Try again after ${resetTime}.`
          : "You've reached the exam creation limit. Please try again later.",
        duration: 8000,
      }),

    examRateLimitExceeded: (maxExamsAllowed: number, resetTime?: string) =>
      toast.error('🚫 Exam creation limit reached', {
        description: resetTime
          ? `You've created the maximum ${maxExamsAllowed} exams allowed. Wait until ${resetTime} to create more.`
          : `You've created the maximum ${maxExamsAllowed} exams allowed. Please wait before creating more.`,
        duration: 10000,
        action: {
          label: 'View Exams',
          onClick: () => {
            // Navigate to current exams list
            window.location.reload();
          },
        },
      }),

    generic: (error?: string) =>
      toast.error('Something went wrong', {
        description: error || 'An unexpected error occurred. Please try again.',
        duration: 4000,
      }),

    examDeletionFailed: (error?: string) =>
      toast.error('Failed to delete exam', {
        description: error || 'Unable to delete the exam. Please try again.',
        duration: 4000,
      }),

    certificationRegistrationFailed: (error?: string) =>
      toast.error('Registration failed', {
        description: error || 'Failed to register for certification. Please try again.',
        duration: 5000,
      }),
  },

  // Info notifications
  info: {
    examAutoSave: () =>
      toast.info('Auto-saving progress...', {
        description: 'Your answers are being saved automatically.',
        duration: 2000,
      }),

    passwordRequired: () =>
      toast.info('Password required', {
        description: 'Please enter your current password to continue.',
        duration: 4000,
      }),

    loadingData: () =>
      toast.info('Loading...', {
        description: 'Please wait while we fetch your data.',
        duration: 3000,
      }),
  },

  // Warning notifications
  warning: {
    unsavedChanges: () =>
      toast.warning('Unsaved changes', {
        description: 'You have unsaved changes. Please save before continuing.',
        duration: 5000,
      }),

    examTimeLimit: (minutesLeft: number) =>
      toast.warning(`⏰ ${minutesLeft} minutes remaining`, {
        description: 'Complete your exam before time runs out.',
        duration: 4000,
      }),

    slowConnection: () =>
      toast.warning('Slow connection detected', {
        description: 'Your responses may take longer to save.',
        duration: 4000,
      }),

    examTimeRemaining: (minutes: number) =>
      toast.warning(`⏰ ${minutes} minutes remaining`, {
        description: 'Complete your exam before time runs out.',
        duration: 5000,
      }),

    autoSaveEnabled: () =>
      toast.info('Auto-save enabled', {
        description: 'Your answers are being saved automatically as you select them.',
        duration: 3000,
      }),

    alreadyRegistered: (certificationName: string) =>
      toast.info('Already registered', {
        description: `You are already registered for "${certificationName}".`,
        duration: 4000,
      }),

    examLimitWarning: (remaining: number, maxAllowed: number) => {
      const percentageLeft = (remaining / maxAllowed) * 100;
      const warningMessage =
        remaining === 1
          ? `⚠️ You have only 1 exam creation left today!`
          : `⚠️ You have ${remaining} exam creations left today`;

      toast.warning(warningMessage, {
        description: `${Math.round(
          percentageLeft,
        )}% of your daily limit remaining. Consider using them wisely!`,
        duration: 8000,
        action: {
          label: 'View Limits',
          onClick: () => window.open('/pricing', '_blank'),
        },
      });
    },
  },

  // Loading notifications with promise support
  loading: {
    examSubmission: () =>
      toast.loading('Submitting exam...', {
        description: 'Please wait while we process your submission.',
      }),

    examCreation: () =>
      toast.loading('Creating exam...', {
        description: 'Generating questions based on your preferences.',
      }),

    saveAnswer: () =>
      toast.loading('Saving answer...', {
        description: 'Recording your response.',
      }),
  },

  // Utility functions
  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  // Dismiss all toasts of a specific type
  dismissAll: () => {
    toast.dismiss();
  },

  // Show a confirmation toast with action buttons
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) =>
    toast.warning(message, {
      duration: Infinity, // Keep it visible until user acts
      action: {
        label: 'Confirm',
        onClick: () => {
          onConfirm();
          toast.dismiss();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          if (onCancel) onCancel();
          toast.dismiss();
        },
      },
    }),

  // Promise-based notifications for async operations
  promise: {
    submitExam: <T>(
      promise: Promise<T>,
      options?: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
      },
    ) =>
      toast.promise(promise, {
        loading: options?.loading || 'Submitting exam...',
        success: options?.success || '🎉 Exam submitted successfully!',
        error: options?.error || 'Failed to submit exam',
      }),

    createExam: <T>(
      promise: Promise<T>,
      options?: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
      },
    ) =>
      toast.promise(promise, {
        loading: options?.loading || 'Creating exam...',
        success: options?.success || '✅ Exam created successfully!',
        error: options?.error || 'Failed to create exam',
      }),

    saveAnswer: <T>(
      promise: Promise<T>,
      options?: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
      },
    ) =>
      toast.promise(promise, {
        loading: options?.loading || 'Saving answer...',
        success: options?.success || 'Answer saved',
        error: options?.error || 'Failed to save answer',
      }),
    deleteExam: <T>(
      promise: Promise<T>,
      options?: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
      },
    ) =>
      toast.promise(promise, {
        loading: options?.loading || 'Deleting exam...',
        success: options?.success || '🗑️ Exam deleted successfully',
        error: options?.error || 'Failed to delete exam',
      }),
  },
};

// Export individual toast methods for direct use
export const { success, error, info, warning, loading, dismiss, promise, confirm, dismissAll } =
  toastHelpers;

// Export the main toast object for advanced usage
export { toast };
