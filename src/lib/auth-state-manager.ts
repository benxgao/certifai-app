/**
 * Unified Authentication State Manager
 * Consolidates all token clearing, state reset, and validation logic into a single source of truth.
 * This eliminates duplication across logout-utils.ts, signin-helpers.ts, and auth-utils.ts
 */

/**
 * Scope types for token clearing operations
 * - 'all': Clear everything (APIs + localStorage + sessionStorage + cookies + cache)
 * - 'client': Clear only client-side storage (localStorage + sessionStorage)
 * - 'cookies': Clear only document.cookie entries
 * - 'storage': Clear only localStorage and sessionStorage
 */
export type TokenClearScope = 'all' | 'client' | 'cookies' | 'storage';

/**
 * Authentication tokens that may be stored in various locations
 */
const AUTH_TOKEN_NAMES = ['authToken', 'firebaseToken', 'apiUserId'];

/**
 * Verification-related state keys that can cause stuck states
 */
const VERIFICATION_STATE_KEYS = ['showVerificationStep', 'verificationLoading', 'emailVerificationSent'];

/**
 * Main unified token and state clearing function
 *
 * @param scope - What to clear: 'all' (default, most thorough), 'client', 'cookies', or 'storage'
 * @param options - Additional options like whether to clear cache
 * @returns Promise that resolves when clearing is complete
 *
 * @example
 * // Clear everything (typical logout flow)
 * await clearAuthTokens('all');
 *
 * @example
 * // Clear only client-side storage (during signin to remove old tokens)
 * await clearAuthTokens('client');
 *
 * @example
 * // Clear only cookies (when tokens are only in cookies)
 * await clearAuthTokens('cookies');
 */
export const clearAuthTokens = async (
  scope: TokenClearScope = 'all',
  options?: { clearCache?: boolean; logClearing?: boolean },
): Promise<void> => {
  const { clearCache = true, logClearing = false } = options || {};

  if (logClearing) {
    console.log(`[authStateManager] Starting token clearing with scope: ${scope}`);
  }

  try {
    // Phase 1: Clear server-side state (only for 'all' scope)
    if (scope === 'all') {
      await clearServerSideTokens(logClearing);
    }

    // Phase 2: Clear client-side storage
    if (scope === 'all' || scope === 'client' || scope === 'storage') {
      if (typeof window !== 'undefined') {
        clearClientStorage(logClearing);
      }
    }

    // Phase 3: Clear cookies
    if (scope === 'all' || scope === 'cookies') {
      if (typeof window !== 'undefined') {
        clearDocumentCookies(logClearing);
      }
    }

    // Phase 4: Clear browser cache (only for 'all' scope)
    if (scope === 'all' && clearCache && typeof window !== 'undefined') {
      clearBrowserCache(logClearing);
    }

    if (logClearing) {
      console.log(`[authStateManager] Token clearing completed for scope: ${scope}`);
    }
  } catch (error) {
    console.error(`[authStateManager] Error during token clearing:`, error);
    // Continue even if some clearing operations fail - user should still be logged out
  }
};

/**
 * Clear server-side authentication state via API calls
 */
async function clearServerSideTokens(logClearing: boolean): Promise<void> {
  try {
    // First try the main logout endpoint
    try {
      if (logClearing) console.log(`[authStateManager] Clearing server-side tokens via /api/auth/logout`);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // If main logout fails, try fallback endpoints
      if (logClearing)
        console.log(`[authStateManager] /api/auth/logout failed, trying fallback endpoints`);

      try {
        await fetch('/api/auth-cookie/clear', {
          method: 'POST',
          credentials: 'include',
        });
      } catch {}

      try {
        await fetch('/api/auth/clear-cache', {
          method: 'POST',
          credentials: 'include',
        });
      } catch {}
    }

    // Also try to clear token cache
    try {
      if (logClearing) console.log(`[authStateManager] Clearing token cache via /api/auth-cookie/clear-cache`);
      await fetch('/api/auth-cookie/clear-cache', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      if (logClearing) console.log(`[authStateManager] Token cache clear failed:`, error);
    }
  } catch (error) {
    console.error(`[authStateManager] Error clearing server-side tokens:`, error);
    // Continue with client-side clearing even if server-side fails
  }
}

/**
 * Clear client-side storage (localStorage and sessionStorage)
 */
function clearClientStorage(logClearing: boolean): void {
  try {
    // Clear main auth tokens
    AUTH_TOKEN_NAMES.forEach((key) => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        // Storage may be unavailable in some contexts
      }
    });

    // Clear verification state
    VERIFICATION_STATE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {}
    });

    if (logClearing) {
      console.log(
        `[authStateManager] Cleared localStorage and sessionStorage: ${[...AUTH_TOKEN_NAMES, ...VERIFICATION_STATE_KEYS].join(', ')}`,
      );
    }
  } catch (error) {
    console.error(`[authStateManager] Error clearing client storage:`, error);
  }
}

/**
 * Clear cookies via document.cookie
 * Attempts to clear from multiple domain variants to ensure complete removal
 */
function clearDocumentCookies(logClearing: boolean): void {
  try {
    const hostname = window.location.hostname;
    const cookiesToClear = AUTH_TOKEN_NAMES;

    cookiesToClear.forEach((cookieName) => {
      try {
        // Clear for current path
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

        // Clear for root domain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname}`;

        // Clear for parent domain (if subdomain)
        const parts = hostname.split('.');
        if (parts.length > 2) {
          const parentDomain = '.' + parts.slice(-2).join('.');
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${parentDomain}`;
        }

        if (logClearing) console.log(`[authStateManager] Cleared cookie: ${cookieName}`);
      } catch (e) {
        console.error(`[authStateManager] Error clearing cookie ${cookieName}:`, e);
      }
    });
  } catch (error) {
    console.error(`[authStateManager] Error clearing document cookies:`, error);
  }
}

/**
 * Clear browser cache for auth-related endpoints
 */
function clearBrowserCache(logClearing: boolean): void {
  try {
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        const authCaches = cacheNames.filter(
          (cacheName) => cacheName.includes('auth') || cacheName.includes('api'),
        );

        authCaches.forEach((cacheName) => {
          try {
            caches.delete(cacheName);
            if (logClearing) console.log(`[authStateManager] Deleted cache: ${cacheName}`);
          } catch (e) {
            console.error(`[authStateManager] Error deleting cache ${cacheName}:`, e);
          }
        });
      });
    }
  } catch (error) {
    if (logClearing) console.log(`[authStateManager] Browser cache clearing skipped:`, error);
  }
}

/**
 * Complete authentication state reset - clears all auth tokens and state
 * This is a convenience wrapper that calls clearAuthTokens('all') with logging
 */
export const resetAuthenticationState = async (): Promise<void> => {
  await clearAuthTokens('all', { clearCache: true, logClearing: false });
};

/**
 * Clear only client-side auth tokens (for signin flow)
 * This is a convenience wrapper for clearing client-side storage without hitting APIs
 */
export const clearClientAuthTokens = async (): Promise<void> => {
  await clearAuthTokens('client', { clearCache: false, logClearing: false });
};

/**
 * Validate current authentication state for debugging
 * Returns true if no auth tokens are found in any location
 */
export const validateAuthState = (): {
  isClean: boolean;
  foundTokens: string[];
  foundCookies: string[];
} => {
  const foundTokens: string[] = [];
  const foundCookies: string[] = [];

  // Check localStorage and sessionStorage
  if (typeof window !== 'undefined') {
    AUTH_TOKEN_NAMES.forEach((key) => {
      if (localStorage.getItem(key)) foundTokens.push(`localStorage.${key}`);
      if (sessionStorage.getItem(key)) foundTokens.push(`sessionStorage.${key}`);
    });

    // Check cookies
    document.cookie.split(';').forEach((cookie) => {
      const trimmed = cookie.trim();
      AUTH_TOKEN_NAMES.forEach((key) => {
        if (trimmed.startsWith(`${key}=`)) {
          foundCookies.push(key);
        }
      });
    });
  }

  const isClean = foundTokens.length === 0 && foundCookies.length === 0;

  return {
    isClean,
    foundTokens,
    foundCookies,
  };
};
