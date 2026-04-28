// === Delete Account API Response Types ===

/**
 * Summary of deleted data counts
 */
export interface DeleteAccountDeletionSummary {
  user_answers_deleted: number;
  exam_attempts_deleted: number;
  user_certifications_deleted: number;
}

/**
 * Validation checks for deletion completeness
 */
export interface DeleteAccountRemainingDataCheck {
  user: number;
  examAttempts: number;
  userCertifications: number;
  examUserAnswers: number;
}

export interface DeleteAccountValidation {
  completely_deleted: boolean;
  remaining_data_check: DeleteAccountRemainingDataCheck;
}

/**
 * Data structure for account deletion response
 * From DELETE /api/users/:user_id
 */
export interface DeleteAccountData {
  deleted_user_id: string;
  deleted_firebase_user_id: string;
  deletion_summary: DeleteAccountDeletionSummary;
  validation: DeleteAccountValidation;
}

/**
 * Full response for account deletion endpoint
 * DELETE /api/users/:user_id
 */
export interface DeleteAccountResponse {
  success: boolean;
  message: string;
  data?: DeleteAccountData;
}

/**
 * Response data type for DELETE /api/users/:user_id
 * useDeleteAccount hook resolves to this type
 */
export type SwrDataDeleteAccountResponse = DeleteAccountResponse;
