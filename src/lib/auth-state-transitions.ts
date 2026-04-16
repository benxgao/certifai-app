/**
 * Authentication State Transitions
 * Coordinates explicit state transitions for signin, logout, and expiry scenarios.
 * Each transition is logged and errors are tracked for observability.
 */

import { auth } from '@/src/firebase/firebaseWebConfig';
import { clearAuthTokens } from '@/src/lib/auth-state-manager';

/**
 * Transition result with detailed information about what happened
 */
export interface TransitionResult {
  success: boolean;
  phase: 'clear-tokens' | 'firebase-signout' | 'redirect' | 'complete';
  message: string;
  error?: string;
}

/**
 * Complete logout state transition
 *
 * Coordinates the entire logout process:
 * 1. Clear all auth tokens and state (APIs, storage, cookies, cache)
 * 2. Sign out from Firebase Auth
 * 3. Return result (caller handles redirect)
 *
 * This function ensures that even if one phase fails, the next phase still executes.
 * The goal is maximum reliability - user will be signed out even if some parts fail.
 *
 * @param options - Configuration for the logout transition
 * @returns Result object with success status, phase, and any error information
 */
export const transitionToSignedOut = async (options?: {
  enableLogging?: boolean;
}): Promise<TransitionResult> => {
  const { enableLogging = false } = options || {};

  try {
    // Phase 1: Clear all authentication tokens and state
    if (enableLogging) console.log('[transitionToSignedOut] Phase 1: Starting token clearing');

    try {
      await clearAuthTokens('all', { clearCache: true, logClearing: enableLogging });
      if (enableLogging) console.log('[transitionToSignedOut] Phase 1: Token clearing complete');
    } catch (clearError) {
      console.error('[transitionToSignedOut] Phase 1: Token clearing failed:', clearError);
      // Continue to Firebase signout even if clearing fails
    }

    // Phase 2: Sign out from Firebase Auth
    if (enableLogging) console.log('[transitionToSignedOut] Phase 2: Starting Firebase signOut');

    try {
      await auth.signOut();
      if (enableLogging) console.log('[transitionToSignedOut] Phase 2: Firebase signOut complete');
    } catch (firebaseError) {
      console.warn(
        '[transitionToSignedOut] Phase 2: Firebase signOut failed:',
        firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
      );
      // Continue even if Firebase signout fails - client state is already cleared
    }

    // Phase 3: Transition complete
    if (enableLogging) console.log('[transitionToSignedOut] Phase 3: Logout transition complete');

    return {
      success: true,
      phase: 'complete',
      message: 'Authentication state successfully cleared',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[transitionToSignedOut] Logout transition failed:', error);

    return {
      success: false,
      phase: 'complete',
      message: 'Logout encountered errors',
      error: errorMessage,
    };
  }
};

/**
 * Handle session expiration transition
 *
 * When a user's session expires (JWT token invalid or expired):
 * 1. Clear auth tokens
 * 2. Sign out from Firebase
 * 3. Signal to user that session expired (caller handles redirect)
 *
 * @param options - Configuration for the transition
 * @returns Result object with success status
 */
export const transitionToSessionExpired = async (options?: {
  enableLogging?: boolean;
}): Promise<TransitionResult> => {
  const { enableLogging = false } = options || {};

  try {
    if (enableLogging) console.log('[transitionToSessionExpired] Starting session expiry transition');

    // Clear tokens and sign out
    const result = await transitionToSignedOut({ enableLogging });

    if (enableLogging) console.log('[transitionToSessionExpired] Session expiry transition complete');

    return {
      success: result.success,
      phase: 'complete',
      message: 'Your session has expired. Please sign in again.',
      error: result.error,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[transitionToSessionExpired] Error during session expiry transition:', error);

    return {
      success: false,
      phase: 'complete',
      message: 'Error ending session. Please try signing in again.',
      error: errorMessage,
    };
  }
};

/**
 * Validate current auth state - used for debugging transitions
 *
 * @returns Object describing current state cleanliness
 */
export const validateTransitionState = (): {
  isClean: boolean;
  message: string;
} => {
  try {
    // Check if any auth tokens exist
    const hasLocalStorageTokens =
      typeof window !== 'undefined' &&
      (!!localStorage.getItem('authToken') ||
        !!localStorage.getItem('firebaseToken') ||
        !!localStorage.getItem('apiUserId'));

    const hasSessionStorageTokens =
      typeof window !== 'undefined' &&
      (!!sessionStorage.getItem('authToken') ||
        !!sessionStorage.getItem('firebaseToken') ||
        !!sessionStorage.getItem('apiUserId'));

    const hasFirebaseUser = auth.currentUser !== null;

    const isClean = !hasLocalStorageTokens && !hasSessionStorageTokens && !hasFirebaseUser;

    return {
      isClean,
      message: isClean
        ? 'Auth state is clean (no tokens or Firebase user)'
        : `Auth state has remnants: localStorage=${hasLocalStorageTokens}, sessionStorage=${hasSessionStorageTokens}, firebaseUser=${hasFirebaseUser}`,
    };
  } catch (error) {
    console.error('[validateTransitionState] Error validating state:', error);
    return {
      isClean: false,
      message: 'Error validating transition state',
    };
  }
};
