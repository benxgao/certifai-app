import useSWR, { SWRConfiguration } from 'swr';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { fetcherWithAuth } from './utils';

/**
 * Custom hook that wraps useSWR with automatic token refresh on 401 errors
 * This ensures that API calls continue to work even when the Firebase token expires
 *
 * **Generic Type Pattern (Generic Wrapper)**
 * This hook uses generic defaults (`Data = any, Error = any`) which is ACCEPTABLE because:
 * - This is a reusable wrapper function, not a final consumer hook
 * - Concrete types are specified at call sites (e.g., `useAuthSWR<UserProfileData>('/profile')`)
 * - Type narrowing happens at the call site, not here
 * - The hook treats Data/Error generically - authentication logic is data-agnostic
 *
 * Example correct usage:
 * ```typescript
 * // In exams.ts hook:
 * useAuthSWR<ExamListItemData[]>(`/user/{userId}/exams`, config)
 *
 * // In profile.ts hook:
 * useAuthSWR<UserProfileData>('/profile', config)
 * ```
 *
 * The type casts on error checks below are safe because:
 * - Error type narrowing happens at call site
 * - We're checking standard HTTP status codes and error names
 * - Consumer hooks that wrap this will provide proper error types
 */
export function useAuthSWR<Data = any, Error = any>(
  key: string | null,
  config?: SWRConfiguration<Data, Error>,
) {
  const { refreshToken } = useFirebaseAuth();

  return useSWR<Data, Error>(key, (url: string) => fetcherWithAuth(url, refreshToken), {
    // Performance optimizations for auth-related requests
    dedupingInterval: 5000, // Increased to prevent duplicate requests
    focusThrottleInterval: 10000, // Increased throttle time
    loadingTimeout: 30000, // Increased loading timeout to 30 seconds

    // Enhanced error handling for cancellation scenarios
    shouldRetryOnError: (error) => {
      // Don't retry on cancellation errors (component unmounted, navigation, etc.)
      if ((error as any)?.name === 'CancelledError') {
        console.log('Request was cancelled, not retrying');
        return false;
      }

      // Don't retry on auth errors (401, 403) to avoid infinite loops
      if ((error as any)?.status === 401 || (error as any)?.status === 403) {
        console.error('Authentication error in useAuthSWR:', (error as any)?.message || error);
        return false;
      }

      // Don't retry on 4xx client errors except 408 (timeout)
      if (
        (error as any)?.status >= 400 &&
        (error as any)?.status < 500 &&
        (error as any)?.status !== 408
      ) {
        console.error(
          'Client error in useAuthSWR:',
          (error as any)?.status,
          (error as any)?.message || error,
        );
        return false;
      }

      // Retry on timeout errors but with limit
      if ((error as any)?.name === 'TimeoutError') {
        console.warn('Timeout error in useAuthSWR, retrying...');
        return true;
      }

      console.error('Network error in useAuthSWR, retrying...', error);
      return true;
    },
    errorRetryCount: 2, // Reduced from 3 for faster failure detection
    errorRetryInterval: 2000, // Increased retry interval

    // Smart revalidation settings
    revalidateOnFocus: false, // Prevent unnecessary revalidation
    revalidateOnReconnect: true, // Revalidate when connection restored
    refreshWhenOffline: false, // Don't refresh when offline
    refreshWhenHidden: false, // Don't refresh when tab hidden

    ...config, // Allow overrides
  });
}
