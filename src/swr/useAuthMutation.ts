import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { useCallback } from 'react';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { handleAuthFailure } from './utils';

/**
 * Enhanced mutation fetcher that handles token refresh on 401 errors
 * Use this for POST, PUT, DELETE requests that require authentication
 */
export function useAuthMutationFetcher() {
  const { refreshToken } = useFirebaseAuth();

  return useCallback(
    async (url: string, { arg }: { arg: any }, method: 'POST' | 'PUT' | 'DELETE' = 'POST') => {
      let response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });

      // If we get a 401, try to refresh token and retry
      if (response.status === 401) {
        console.log('Token expired during mutation, attempting refresh...');
        const newToken = await refreshToken();

        if (newToken) {
          // Retry the request with refreshed token (cookie should be updated automatically)
          response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(arg),
          });
        } else {
          // If refresh failed, clear auth state and throw auth error
          console.log('Token refresh failed during mutation');
          await handleAuthFailure();
          throw new Error('Authentication failed. Please sign in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to ${method.toLowerCase()} data.`);
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    [refreshToken],
  );
}

/**
 * Custom hook that wraps useSWRMutation with automatic token refresh on 401 errors
 * This ensures that mutations continue to work even when the Firebase token expires
 */
export function useAuthMutation<Data = any, Arg = any>(
  key: string | null,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  config?: SWRMutationConfiguration<Data, any, string, Arg>,
) {
  const { refreshToken } = useFirebaseAuth();

  const mutationFetcher = useCallback(
    async (url: string, { arg }: { arg: Arg }) => {
      let response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });

      // If we get a 401, try to refresh token and retry
      if (response.status === 401) {
        console.log('Token expired during mutation, attempting refresh...');
        const newToken = await refreshToken();

        if (newToken) {
          // Retry the request with refreshed token (cookie should be updated automatically)
          response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(arg),
          });
        } else {
          // If refresh failed, clear auth state and throw auth error
          console.log('Token refresh failed during mutation');
          await handleAuthFailure();
          throw new Error('Authentication failed. Please sign in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to ${method.toLowerCase()} data.`);
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    [refreshToken, method],
  );

  const mutation = useSWRMutation(key || '', mutationFetcher, {
    ...config,
    // Automatically revalidate related SWR caches on success
    onSuccess: (data, key, config) => {
      // Call user-provided onSuccess if it exists
      if (config?.onSuccess) {
        config.onSuccess(data, key, config);
      }
    },
  });

  if (!key) {
    return {
      trigger: async () => undefined,
      isMutating: false,
      data: undefined,
      error: undefined,
      reset: () => {},
    } as const;
  }
  return mutation;
}
