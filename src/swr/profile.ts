import { useAuthSWR } from './useAuthSWR';
import { useAuthMutation } from './useAuthMutation';

export interface UserProfile {
  user_id: string;
  firebase_user_id: string;
  first_name?: string;
  last_name?: string;
  credit_tokens: number;
  energy_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  data: UserProfile;
}

export interface UpdateProfileData {
  // Add any fields that can be updated through the profile API
  [key: string]: any;
}

/**
 * Hook to fetch user profile data
 */
export function useUserProfile(apiUserId: string | null) {
  const key = apiUserId ? `/api/users/${apiUserId}/profile` : null;

  return useAuthSWR<UserProfileResponse>(key, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 15000, // Cache for 15 seconds (increased from 10s)
    refreshInterval: 0, // Don't auto-refresh - profile changes infrequently
    refreshWhenHidden: false, // Don't refresh when tab is hidden
    refreshWhenOffline: false, // Don't refresh when offline
    focusThrottleInterval: 10000, // Throttle focus-based revalidation
  });
}

/**
 * Hook to update user profile data
 */
export function useUpdateUserProfile(apiUserId: string | null) {
  const url = apiUserId ? `/api/users/${apiUserId}/profile` : null;

  return useAuthMutation<UserProfileResponse, UpdateProfileData>(url, 'PUT', {
    // Revalidate the profile data after successful update
    onSuccess: () => {
      // This will be handled by the mutation hook's automatic revalidation
    },
  });
}

/**
 * Hook to get profile mutation key for manual revalidation
 */
export function getProfileKey(apiUserId: string | null) {
  return apiUserId ? `/api/users/${apiUserId}/profile` : null;
}
