export interface PaginationInfo {
  currentPage: number; // 1
  pageSize: number; // 10
  totalItems: number; // 20
  totalPages: number; // 2
}

// Import standardized API types
export type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationMeta,
  ApiErrorResponse,
  LegacyPaginationInfo,
} from '../types/api';

/**
 * Typed error class for SWR fetch failures.
 * Carries the HTTP `status` code and the parsed response `info` body
 * so callers can inspect both without `as any` casts.
 */
export class SWRFetchError extends Error {
  status: number;
  info: unknown;

  constructor(message: string, status: number, info: unknown) {
    super(message);
    this.name = 'SWRFetchError';
    this.status = status;
    this.info = info;
    Object.setPrototypeOf(this, SWRFetchError.prototype);
  }
}

// Re-export authentication utilities for convenience
export {
  clearClientAuthState,
  handleAuthenticationFailure,
  isAuthenticationError,
  fetchWithAuthRetry,
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
    let info: unknown;
    try {
      info = await res.json();
    } catch {
      try {
        info = await res.text();
      } catch {
        info = res.statusText;
      }
    }
    throw new SWRFetchError('An error occurred while fetching the data.', res.status, info);
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
      return true;
    } else {
      // If refresh fails due to expired/invalid tokens, clear auth state
      if (res.status === 401) {
        await handleAuthFailure();
      }

      return false;
    }
  } catch (error) {
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
    // Don't attempt refresh if user is on auth pages to prevent race conditions
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/signin') ||
        currentPath.includes('/signup') ||
        currentPath.includes('/forgot-password');

      if (isAuthPage) {
        throw new SWRFetchError('Authentication required. Please sign in.', 401, null);
      }
    }

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
        // If all refresh attempts fail, clear auth state and force signin
        await handleAuthFailure();
        throw new SWRFetchError('Session expired. Please sign in again.', 401, null);
      }
    }
  }

  if (!res.ok) {
    let info: unknown;
    try {
      info = await res.json();
    } catch {
      try {
        info = await res.text();
      } catch {
        info = res.statusText;
      }
    }
    throw new SWRFetchError('An error occurred while fetching the data.', res.status, info);
  }

  return res.json();
};
