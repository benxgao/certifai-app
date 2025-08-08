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
    // 1. Use comprehensive logout endpoint that clears all server-side state
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Continue with manual cleanup if endpoint fails
      try {
        // Fallback to individual clear endpoints
        await fetch('/api/auth-cookie/clear', {
          method: 'POST',
          credentials: 'include',
        });

        await fetch('/api/auth/clear-cache', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (fallbackError) {
        // Continue with client-side cleanup even if server-side fails
      }
    }

    // 2. Clear client-side storage
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

        // Clear any verification-related state that might cause stuck states
        const verificationKeys = [
          'showVerificationStep',
          'verificationLoading',
          'emailVerificationSent',
        ];
        verificationKeys.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
      } catch (error) {}
    }

    // 3. Sign out from Firebase Auth
    try {
      await auth.signOut();
    } catch (error) {
      // Continue with redirect even if Firebase signout fails
    }

    // 4. Clear any remaining authentication cookies via document.cookie
    if (typeof window !== 'undefined') {
      try {
        const cookiesToClear = ['authToken', 'firebaseToken', 'apiUserId'];
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
      } catch (error) {}
    }

    // 5. Force redirect using window.location for maximum reliability
    // Use a clean redirect URL without any verification-related parameters
    const successMessage = 'You have been signed out successfully.';
    const redirectUrl = `${redirectPath}?message=${encodeURIComponent(successMessage)}`;

    window.location.href = redirectUrl;
  } catch (error) {
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
  // Clear all possible auth state immediately
  if (typeof window !== 'undefined') {
    // Clear all localStorage
    try {
      localStorage.clear();
    } catch (error) {}

    // Clear all sessionStorage
    try {
      sessionStorage.clear();
    } catch (error) {}

    // Clear all cookies by setting them to expire
    try {
      document.cookie.split(';').forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        // Also clear for domain variants
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        const parts = window.location.hostname.split('.');
        if (parts.length > 2) {
          const parentDomain = '.' + parts.slice(-2).join('.');
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
        }
      });
    } catch (error) {}

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
    } catch (error) {}
  }

  // Force immediate redirect with clean URL (no verification parameters)
  const errorMessage = 'Emergency logout performed. Please sign in again.';
  window.location.href = `/signin?error=${encodeURIComponent(errorMessage)}`;
};
