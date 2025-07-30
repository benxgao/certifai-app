/**
 * Authentication setup utilities extracted from FirebaseAuthContext
 * Handles complex async authentication flows including token management,
 * API login, custom claims handling, and cookie management
 */

import { User } from 'firebase/auth';
import { optimizedFetch, AUTH_FETCH_OPTIONS } from '@/src/lib/fetch-config';

export interface AuthSetupResult {
  success: boolean;
  apiUserId: string | null;
  error?: string;
}

export interface AuthCookieResult {
  success: boolean;
  error?: string;
}

// Add global deduplication for API login requests
let pendingLoginRequest: Promise<string | null> | null = null;
let lastLoginToken: string | null = null;
let lastLoginResult: string | null = null;
let lastLoginTime = 0;
const LOGIN_CACHE_DURATION = 30000; // 30 seconds cache for login results

/**
 * Set authentication cookie for the user session
 */
export const setAuthCookie = async (token: string): Promise<AuthCookieResult> => {
  try {
    const response = await optimizedFetch(
      '/api/auth-cookie/set',
      {
        ...AUTH_FETCH_OPTIONS,
        method: 'POST',
        body: JSON.stringify({ firebaseToken: token }),
      },
      10000, // 10 second timeout
    );

    if (response && response.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'Cookie request failed' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Clear authentication cookie
 */
export const clearAuthCookie = async (): Promise<void> => {
  try {
    await fetch('/api/auth-cookie/clear', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Failed to clear auth cookie:', error);
  }
};

/**
 * Perform API login to get user ID with request deduplication
 */
export const performApiLogin = async (token: string): Promise<string | null> => {
  const now = Date.now();

  // Return cached result if it's recent and for the same token
  if (lastLoginToken === token && lastLoginResult && now - lastLoginTime < LOGIN_CACHE_DURATION) {
    return lastLoginResult;
  }

  // If there's already a pending request for the same token, wait for it
  if (pendingLoginRequest && lastLoginToken === token) {
    return pendingLoginRequest;
  }

  // Clear cache if token has changed
  if (lastLoginToken !== token) {
    lastLoginResult = null;
    lastLoginTime = 0;
  }

  // Create new request
  lastLoginToken = token;
  pendingLoginRequest = performApiLoginInternal(token);

  try {
    const result = await pendingLoginRequest;
    lastLoginResult = result;
    lastLoginTime = now;
    return result;
  } finally {
    pendingLoginRequest = null;
  }
};

/**
 * Internal API login function (actual implementation)
 */
const performApiLoginInternal = async (token: string): Promise<string | null> => {
  try {
    const response = await optimizedFetch(
      '/api/auth/login',
      {
        ...AUTH_FETCH_OPTIONS,
        method: 'POST',
        headers: {
          ...AUTH_FETCH_OPTIONS.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      10000, // 10 second timeout
    );

    if (response && response.ok) {
      const { api_user_id } = await response.json();
      if (api_user_id) {
        return api_user_id;
      }
    } else {
      console.warn('API login failed, will check custom claims as fallback');
      return null;
    }

    return null;
  } catch (error) {
    console.warn('API login failed:', error);
    return null;
  }
};

/**
 * Get API user ID from Firebase custom claims
 */
export const getApiUserIdFromClaims = async (authUser: User): Promise<string | null> => {
  try {
    const idTokenResult = await authUser.getIdTokenResult(true);
    const customClaims = idTokenResult.claims;
    const apiUserId = (customClaims.api_user_id as string) || null;

    if (apiUserId) {
      // Check if this is a fallback ID that needs to be fixed
      if (apiUserId.startsWith('fb_')) {
        console.warn('Detected fallback api_user_id in claims, needs to be fixed:', apiUserId);
        return null; // Return null so the system will try to get the correct ID
      }
    }

    return apiUserId;
  } catch (error) {
    console.error('Failed to get custom claims:', error);
    return null;
  }
};

/**
 * Retry getting API user ID from custom claims after a delay
 * Useful for newly created accounts where claims haven't propagated yet
 */
export const retryGetApiUserIdFromClaims = async (
  authUser: User,
  delayMs: number = 2000,
): Promise<string | null> => {
  // Wait for custom claims to propagate
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  try {
    const retryTokenResult = await authUser.getIdTokenResult(true);
    const retryClaims = retryTokenResult.claims;
    const retryApiUserId = (retryClaims.api_user_id as string) || null;

    if (retryApiUserId) {
      // Check if this is a fallback ID that needs to be fixed
      if (retryApiUserId.startsWith('fb_')) {
        console.warn(
          'Detected fallback api_user_id in retry claims, needs to be fixed:',
          retryApiUserId,
        );
        return null; // Return null so the system will try to get the correct ID
      }
    }

    return retryApiUserId;
  } catch (error) {
    console.error('Failed to get custom claims on retry:', error);
    return null;
  }
};

/**
 * Patch Firebase custom claims with API user ID
 */
export const patchCustomClaims = async (token: string, apiUserId: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/set-claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ api_user_id: apiUserId }),
    });

    if (response.ok) {
      return true;
    } else {
      console.warn('Failed to patch Firebase custom claims:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error patching Firebase custom claims:', error);
    return false;
  }
};

/**
 * Centralized authentication state manager
 * Handles cookie setting, API login, and claims management in a coordinated way
 */
class AuthManager {
  private cookieSetPromise: Promise<AuthCookieResult> | null = null;
  private apiLoginPromise: Promise<string | null> | null = null;

  /**
   * Set auth cookie with deduplication
   */
  async setAuthCookie(token: string, forceNew = false): Promise<AuthCookieResult> {
    if (!forceNew && this.cookieSetPromise) {
      return this.cookieSetPromise;
    }

    this.cookieSetPromise = setAuthCookie(token);
    const result = await this.cookieSetPromise;

    // Clear promise after completion
    this.cookieSetPromise = null;
    return result;
  }

  /**
   * Perform API login with deduplication
   */
  async performApiLogin(token: string): Promise<string | null> {
    if (this.apiLoginPromise) {
      return this.apiLoginPromise;
    }

    this.apiLoginPromise = performApiLogin(token);
    const result = await this.apiLoginPromise;

    // Clear promise after completion
    this.apiLoginPromise = null;
    return result;
  }

  /**
   * Clear all pending operations
   */
  reset(): void {
    this.cookieSetPromise = null;
    this.apiLoginPromise = null;
  }
}

// Global auth manager instance
const authManager = new AuthManager();

/**
 * Check if we should skip cookie setting based on current path
 * Simplified to only skip during signup
 */
export const shouldSkipCookieSet = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.location.pathname.includes('/signup');
};

/**
 * Check if we should redirect for protected routes when token refresh fails
 */
export const shouldRedirectToSignIn = (): boolean => {
  if (typeof window === 'undefined') return false;

  const currentPath = window.location.pathname;

  // Define protected routes that require authentication
  const protectedRoutes = ['/main'];
  const authRoutes = ['/signin', '/signup', '/forgot-password'];

  // Check if we're on a protected route
  const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

  // Check if we're already on an auth route
  const isAuthRoute = authRoutes.some((route) => currentPath.includes(route));

  // Only redirect if we're on a protected route and not already on an auth route
  return isProtectedRoute && !isAuthRoute;
};

/**
 * Complete authentication setup process
 * Handles all async authentication processes in parallel for optimal performance
 */
export const performAuthSetup = async (authUser: User, token: string): Promise<AuthSetupResult> => {
  try {

    // Use the centralized auth manager for cookie setting
    const cookiePromise = authManager.setAuthCookie(token);
    const loginPromise = authManager.performApiLogin(token);
    const claimsPromise = getApiUserIdFromClaims(authUser);

    // Execute all requests in parallel
    const [cookieResult, loginResult, claimsResult] = await Promise.allSettled([
      cookiePromise,
      loginPromise,
      claimsPromise,
    ]);

    // Extract results
    const finalCookieResult = cookieResult.status === 'fulfilled' ? cookieResult.value : null;
    const finalApiUserId = loginResult.status === 'fulfilled' ? loginResult.value : null;
    let finalClaimsUserId = claimsResult.status === 'fulfilled' ? claimsResult.value : null;

    // If no claims found, retry after delay (for newly created accounts)
    if (!finalClaimsUserId) {
      finalClaimsUserId = await retryGetApiUserIdFromClaims(authUser);
    }

    // Use API result if available, otherwise use custom claims
    const finalUserId = finalApiUserId || finalClaimsUserId;

    // If we have api_user_id from API but not in claims, patch the claims
    if (finalApiUserId && (!finalClaimsUserId || finalApiUserId !== finalClaimsUserId)) {
      const patchSuccess = await patchCustomClaims(token, finalApiUserId);

      if (patchSuccess) {
        // Force refresh token to get new claims
        await authUser.getIdToken(true);
      }
    }

    if (finalUserId) {
      return {
        success: true,
        apiUserId: finalUserId,
      };
    } else {
      console.warn('No api_user_id found from either API login or custom claims');
      return {
        success: false,
        apiUserId: null,
        error: 'No API user ID found',
      };
    }
  } catch (error) {
    console.error('Authentication setup failed:', error);
    return {
      success: false,
      apiUserId: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Refresh token and update cookie
 */
export const refreshTokenAndUpdateCookie = async (firebaseUser: User): Promise<string | null> => {
  try {
    const newToken = await firebaseUser.getIdToken(true); // Force refresh

    // Update the auth cookie with the new token (non-blocking)
    setAuthCookie(newToken);

    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};
