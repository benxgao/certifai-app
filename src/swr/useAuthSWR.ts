import useSWR, { SWRConfiguration } from 'swr';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { fetcherWithAuth } from './utils';

/**
 * Custom hook that wraps useSWR with automatic token refresh on 401 errors
 * This ensures that API calls continue to work even when the Firebase token expires
 */
export function useAuthSWR<Data = any, Error = any>(
  key: string | null,
  config?: SWRConfiguration<Data, Error>,
) {
  const { refreshToken } = useFirebaseAuth();

  return useSWR<Data, Error>(key, (url: string) => fetcherWithAuth(url, refreshToken), {
    // Performance optimizations for auth-related requests
    dedupingInterval: 2000, // Dedupe requests within 2 seconds
    focusThrottleInterval: 5000, // Throttle focus revalidation
    loadingTimeout: 3000, // Show loading state after 3s for slow requests

    // Enhanced error handling
    shouldRetryOnError: (error) => {
      // Don't retry on auth errors (401, 403) to avoid infinite loops
      if ((error as any)?.status === 401 || (error as any)?.status === 403) {
        return false;
      }
      // Don't retry on 4xx client errors except 408 (timeout)
      if (
        (error as any)?.status >= 400 &&
        (error as any)?.status < 500 &&
        (error as any)?.status !== 408
      ) {
        return false;
      }
      return true;
    },
    errorRetryCount: 2, // Reduced from 3 for faster failure detection
    errorRetryInterval: 1000,

    // Smart revalidation settings
    revalidateOnFocus: false, // Prevent unnecessary revalidation
    revalidateOnReconnect: true, // Revalidate when connection restored
    refreshWhenOffline: false, // Don't refresh when offline
    refreshWhenHidden: false, // Don't refresh when tab hidden

    ...config, // Allow overrides
  });
}
