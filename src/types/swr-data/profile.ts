// === User Profile API Response Types ===

/**
 * Data structure for user profile
 * From GET /api/users/:user_id/profile
 * From PUT /api/users/:user_id/profile
 * Source of Truth: functions/src/endpoints/api/users/getUserProfile.ts
 */
export interface UserProfileData {
  api_user_id: string; // Our internal UUID for API operations @guaranteed
  firebase_user_id: string | null; // Firebase UID for reference - may be null for legacy accounts @optional
  credit_tokens: number; // Number of credit tokens user has @guaranteed
  energy_tokens: number; // Number of energy tokens user has @guaranteed
  created_at: string; // Account creation timestamp (ISO 8601) @guaranteed
  updated_at: string; // Last profile update timestamp (ISO 8601) @guaranteed
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
}

/**
 * Response data type for GET /api/users/:user_id/profile
 * data?.data resolves to this type
 */
export type SwrDataApiUserProfileResponse = UserProfileData;

/**
 * Response data type for PUT /api/users/:user_id/profile
 * data?.data resolves to this type
 */
export type SwrDataApiUpdateUserProfileResponse = UserProfileData;
