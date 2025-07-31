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

  } catch (error) {
  }
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
 */
export const resetAuthenticationState = async (): Promise<void> => {
  try {

    // Clear server-side cookies AND token cache with retry logic
    try {
      // Clear cookies
      await fetch('/api/auth-cookie/clear', {
        method: 'POST',
      });

      // Clear server-side token cache to prevent stuck states
      await fetch('/api/auth-cookie/clear-cache', {
        method: 'POST',
      });

    } catch (serverError) {
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
        }
      });

      // Clear sessionStorage
      const sessionStorageKeys = ['firebaseToken', 'apiUserId', 'authToken'];
      sessionStorageKeys.forEach((key) => {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
        }
      });

      // Force clear cookies via document.cookie as additional measure
      try {
        const cookiesToClear = ['authToken'];
        cookiesToClear.forEach((cookieName) => {
          // Clear for current path
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          // Clear for root domain
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
          // Clear for parent domain (if subdomain)
          const parts = window.location.hostname.split('.');
          if (parts.length > 2) {
            const parentDomain = '.' + parts.slice(-2).join('.');
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${parentDomain}`;
          }
        });
      } catch (e) {
      }

      // Clear any browser cache for auth endpoints
      try {
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              if (cacheName.includes('auth') || cacheName.includes('api')) {
                caches.delete(cacheName);
              }
            });
          });
        }
      } catch (e) {
      }
    }

  } catch (error) {
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
