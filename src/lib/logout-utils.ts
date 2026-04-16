/**
 * Comprehensive logout utility that ensures complete authentication state clearing
 * and proper redirect handling across all scenarios.
 *
 * Uses the centralized auth-state-transitions for coordinated logout flow.
 */

import { transitionToSignedOut, validateTransitionState } from '@/src/lib/auth-state-transitions';

/**
 * Performs a complete logout with proper state clearing and redirect
 *
 * This function:
 * 1. Uses transitionToSignedOut to coordinate logout (clears tokens + Firebase signout)
 * 2. Validates the transition completed successfully
 * 3. Redirects to signin page with appropriate message
 */
export const performLogout = async (redirectPath: string = '/signin'): Promise<void> => {
  try {
    // Execute logout transition (clears all tokens and signs out Firebase)
    const result = await transitionToSignedOut({ enableLogging: false });

    if (!result.success) {
      console.warn(
        '[performLogout] Logout transition had errors:',
        result.error || 'Unknown error',
      );
    }

    // Validate that state is clean
    const stateValidation = validateTransitionState();
    if (!stateValidation.isClean) {
      console.warn('[performLogout] Auth state not fully clean after logout:', stateValidation.message);
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
 * Forces complete state reset and redirect immediately
 *
 * This function is a last resort - it doesn't wait for async operations,
 * just triggers cleanup and redirects immediately.
 */
export const emergencyLogout = (): void => {
  try {
    // Initiate logout transition asynchronously (don't wait)
    // This ensures cleanup happens but doesn't block redirect
    transitionToSignedOut({ enableLogging: true }).catch((error) => {
      console.error('[emergencyLogout] Logout transition failed:', error);
    });
  } catch (error) {
    console.error('[emergencyLogout] Error initiating emergency logout:', error);
  }

  // Force immediate redirect with clean URL (no verification parameters)
  const errorMessage = 'Emergency logout performed. Please sign in again.';
  const redirectUrl = `/signin?error=${encodeURIComponent(errorMessage)}`;

  // Use setTimeout to ensure async cleanup has a chance to start before redirect
  // But don't wait too long - maximum 100ms
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 10);
};
