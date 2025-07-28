/**
 * Comprehensive logout utility that ensures complete authentication state clearing
 * and proper redirect handling across all scenarios.
 */

import { auth } from '@/src/firebase/firebaseWebConfig';

/**
 * Performs a complete logout with proper state clearing and redirect
 */
export const performLogout = async (redirectPath: string = '/signin'): Promise<void> => {
  try {
    console.log('Starting comprehensive logout process...');

    // 1. Clear server-side auth cookie
    try {
      await fetch('/api/auth-cookie/clear', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Auth cookie cleared successfully');
    } catch (error) {
      console.warn('Failed to clear auth cookie:', error);
      // Continue with logout even if cookie clearing fails
    }

    // 2. Clear server-side token cache to prevent stuck states
    try {
      await fetch('/api/auth/clear-cache', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Server token cache cleared successfully');
    } catch (error) {
      console.warn('Failed to clear server token cache:', error);
      // Continue with logout even if cache clearing fails
    }

    // 3. Clear client-side storage
    if (typeof window !== 'undefined') {
      try {
        // Clear localStorage
        const localStorageKeys = ['firebaseToken', 'apiUserId', 'authToken'];
        localStorageKeys.forEach((key) => {
          localStorage.removeItem(key);
        });

        // Clear sessionStorage
        const sessionStorageKeys = ['firebaseToken', 'apiUserId', 'authToken'];
        sessionStorageKeys.forEach((key) => {
          sessionStorage.removeItem(key);
        });

        console.log('Client-side storage cleared successfully');
      } catch (error) {
        console.warn('Failed to clear client storage:', error);
      }
    }

    // 4. Sign out from Firebase Auth
    try {
      await auth.signOut();
      console.log('Firebase signout successful');
    } catch (error) {
      console.warn('Firebase signout failed:', error);
      // Continue with redirect even if Firebase signout fails
    }

    // 5. Force redirect using window.location for maximum reliability
    console.log('Logout process completed, redirecting to:', redirectPath);
    const successMessage = 'You have been signed out successfully.';
    const redirectUrl = `${redirectPath}?message=${encodeURIComponent(successMessage)}`;

    window.location.href = redirectUrl;
  } catch (error) {
    console.error('Logout process encountered errors:', error);

    // Even if logout fails, force redirect to signin page
    const errorMessage = 'Logout completed. Please sign in again.';
    const redirectUrl = `${redirectPath}?error=${encodeURIComponent(errorMessage)}`;

    window.location.href = redirectUrl;
  }
};

/**
 * Emergency logout function for when normal logout fails
 * Forces complete state reset and redirect
 */
export const emergencyLogout = (): void => {
  console.warn('Performing emergency logout...');

  // Clear all possible auth state immediately
  if (typeof window !== 'undefined') {
    // Clear all localStorage
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }

    // Clear all sessionStorage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
    }

    // Clear all cookies by setting them to expire
    try {
      document.cookie.split(';').forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    } catch (error) {
      console.warn('Failed to clear cookies:', error);
    }
  }

  // Force immediate redirect
  const errorMessage = 'Emergency logout performed. Please sign in again.';
  window.location.href = `/signin?error=${encodeURIComponent(errorMessage)}`;
};
