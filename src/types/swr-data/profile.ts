// === User Profile API Response Types ===

/**
 * Data structure for user profile
 * From GET /api/users/:user_id/profile
 * From PUT /api/users/:user_id/profile
 */
export interface UserProfileData {
  api_user_id: string; // Our internal UUID for API operations
  firebase_user_id: string; // Firebase UID for reference
  first_name?: string;
  last_name?: string;
  credit_tokens: number;
  energy_tokens: number;
  created_at: string;
  updated_at: string;
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
