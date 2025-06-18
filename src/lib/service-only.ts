import 'server-only';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

const secretKey = process.env.JOSE_JWT_SECRET;

// Cache for frequently accessed tokens to reduce JWT verification overhead
const tokenCache = new Map<string, { token: string; expires: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export async function getFirebaseTokenFromCookie(): Promise<string | undefined> {
  const cookieToken = (await cookies()).get(COOKIE_AUTH_NAME)?.value;

  if (!cookieToken) {
    console.error('api/certifications: Auth cookie not found');
    return undefined;
  }

  // Check cache first to avoid redundant JWT verification
  const cached = tokenCache.get(cookieToken);
  if (cached && cached.expires > Date.now()) {
    return cached.token;
  }

  try {
    // payload = {token, iat, exp}
    const { payload } = await jwtVerify(cookieToken, new TextEncoder().encode(secretKey));
    const firebaseToken = payload.token as string;

    // Cache the result for a short period
    tokenCache.set(cookieToken, {
      token: firebaseToken,
      expires: Date.now() + CACHE_DURATION,
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
    console.error(`api/certifications: JWT verification failed: ${error}`);
    // Remove from cache if verification fails
    tokenCache.delete(cookieToken);
    return undefined;
  }
}
