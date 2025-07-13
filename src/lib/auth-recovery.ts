/**
 * Client-side recovery utilities for authentication issues
 * These functions help debug and recover from stuck loading states
 */

export interface AuthDebugInfo {
  hasLocalStorage: boolean;
  hasSessionStorage: boolean;
  hasCookies: boolean;
  userAgent: string;
  timestamp: number;
  cookieCount: number;
  localStorageKeys: string[];
  sessionStorageKeys: string[];
}

/**
 * Collect debug information about the current auth state
 */
export function collectAuthDebugInfo(): AuthDebugInfo {
  const info: AuthDebugInfo = {
    hasLocalStorage: typeof localStorage !== 'undefined',
    hasSessionStorage: typeof sessionStorage !== 'undefined',
    hasCookies: typeof document !== 'undefined' && document.cookie.length > 0,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: Date.now(),
    cookieCount: 0,
    localStorageKeys: [],
    sessionStorageKeys: [],
  };

  try {
    if (typeof document !== 'undefined') {
      info.cookieCount = document.cookie.split(';').filter((c) => c.trim()).length;
    }

    if (typeof localStorage !== 'undefined') {
      info.localStorageKeys = Object.keys(localStorage);
    }

    if (typeof sessionStorage !== 'undefined') {
      info.sessionStorageKeys = Object.keys(sessionStorage);
    }
  } catch (error) {
    console.warn('Error collecting debug info:', error);
  }

  return info;
}

/**
 * Clear all client-side authentication data
 */
export function clearClientAuthData(): void {
  try {
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      const authKeys = [
        'firebaseToken',
        'apiUserId',
        'authToken',
        'user',
        'firebase:authUser:certifai-prod:[DEFAULT]',
        'firebase:host:certifai-prod.firebaseapp.com',
      ];

      authKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log('[Recovery] Cleared localStorage auth data');
    }

    // Clear sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const authKeys = ['firebaseToken', 'apiUserId', 'authToken', 'user'];

      authKeys.forEach((key) => {
        sessionStorage.removeItem(key);
      });

      console.log('[Recovery] Cleared sessionStorage auth data');
    }

    // Clear cookies (best effort - some may be httpOnly)
    if (typeof document !== 'undefined') {
      const cookiesToClear = [
        'joseToken',
        'authToken',
        '__Secure-next-auth.session-token',
        '__Secure-next-auth.callback-url',
      ];

      cookiesToClear.forEach((name) => {
        // Clear for current domain
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Clear for parent domain
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        // Clear for root domain (if subdomain)
        const rootDomain = window.location.hostname.split('.').slice(-2).join('.');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
      });

      console.log('[Recovery] Attempted to clear auth cookies');
    }
  } catch (error) {
    console.error('[Recovery] Error clearing client auth data:', error);
  }
}

/**
 * Perform emergency recovery by clearing all auth data and reloading
 */
export async function performEmergencyRecovery(reason: string = 'Manual recovery'): Promise<void> {
  console.log(`[Recovery] Starting emergency recovery: ${reason}`);

  try {
    // Collect debug info before clearing
    const debugInfo = collectAuthDebugInfo();
    console.log('[Recovery] Debug info before clearing:', debugInfo);

    // Clear client-side data
    clearClientAuthData();

    // Try to clear server-side cache
    try {
      await fetch('/api/auth/clear-cache', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('[Recovery] Server cache cleared');
    } catch (error) {
      console.warn('[Recovery] Failed to clear server cache:', error);
    }

    // Add a small delay to ensure cleanup completes
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Force reload to fresh state
    console.log('[Recovery] Reloading page for fresh start');
    window.location.href = '/signin?recovery=true';
  } catch (error) {
    console.error('[Recovery] Emergency recovery failed:', error);

    // Last resort - hard reload
    window.location.reload();
  }
}

/**
 * Check if the user appears to be stuck in a loading state
 */
export function detectStuckState(): boolean {
  const indicators = {
    longLoadTime: false,
    hasStaleData: false,
    hasConflictingAuth: false,
  };

  try {
    // Check if page has been loading for a long time
    const navigationStart = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming;
    if (navigationStart) {
      const loadTime = Date.now() - navigationStart.startTime;
      indicators.longLoadTime = loadTime > 30000; // More than 30 seconds
    }

    // Check for stale localStorage data
    if (typeof localStorage !== 'undefined') {
      const firebaseUser = localStorage.getItem('firebase:authUser:certifai-prod:[DEFAULT]');
      if (firebaseUser) {
        try {
          const userData = JSON.parse(firebaseUser);
          // Check if token is very old (more than 2 hours)
          if (userData.stsTokenManager && userData.stsTokenManager.expirationTime) {
            const expiration = new Date(userData.stsTokenManager.expirationTime).getTime();
            indicators.hasStaleData = expiration < Date.now() - 2 * 60 * 60 * 1000;
          }
        } catch {
          indicators.hasStaleData = true; // Corrupted data
        }
      }
    }

    // Check for conflicting auth states
    if (typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
      const hasLocalAuth = !!(
        localStorage.getItem('firebaseToken') || localStorage.getItem('apiUserId')
      );
      const hasCookieAuth =
        document.cookie.includes('joseToken') || document.cookie.includes('authToken');
      indicators.hasConflictingAuth = hasLocalAuth && !hasCookieAuth;
    }
  } catch (error) {
    console.warn('[Recovery] Error detecting stuck state:', error);
    return true; // Assume stuck if we can't detect properly
  }

  const isStuck = Object.values(indicators).some(Boolean);

  if (isStuck) {
    console.warn('[Recovery] Stuck state detected:', indicators);
  }

  return isStuck;
}

/**
 * Auto-recovery function that can be called periodically
 */
export function attemptAutoRecovery(): void {
  if (detectStuckState()) {
    console.log('[Recovery] Auto-recovery triggered due to stuck state');
    performEmergencyRecovery('Auto-recovery due to detected stuck state');
  }
}
