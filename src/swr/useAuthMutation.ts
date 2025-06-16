import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { useCallback } from 'react';

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
