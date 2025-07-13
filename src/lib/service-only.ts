import 'server-only';

import { jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

const secretKey = process.env.JOSE_JWT_SECRET;

// Cache for frequently accessed tokens to reduce JWT verification overhead
const tokenCache: Map<string, { token: string; expires: number; userId: string }> = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Cache cleanup interval (run every 5 minutes)
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;
const TOKEN_CACHE_TTL = 55 * 60 * 1000; // 55 minutes (Firebase tokens expire in 1 hour)

// Periodic cache cleanup
let cleanupInterval: NodeJS.Timeout | null = null;

function startCacheCleanup() {
  if (cleanupInterval) return; // Already started

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, cached] of tokenCache.entries()) {
      if (cached.expires < now) {
        tokenCache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(
        `[TokenCache] Cleaned up ${removedCount} expired tokens. Cache size: ${tokenCache.size}`,
      );
    }
  }, CACHE_CLEANUP_INTERVAL);
}

// Start cleanup when module loads
startCacheCleanup();

/**
 * Clear token cache - useful when authentication state changes
 */
export function clearTokenCache(reason?: string): void {
  const cacheSize = tokenCache.size;
  tokenCache.clear();
  console.log(
    `[TokenCache] Cleared all cached tokens (${cacheSize} entries). Reason: ${
      reason || 'Manual clear'
    }`,
  );
}

/**
 * Clear specific token from cache
 */
export function clearTokenFromCache(token: string): void {
  tokenCache.delete(token);
  console.log('Specific token removed from cache');
}

/**
 * Clear specific user's cached token
 */
export function clearUserTokenCache(userId: string, reason?: string): void {
  let removedCount = 0;

  for (const [key, cached] of tokenCache.entries()) {
    if (cached.userId === userId) {
      tokenCache.delete(key);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    console.log(
      `[TokenCache] Cleared ${removedCount} cached tokens for user ${userId}. Reason: ${
        reason || 'Manual clear'
      }`,
    );
  }
}

export async function getFirebaseTokenFromCookie(): Promise<string | undefined> {
  const cookieToken = (await cookies()).get(COOKIE_AUTH_NAME)?.value;

  if (!cookieToken) {
    console.error('getFirebaseTokenFromCookie: Auth cookie not found');
    return undefined;
  }

  // Check cache first to avoid redundant JWT verification
  const cached = tokenCache.get(cookieToken);
  if (cached && cached.expires > Date.now()) {
    return cached.token;
  }

  try {
    // payload = {token, iat, exp, jti}
    const { payload } = await jwtVerify(cookieToken, new TextEncoder().encode(secretKey));
    const firebaseToken = payload.token as string;
    const jti = payload.jti as string;

    if (!firebaseToken) {
      console.error('getFirebaseTokenFromCookie: No Firebase token in JWT payload');
      // Remove invalid token from cache
      tokenCache.delete(cookieToken);
      return undefined;
    }

    // Validate JWT structure - ensure it has required security fields
    if (!jti) {
      console.error(
        'getFirebaseTokenFromCookie: JWT missing unique identifier (jti) - treating as legacy token',
      );
      tokenCache.delete(cookieToken);
      return undefined;
    }

    // Cache the result for a short period
    tokenCache.set(cookieToken, {
      token: firebaseToken,
      expires: Date.now() + CACHE_DURATION,
      userId: payload.sub as string,
    });

    // Clean up old cache entries periodically
    if (tokenCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (value.expires <= now) {
          tokenCache.delete(key);
        }
      }
    }

    return firebaseToken;
  } catch (error) {
    console.error(`getFirebaseTokenFromCookie: JWT verification failed:`, error);
    // Remove from cache if verification fails
    tokenCache.delete(cookieToken);

    // If this is an expired token error, we should clear the cache to prevent stuck states
    if (error instanceof Error && error.message.includes('expired')) {
      console.log('JWT expired, clearing token cache to prevent stuck authentication state');
      clearTokenCache();
    }

    return undefined;
  }
}

export async function getAuthHeaders() {
  let token: string | null = null;

  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.warn('[TokenCache] No Bearer token found in headers');
      return null;
    }

    token = authorization.substring(7);
    const now = Date.now();

    // Check cache first
    const cached = tokenCache.get(token);
    if (cached && cached.expires > now) {
      console.log(`[TokenCache] Cache hit for user ${cached.userId}`);
      return {
        Authorization: authorization,
        'X-API-User-ID': cached.userId,
      };
    }

    // If cached token expired, remove it
    if (cached && cached.expires <= now) {
      console.log(`[TokenCache] Removing expired cached token for user ${cached.userId}`);
      tokenCache.delete(token);
    }

    // Verify token with backend
    console.log('[TokenCache] Cache miss, verifying token with backend...');
    const apiUrl = process.env.CERTIFAI_API_BASE_URL;
    if (!apiUrl) {
      throw new Error('CERTIFAI_API_BASE_URL environment variable is not set');
    }

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn('[TokenCache] Token verification timed out after 10 seconds');
    }, 10000);

    const response = await fetch(`${apiUrl}/api/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[TokenCache] Token verification failed: ${response.status} ${errorText}`);

      // If token is invalid, remove from cache if it exists
      tokenCache.delete(token);
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.data.api_user_id) {
      console.error('[TokenCache] Invalid token verification response:', data);
      tokenCache.delete(token);
      return null;
    }

    const userId = data.data.api_user_id;

    // Cache the verified token
    tokenCache.set(token, {
      token,
      expires: now + TOKEN_CACHE_TTL,
      userId: userId,
    });

    console.log(
      `[TokenCache] Token verified and cached for user ${userId}. Cache size: ${tokenCache.size}`,
    );

    return {
      Authorization: authorization,
      'X-API-User-ID': userId,
    };
  } catch (error) {
    console.error('[TokenCache] Error in getAuthHeaders:', error);

    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[TokenCache] Token verification request timed out');
      // Clear the specific token from cache on timeout
      if (token) {
        tokenCache.delete(token);
      }
    }

    // If this appears to be a network/timeout issue, clear cache to prevent stuck states
    if (
      error instanceof Error &&
      (error.name === 'AbortError' ||
        error.message.includes('timeout') ||
        error.message.includes('network'))
    ) {
      console.log('[TokenCache] Clearing token cache due to network/timeout error');
      clearTokenCache('Network/timeout error in token verification');
    }

    return null;
  }
}

/**
 * Get token cache statistics for debugging
 */
export function getTokenCacheStats() {
  const now = Date.now();
  let activeTokens = 0;
  let expiredTokens = 0;

  for (const [, cached] of tokenCache.entries()) {
    if (cached.expires > now) {
      activeTokens++;
    } else {
      expiredTokens++;
    }
  }

  return {
    totalEntries: tokenCache.size,
    activeTokens,
    expiredTokens,
    cacheHitRate: '(calculated per request)',
  };
}

/**
 * Emergency function to completely reset the token cache system
 */
export function emergencyResetTokenCache(): void {
  // Stop the cleanup interval
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }

  // Clear all tokens
  clearTokenCache('Emergency reset');

  // Restart the cleanup system
  startCacheCleanup();

  console.log('[TokenCache] Emergency reset completed');
}
