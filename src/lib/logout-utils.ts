/**
 * Comprehensive logout utility that ensures complete authentication state clearing
 * and proper redirect handling across all scenarios.
 *
 * Uses the centralized auth-state-manager for all token clearing operations.
 */

import { auth } from '@/src/firebase/firebaseWebConfig';
import { clearAuthTokens } from '@/src/lib/auth-state-manager';

/**
 * Performs a complete logout with proper state clearing and redirect
 *
 * This function coordinates the logout flow:
 * 1. Clears all auth tokens and state (via auth-state-manager)
 * 2. Signs out from Firebase Auth
 * 3. Redirects to signin page
 */
export const performLogout = async (redirectPath: string = '/signin'): Promise<void> => {
  try {
    // Clear all authentication tokens and state (APIs, storage, cookies, cache)
    // The auth-state-manager handles all clearing with proper error recovery
    await clearAuthTokens('all', { clearCache: true, logClearing: false });

    // Sign out from Firebase Auth
    try {
      await auth.signOut();
    } catch (error) {
      // Continue with redirect even if Firebase signout fails
      console.warn(
        '[performLogout] Firebase signOut failed (will still redirect):',
        error instanceof Error ? error.message : String(error),
      );
    }

    // Force redirect using window.location for maximum reliability
    // Use a clean redirect URL without any verification-related parameters
    const successMessage = 'You have been signed out successfully.';
    const redirectUrl = `${redirectPath}?message=${encodeURIComponent(successMessage)}`;

    window.location.href = redirectUrl;
  } catch (error) {
    console.error('[performLogout] Logout failed:', error);
    // Even if logout fails, force redirect to signin page
    const errorMessage = 'Logout completed. Please sign in again.';
    const redirectUrl = `${redirectPath}?error=${encodeURIComponent(errorMessage)}`;

    window.location.href = redirectUrl;
  }
};


/**
 * Emergency logout function for when normal logout fails
 * Forces complete state reset and redirect
 *
 * Uses the auth-state-manager to ensure all possible auth tokens are cleared
 */
export const emergencyLogout = (): void => {
  try {
    // Clear all possible auth state immediately using the state manager
    // This is synchronous to avoid any async delays
    clearAuthTokens('all', { clearCache: true, logClearing: true }).catch((error) => {
      console.error('[emergencyLogout] Token clearing failed:', error);
    });
  } catch (error) {
    console.error('[emergencyLogout] Error during emergency logout:', error);
  }

  // Force immediate redirect with clean URL (no verification parameters)
  const errorMessage = 'Emergency logout performed. Please sign in again.';
  window.location.href = `/signin?error=${encodeURIComponent(errorMessage)}`;
};
