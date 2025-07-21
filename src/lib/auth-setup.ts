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
      console.log('Successfully set auth cookie');
      return { success: true };
    } else {
      console.warn('Failed to set auth cookie');
      return { success: false, error: 'Cookie request failed' };
    }
  } catch (error) {
    console.error('Failed to set auth cookie:', error);
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
    console.log('Auth cookie cleared successfully');
  } catch (error) {
    console.error('Failed to clear auth cookie:', error);
  }
};

/**
 * Perform API login to get user ID
 */
export const performApiLogin = async (token: string): Promise<string | null> => {
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

      console.log('Got api_user_id from custom claims:', apiUserId);
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

      console.log('Got api_user_id on retry:', retryApiUserId);
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
      console.log('Patched Firebase custom claims with api_user_id:', apiUserId);
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
 * Check if we should skip cookie setting based on current path
 */
export const shouldSkipCookieSet = (): boolean => {
  if (typeof window === 'undefined') return true;

  return (
    window.location.pathname.includes('/signin') || window.location.pathname.includes('/signup')
  );
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
    console.log('Starting authentication setup process...');

    // Prepare parallel requests for better performance
    const promises = [];

    // 1. Set auth cookie (skip if on signin/signup pages)
    let cookiePromise = null;
    if (!shouldSkipCookieSet()) {
      cookiePromise = setAuthCookie(token);
      promises.push(cookiePromise);
    }

    // 2. API login to get user ID
    const loginPromise = performApiLogin(token);
    promises.push(loginPromise);

    // 3. Check for api_user_id in custom claims
    const claimsPromise = getApiUserIdFromClaims(authUser);
    promises.push(claimsPromise);

    // Execute initial requests in parallel
    const results = await Promise.allSettled(promises);

    // Handle results
    let cookieResult: AuthCookieResult | null = null;
    if (cookiePromise) {
      const cookieSettledResult = results[promises.indexOf(cookiePromise)];
      if (cookieSettledResult.status === 'fulfilled') {
        cookieResult = cookieSettledResult.value as AuthCookieResult;
      }
    }

    const loginResult = results[promises.indexOf(loginPromise)];
    const claimsResult = results[promises.indexOf(claimsPromise)];

    let userIdFromApi = null;
    let userIdFromClaims = null;

    // Extract results
    if (loginResult.status === 'fulfilled' && loginResult.value) {
      userIdFromApi = loginResult.value as string;
    }

    if (claimsResult.status === 'fulfilled' && claimsResult.value) {
      userIdFromClaims = claimsResult.value as string;
    }

    // If no claims found, retry after delay (for newly created accounts)
    if (!userIdFromClaims) {
      console.log('No api_user_id found in claims, retrying after delay...');
      userIdFromClaims = await retryGetApiUserIdFromClaims(authUser);
    }

    // Use API result if available, otherwise use custom claims
    const finalUserId = userIdFromApi || userIdFromClaims;

    // If we have api_user_id from API but not in claims, patch the claims
    if (userIdFromApi && (!userIdFromClaims || userIdFromApi !== userIdFromClaims)) {
      console.log('Syncing custom claims with API user ID...');
      const patchSuccess = await patchCustomClaims(token, userIdFromApi);

      if (patchSuccess) {
        // Force refresh token to get new claims
        await authUser.getIdToken(true);
      }
    }

    if (finalUserId) {
      console.log(`Authentication setup successful:
        | cookie_set: ${cookieResult?.success ?? 'skipped'}
        | current_path: ${typeof window !== 'undefined' ? window.location.pathname : 'server'}`);

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
    console.log('Token refreshed successfully');

    // Update the auth cookie with the new token (non-blocking)
    setAuthCookie(newToken).then((result) => {
      if (result.success) {
        console.log('Token refreshed and cookie updated successfully');
      } else {
        console.warn('Auth cookie update failed during refresh, but continuing');
      }
    });

    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};
