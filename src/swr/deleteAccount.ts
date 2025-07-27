import { useAuthMutation } from './useAuthMutation';

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
  data?: {
    deleted_user_id: string;
    deleted_firebase_user_id: string;
    deletion_summary: {
      user_answers_deleted: number;
      exam_attempts_deleted: number;
      user_certifications_deleted: number;
    };
    validation: {
      completely_deleted: boolean;
      remaining_data_check: {
        user: number;
        examAttempts: number;
        userCertifications: number;
        examUserAnswers: number;
      };
    };
  };
}

/**
 * Hook to delete user account
 */
export function useDeleteAccount(apiUserId: string | null) {
  const url = apiUserId ? `/api/users/${apiUserId}` : null;

  return useAuthMutation<DeleteAccountResponse, void>(url, 'DELETE', {
    onSuccess: () => {
      // Clear all authentication state after successful deletion
      if (typeof window !== 'undefined') {
        // Force redirect to home page
        window.location.href = '/';
      }
    },
  });
}
