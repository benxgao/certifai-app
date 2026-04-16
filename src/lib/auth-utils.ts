/**
 * Centralized authentication utilities for handling JWT expiration and refresh token failures
 *
 * NOTE: Token clearing logic has been consolidated into auth-state-manager.ts
 * Old functions here are maintained for backward compatibility but delegate to the new manager.
 */

import { clearAuthTokens as clearAuthTokensFromManager } from './auth-state-manager';

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
 *
 * @deprecated Use clearAuthTokens from auth-state-manager instead
 * This function is maintained for backward compatibility.
 */
export const clearClientAuthState = async (): Promise<void> => {
  // Delegate to the new centralized auth-state-manager
  await clearAuthTokensFromManager('client', { clearCache: false, logClearing: false });
};

/**
 * Handle authentication failure by clearing state and optionally redirecting
 */
export const handleAuthenticationFailure = async (
  errorMessage: string = 'Session expired. Please sign in again.',
  shouldRedirect: boolean = true,
): Promise<void> => {
  // Clear all auth state
  await clearClientAuthState();

  // Redirect if needed and in browser
  if (shouldRedirect && typeof window !== 'undefined') {
    const currentPath = window.location.pathname;

    // Define protected routes that require authentication
    const protectedRoutes = ['/main'];
    const authRoutes = ['/signin', '/signup', '/forgot-password'];

    // Check if we're on a protected route
    const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

    // Check if we're already on an auth route
    const isAuthRoute = authRoutes.some((route) => currentPath.includes(route));

    // Only redirect if we're on a protected route and not already on an auth route
    if (isProtectedRoute && !isAuthRoute) {
      const errorParam = encodeURIComponent(errorMessage);
      // Use replace to prevent back navigation to protected pages
      window.location.replace(`/signin?error=${errorParam}`);
    } else if (isAuthRoute) {
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
    // Don't attempt refresh if user is on auth pages to prevent race conditions
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/signin') ||
        currentPath.includes('/signup') ||
        currentPath.includes('/forgot-password');

      if (isAuthPage) {
        throw new AuthenticationError('Authentication required. Please sign in.');
      }
    }

    try {
      const newToken = await refreshTokenFn();

      if (newToken) {
        // Retry the request with refreshed token
        response = await fetch(url, options);
      } else {
        // If Firebase token refresh failed, try cookie-based refresh
        const cookieRefreshResponse = await fetch('/api/auth-cookie/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (cookieRefreshResponse.ok) {
          response = await fetch(url, options);
        } else {
          // All refresh attempts failed - force signin
          await handleAuthenticationFailure();
          throw new AuthenticationError('Session expired. Please sign in again.');
        }
      }
    } catch (refreshError) {
      await handleAuthenticationFailure();
      throw new AuthenticationError('Session expired. Please sign in again.');
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
 *
 * @deprecated Use resetAuthenticationState or clearAuthTokens from auth-state-manager instead
 * This function is maintained for backward compatibility.
 */
export const resetAuthenticationState = async (): Promise<void> => {
  // Delegate to the new centralized auth-state-manager
  await clearAuthTokensFromManager('all', { clearCache: true, logClearing: false });
};

/**
 * Validate that a JWT token is current and not legacy
 */
export const isCurrentJWTToken = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));

    // Check for our unique identifier (jti) that indicates new tokens
    if (!decoded.jti) {
      return false;
    }

    // Check token age - tokens older than 24 hours should be refreshed
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - (decoded.iat || 0);

    if (tokenAge > 24 * 60 * 60) {
      // 24 hours
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Handle session expiration specifically
 */
export const handleSessionExpiration = (): boolean => {
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  return (
    error === 'session_expired' ||
    (error !== null && (error.includes('session_expired') || error.includes('Session expired')))
  );
};

/**
 * Clear session expired error from URL
 */
export const clearSessionExpiredFromUrl = (): void => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('error')) {
    urlParams.delete('error');
    const newUrl = `${window.location.pathname}${
      urlParams.toString() ? '?' + urlParams.toString() : ''
    }`;
    window.history.replaceState({}, '', newUrl);
  }
};
