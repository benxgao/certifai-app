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
    dedupingInterval: 30000, // Increased cache time for better performance
    refreshInterval: 0, // Don't auto-refresh - profile changes infrequently
    refreshWhenHidden: false, // Don't refresh when tab is hidden
    refreshWhenOffline: false, // Don't refresh when offline
    focusThrottleInterval: 15000, // Throttle focus-based revalidation
    errorRetryCount: 2, // Retry on error
    errorRetryInterval: 3000, // Wait 3 seconds between retries
    keepPreviousData: true, // Keep previous data while revalidating for better UX
    // Prevent multiple rapid requests
    shouldRetryOnError: (error) => {
      // Don't retry on cancellation errors
      if ((error as any)?.name === 'CancelledError') {
        return false;
      }
      // Retry on timeout and network errors
      return (error as any)?.name === 'TimeoutError' || (error as any)?.name === 'NetworkError';
    },
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
