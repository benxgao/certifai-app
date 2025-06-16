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
    ...config,
    // Add some sensible defaults for auth-related requests
    shouldRetryOnError: (error) => {
      // Don't retry on auth errors (401, 403) to avoid infinite loops
      if ((error as any)?.status === 401 || (error as any)?.status === 403) {
        return false;
      }
      return true;
    },
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  });
}
