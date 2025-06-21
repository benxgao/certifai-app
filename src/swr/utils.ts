export interface PaginationInfo {
  currentPage: number; // 1
  pageSize: number; // 10
  totalItems: number; // 20
  totalPages: number; // 2
}

// Re-export authentication utilities for convenience
export {
  clearClientAuthState,
  handleAuthenticationFailure,
  isAuthenticationError,
  fetchWithAuthRetry,
  fetchAuthJSON,
  AuthenticationError,
} from '../lib/auth-utils';

// Import optimized fetch configuration
import { optimizedFetch, AUTH_FETCH_OPTIONS } from '../lib/fetch-config';

// Legacy aliases for backward compatibility
export const clearAuthState = async (): Promise<void> => {
  const { clearClientAuthState } = await import('../lib/auth-utils');
  return clearClientAuthState();
};

export const handleAuthFailure = async (redirectToSignin: boolean = true): Promise<void> => {
  const { handleAuthenticationFailure } = await import('../lib/auth-utils');
  return handleAuthenticationFailure('Session expired. Please sign in again.', redirectToSignin);
};

export const fetcher = async (url: string) => {
  const res = await optimizedFetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    try {
      (error as any).info = await res.json();
    } catch (e) {
      // If response is not JSON, use text
      (e as any).info = await res.text();
    }
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

// Utility function to refresh auth cookie on the server-side
export const refreshAuthCookie = async (): Promise<boolean> => {
  try {
    const res = await optimizedFetch('/api/auth-cookie/refresh', {
      ...AUTH_FETCH_OPTIONS,
      method: 'POST',
    });

    if (res.ok) {
      console.log('Auth cookie refreshed successfully');
      return true;
    } else {
      console.error('Failed to refresh auth cookie:', res.status);

      // If refresh fails due to expired/invalid tokens, clear auth state
      if (res.status === 401) {
        console.log('Refresh token expired or invalid, clearing auth state');
        await handleAuthFailure();
      }

      return false;
    }
  } catch (error) {
    console.error('Error refreshing auth cookie:', error);
    return false;
  }
};

// Enhanced fetcher that handles token refresh on 401 errors
export const fetcherWithAuth = async (
  url: string,
  refreshTokenFn?: () => Promise<string | null>,
) => {
  let res = await optimizedFetch(url);

  // If we get a 401 and have a refresh function, try to refresh token and retry
  if (res.status === 401 && refreshTokenFn) {
    console.log('Token expired, attempting refresh...');
    const newToken = await refreshTokenFn();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      res = await optimizedFetch(url);
    } else {
      // If Firebase token refresh failed, try cookie-based refresh as fallback
      const cookieRefreshSuccess = await refreshAuthCookie();
      if (cookieRefreshSuccess) {
        res = await optimizedFetch(url);
      } else {
        // If all refresh attempts fail, clear auth state and throw error
        console.log('All token refresh attempts failed');
        await handleAuthFailure();
        const error = new Error('Authentication failed. Please sign in again.');
        (error as any).status = 401;
        throw error;
      }
    }
  }

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    try {
      (error as any).info = await res.json();
    } catch {
      try {
        (error as any).info = await res.text();
      } catch {
        // If we can't read the response, use status text
        (error as any).info = res.statusText;
      }
    }
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};
