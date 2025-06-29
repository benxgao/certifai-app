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
    dedupingInterval: 5000, // Increased to prevent duplicate requests
    focusThrottleInterval: 10000, // Increased throttle time
    loadingTimeout: 15000, // Increased loading timeout to 15 seconds

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
