'use client';

/**
 * Client-side authentication utilities that work with the server-side refresh strategy
 */

interface RefreshResult {
  success: boolean;
  requiresReauth: boolean;
  error?: string;
  message?: string;
}

/**
 * Attempt to refresh authentication using server-side strategy first
 */
export async function attemptServerRefresh(): Promise<RefreshResult> {
  try {
    const response = await fetch('/api/auth-cookie/server-refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        requiresReauth: false,
        message: result.message,
      };
    }

    // Server refresh failed, check if client refresh is needed
    return {
      success: false,
      requiresReauth: result.requiresReauth || true,
      error: result.error,
      message: result.message,
    };
  } catch (error) {
    console.error('Server refresh attempt failed:', error);
    return {
      success: false,
      requiresReauth: true,
      error: 'NETWORK_ERROR',
      message: 'Failed to communicate with authentication server',
    };
  }
}

/**
 * Handle authentication failure by attempting refresh first, then redirecting
 */
export async function handleAuthFailure(redirectPath: string = '/signin'): Promise<void> {
  const refreshResult = await attemptServerRefresh();

  if (refreshResult.success) {
    // Server refresh succeeded, reload the page
    window.location.reload();
    return;
  }

  // Server refresh failed, redirect to signin
  const errorMessage = refreshResult.message || 'Please sign in again';
  const redirectUrl = `${redirectPath}?error=${encodeURIComponent(errorMessage)}`;

  window.location.href = redirectUrl;
}

/**
 * Check if current page requires authentication
 */
export function isAuthRequiredPage(pathname?: string): boolean {
  const currentPath = pathname || window.location.pathname;
  const authRequiredPaths = ['/main', '/signin', '/signup', '/forgot-password'];

  return authRequiredPaths.some((path) => {
    if (path === '/' && currentPath === '/') return false;
    return currentPath.startsWith(path);
  });
}

/**
 * Enhanced fetch wrapper that handles authentication failures
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // If we get a 401, try to refresh before failing
  if (response.status === 401) {
    const refreshResult = await attemptServerRefresh();

    if (refreshResult.success) {
      // Retry the original request
      return await fetch(url, {
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    } else {
      // Refresh failed, handle auth failure
      if (isAuthRequiredPage()) {
        await handleAuthFailure();
      }
    }
  }

  return response;
}
