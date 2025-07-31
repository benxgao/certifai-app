import 'server-only';

import { cookies } from 'next/headers';
import { getAdminSDK } from '@/src/firebase/firebaseAdminConfig';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JOSE_JWT_SECRET;

interface ServerAuthResult {
  isAuthenticated: boolean;
  userId?: string;
  needsRefresh: boolean;
  error?: string;
}

/**
 * Server-side authentication check that can be used in page components
 * and API routes to verify user authentication without client-side Firebase calls
 */
export async function getServerAuthState(): Promise<ServerAuthResult> {
  try {
    if (!secretKey) {
      return { isAuthenticated: false, needsRefresh: false, error: 'JWT secret not configured' };
    }

    const cookieStore = await cookies();
    const joseToken = cookieStore.get(COOKIE_AUTH_NAME)?.value;

    if (!joseToken) {
      return { isAuthenticated: false, needsRefresh: false, error: 'No auth token found' };
    }

    // First, try to verify the JWT wrapper
    let payload;
    try {
      const { payload: jwtPayload } = await jwtVerify(
        joseToken,
        new TextEncoder().encode(secretKey),
      );
      payload = jwtPayload;
    } catch (jwtError: any) {
      // If JWT is expired, we might still be able to refresh
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
        return { isAuthenticated: false, needsRefresh: true, error: 'JWT wrapper expired' };
      }
      return { isAuthenticated: false, needsRefresh: false, error: 'Invalid JWT wrapper' };
    }

    const firebaseToken = payload.token as string;
    if (!firebaseToken) {
      return { isAuthenticated: false, needsRefresh: false, error: 'No Firebase token in JWT' };
    }

    // Verify the Firebase token using Admin SDK (server-side only)
    const admin = getAdminSDK();
    try {
      const decodedToken = await admin.auth.verifyIdToken(firebaseToken, true);
      return {
        isAuthenticated: true,
        userId: decodedToken.uid,
        needsRefresh: false,
      };
    } catch (firebaseError: any) {
      // Firebase token is invalid or expired
      if (firebaseError.code === 'auth/id-token-expired') {
        return { isAuthenticated: false, needsRefresh: true, error: 'Firebase token expired' };
      }
      return { isAuthenticated: false, needsRefresh: false, error: 'Firebase token invalid' };
    }
  } catch (error) {
    return { isAuthenticated: false, needsRefresh: false, error: 'Server error' };
  }
}

/**
 * Server-side token refresh strategy
 * Since Firebase Admin SDK cannot directly create ID tokens, we need to extract
 * user information and work with the existing authentication flow
 */
export async function refreshServerSideToken(uid: string): Promise<string | null> {
  try {
    const admin = getAdminSDK();

    // Instead of creating a custom token (which requires client-side exchange),
    // we'll verify the user still exists and is valid, then return null
    // to indicate that client-side refresh is needed
    const userRecord = await admin.auth.getUser(uid);

    if (userRecord.disabled) {
      return null;
    }

    // User is valid but we cannot create an ID token server-side
    // Firebase ID tokens can only be created client-side or via custom token exchange
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Enhanced server auth state that handles token expiration better
 */
export async function getServerAuthStateWithRefresh(): Promise<
  ServerAuthResult & {
    needsClientRefresh?: boolean;
  }
> {
  try {
    if (!secretKey) {
      return { isAuthenticated: false, needsRefresh: false, error: 'JWT secret not configured' };
    }

    const cookieStore = await cookies();
    const joseToken = cookieStore.get(COOKIE_AUTH_NAME)?.value;

    if (!joseToken) {
      return { isAuthenticated: false, needsRefresh: false, error: 'No auth token found' };
    }

    // First, try to verify the JWT wrapper
    let payload;
    let jwtExpired = false;

    try {
      const { payload: jwtPayload } = await jwtVerify(
        joseToken,
        new TextEncoder().encode(secretKey),
      );
      payload = jwtPayload;
    } catch (jwtError: any) {

      // If JWT is expired, try to decode payload without verification
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
        jwtExpired = true;
        try {
          // Decode without verification to get the Firebase token
          const parts = joseToken.split('.');
          if (parts.length === 3) {
            payload = JSON.parse(atob(parts[1]));
          }
        } catch {
          return {
            isAuthenticated: false,
            needsRefresh: false,
            error: 'Cannot decode expired JWT',
          };
        }
      } else {
        return { isAuthenticated: false, needsRefresh: false, error: 'Invalid JWT wrapper' };
      }
    }

    const firebaseToken = payload?.token as string;
    if (!firebaseToken) {
      return { isAuthenticated: false, needsRefresh: false, error: 'No Firebase token in JWT' };
    }

    // Verify the Firebase token using Admin SDK (server-side only)
    const admin = getAdminSDK();
    try {
      const decodedToken = await admin.auth.verifyIdToken(firebaseToken, true);

      // If JWT wrapper was expired but Firebase token is still valid
      if (jwtExpired) {
        return {
          isAuthenticated: true,
          userId: decodedToken.uid,
          needsRefresh: true,
          needsClientRefresh: false, // We can refresh the JWT wrapper
          error: 'JWT wrapper expired but Firebase token valid',
        };
      }

      return {
        isAuthenticated: true,
        userId: decodedToken.uid,
        needsRefresh: false,
      };
    } catch (firebaseError: any) {

      // Firebase token is invalid or expired
      if (firebaseError.code === 'auth/id-token-expired') {
        return {
          isAuthenticated: false,
          needsRefresh: true,
          needsClientRefresh: true, // Need client-side refresh
          error: 'Firebase token expired',
        };
      }
      return { isAuthenticated: false, needsRefresh: false, error: 'Firebase token invalid' };
    }
  } catch (error) {
    return { isAuthenticated: false, needsRefresh: false, error: 'Server error' };
  }
}

/**
 * Create a new JWT wrapper for a Firebase token (server-side)
 */
export async function createJWTWrapper(firebaseToken: string): Promise<string | null> {
  try {
    if (!secretKey) {
      throw new Error('JWT secret not configured');
    }

    const now = Math.floor(Date.now() / 1000);
    const joseToken = await new SignJWT({
      token: firebaseToken,
      iat: now,
      jti: `${now}-${Math.random().toString(36).substr(2, 9)}`,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(secretKey));

    return joseToken;
  } catch (error) {
    return null;
  }
}
