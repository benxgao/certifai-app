/**
 * Centralized authentication utilities for handling JWT expiration and refresh token failures
 */

export interface AuthResponse {
  success: boolean;
  requiresReauth?: boolean;
  error?: string;
  message?: string;
}

/**
 * Enhanced error type for authentication failures
 */
export class AuthenticationError extends Error {
  public readonly status: number;
  public readonly requiresReauth: boolean;

  constructor(message: string, status: number = 401, requiresReauth: boolean = true) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = status;
    this.requiresReauth = requiresReauth;
  }
}

/**
 * Clear all authentication state on the client side
 */
export const clearClientAuthState = async (): Promise<void> => {
  try {
    // Clear auth cookie
    await fetch('/api/auth-cookie/clear', {
      method: 'POST',
    });

    // Clear any localStorage tokens if they exist
    if (typeof window !== 'undefined') {
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('apiUserId');
    }

    console.log('Client auth state cleared successfully');
  } catch (error) {
    console.error('Error clearing client auth state:', error);
  }
};

/**
 * Handle authentication failure by clearing state and optionally redirecting
 */
export const handleAuthenticationFailure = async (
  errorMessage: string = 'Session expired. Please sign in again.',
  shouldRedirect: boolean = true,
): Promise<void> => {
  console.log('Handling authentication failure:', errorMessage);

  // Clear all auth state
  await clearClientAuthState();

  // Redirect if needed and in browser
  if (shouldRedirect && typeof window !== 'undefined') {
    // Only redirect if we're in a protected route and not already on auth pages
    if (
      window.location.pathname.startsWith('/main') &&
      !window.location.pathname.includes('/signin') &&
      !window.location.pathname.includes('/signup')
    ) {
      const errorParam = encodeURIComponent(errorMessage);
      window.location.href = `/signin?error=${errorParam}`;
    }
  }
};

/**
 * Check if an error indicates authentication failure that requires re-authentication
 */
export const isAuthenticationError = (error: any): boolean => {
  return (
    error instanceof AuthenticationError ||
    error?.status === 401 ||
    error?.name === 'AuthenticationError' ||
    error?.message?.includes('Authentication failed') ||
    error?.message?.includes('Session expired')
  );
};

/**
 * Enhanced fetch with automatic token refresh and authentication failure handling
 */
export const fetchWithAuthRetry = async (
  url: string,
  options: RequestInit = {},
  refreshTokenFn?: () => Promise<string | null>,
): Promise<Response> => {
  let response = await fetch(url, options);

  // If we get a 401, try to refresh token and retry once
  if (response.status === 401 && refreshTokenFn) {
    console.log('Token expired, attempting refresh...');

    try {
      const newToken = await refreshTokenFn();

      if (newToken) {
        // Retry the request with refreshed token
        console.log('Token refreshed, retrying request...');
        response = await fetch(url, options);
      } else {
        // If Firebase token refresh failed, try cookie-based refresh
        console.log('Firebase token refresh failed, trying cookie refresh...');
        const cookieRefreshResponse = await fetch('/api/auth-cookie/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (cookieRefreshResponse.ok) {
          console.log('Cookie refresh successful, retrying request...');
          response = await fetch(url, options);
        } else {
          // All refresh attempts failed
          console.error('All token refresh attempts failed');
          await handleAuthenticationFailure();
          throw new AuthenticationError('Authentication failed. Please sign in again.');
        }
      }
    } catch (refreshError) {
      console.error('Token refresh error:', refreshError);
      await handleAuthenticationFailure();
      throw new AuthenticationError('Authentication failed. Please sign in again.');
    }
  }

  return response;
};

/**
 * Simplified auth-aware fetch that handles JSON responses
 */
export const fetchAuthJSON = async <T = any>(
  url: string,
  options: RequestInit = {},
  refreshTokenFn?: () => Promise<string | null>,
): Promise<T> => {
  const response = await fetchWithAuthRetry(url, options, refreshTokenFn);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));

    if (response.status === 401) {
      throw new AuthenticationError(errorData.message || 'Authentication failed', 401);
    }

    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

/**
 * Complete authentication state reset utility
 * Clears all authentication tokens, cookies, and state
 */
export const resetAuthenticationState = async (): Promise<void> => {
  try {
    console.log('Performing complete authentication state reset...');

    // Clear server-side cookies with retry logic
    try {
      await fetch('/api/auth-cookie/clear', {
        method: 'POST',
      });
      console.log('Server-side cookies cleared successfully');
    } catch (cookieError) {
      console.warn('Failed to clear server-side cookies:', cookieError);
      // Continue with client-side clearing even if server-side fails
    }

    // Clear any client-side storage
    if (typeof window !== 'undefined') {
      // Clear localStorage
      const localStorageKeys = ['firebaseToken', 'apiUserId', 'authToken'];
      localStorageKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to clear localStorage key: ${key}`, e);
        }
      });

      // Clear sessionStorage
      const sessionStorageKeys = ['firebaseToken', 'apiUserId', 'authToken'];
      sessionStorageKeys.forEach((key) => {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to clear sessionStorage key: ${key}`, e);
        }
      });

      // Force clear cookies via document.cookie as additional measure
      try {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'joseToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      } catch (e) {
        console.warn('Failed to clear cookies via document.cookie:', e);
      }
    }

    console.log('Authentication state reset completed');
  } catch (error) {
    console.error('Error during auth state reset:', error);
  }
};

/**
 * Validate that a JWT token is current and not legacy
 */
export const isCurrentJWTToken = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));

    // Check for our unique identifier (jti) that indicates new tokens
    if (!decoded.jti) {
      console.log('Token missing unique identifier, treating as legacy');
      return false;
    }

    // Check token age - tokens older than 24 hours should be refreshed
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - (decoded.iat || 0);

    if (tokenAge > 24 * 60 * 60) {
      // 24 hours
      console.log('Token is older than 24 hours, requiring refresh');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating JWT token:', error);
    return false;
  }
};
