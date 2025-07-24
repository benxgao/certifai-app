import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';
import { verifyToken } from '../../../../src/firebase/verifyTokenByAdmin';
import { checkRateLimit, createRateLimitHeaders } from '@/src/lib/rate-limiting';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function POST() {
  // Apply rate limiting
  const rateLimitResult = checkRateLimit(new Request('http://localhost'), 'TOKEN_REFRESH');
  if (!rateLimitResult.allowed) {
    const headers = createRateLimitHeaders(rateLimitResult);
    return Response.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many token refresh attempts. Please try again later.',
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers,
      },
    );
  }
  if (!secretKey) {
    console.error('auth-cookie/refresh: JWT secret not configured');
    return Response.json(
      {
        success: false,
        error: 'SERVER_CONFIGURATION_ERROR',
        message: 'JWT secret not configured',
      },
      { status: 500 },
    );
  }

  try {
    const cookieStore = await cookies();
    const joseToken = cookieStore.get(COOKIE_AUTH_NAME)?.value;

    if (!joseToken) {
      console.log('auth-cookie/refresh: No token found in cookies');
      return Response.json(
        {
          success: false,
          error: 'NO_TOKEN',
          message: 'No authentication token found',
          requiresReauth: true,
        },
        { status: 401 },
      );
    }

    console.log('auth-cookie/refresh: Attempting to refresh token');

    let payload;

    try {
      // Decode the JWT to get the Firebase token
      const result = await jwtVerify(joseToken, new TextEncoder().encode(secretKey));
      payload = result.payload;
    } catch (jwtError: any) {
      // Check if the error is specifically a JWT expiration error
      if (
        jwtError.code === 'ERR_JWT_EXPIRED' ||
        jwtError.message?.includes('exp') ||
        jwtError.name === 'JWTExpired'
      ) {
        console.log(
          'auth-cookie/refresh: JWT token expired, attempting to extract payload without verification',
        );

        try {
          // For expired JWTs, we can still decode the payload without verification
          // to extract the Firebase token for re-validation
          const [, payloadB64] = joseToken.split('.');
          const decodedPayload = JSON.parse(atob(payloadB64));
          payload = decodedPayload;

          console.log('auth-cookie/refresh: Successfully extracted payload from expired JWT');
        } catch (decodeError) {
          console.error('auth-cookie/refresh: Failed to decode expired JWT payload:', decodeError);
          cookieStore.delete(COOKIE_AUTH_NAME);
          return Response.json(
            {
              success: false,
              error: 'MALFORMED_TOKEN',
              message: 'Token is malformed and cannot be decoded',
              requiresReauth: true,
            },
            { status: 401 },
          );
        }
      } else {
        console.error(
          'auth-cookie/refresh: JWT verification failed with non-expiration error:',
          jwtError,
        );
        cookieStore.delete(COOKIE_AUTH_NAME);
        return Response.json(
          {
            success: false,
            error: 'INVALID_TOKEN',
            message: 'Token format is invalid',
            requiresReauth: true,
          },
          { status: 401 },
        );
      }
    }

    const firebaseToken = payload.token as string;

    if (!firebaseToken) {
      console.error('auth-cookie/refresh: Invalid token structure - no Firebase token found');
      cookieStore.delete(COOKIE_AUTH_NAME);
      return Response.json(
        {
          success: false,
          error: 'INVALID_TOKEN_STRUCTURE',
          message: 'Token does not contain valid Firebase authentication data',
          requiresReauth: true,
        },
        { status: 401 },
      );
    }

    // Verify the Firebase token is still valid (user still authenticated)
    const decodedToken = await verifyToken(firebaseToken);

    if (!decodedToken || !decodedToken.valid) {
      console.error('auth-cookie/refresh: Firebase token invalid or expired');
      cookieStore.delete(COOKIE_AUTH_NAME);
      return Response.json(
        {
          success: false,
          error: 'FIREBASE_TOKEN_INVALID',
          message: 'Firebase authentication token is no longer valid',
          requiresReauth: true,
        },
        { status: 401 },
      );
    }

    console.log(`auth-cookie/refresh: Firebase token valid for user ${decodedToken.uid}`);

    // Create a new JOSE token with extended expiration
    const newJoseToken = await new SignJWT({ token: firebaseToken })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(secretKey));

    // Set the new cookie
    cookieStore.set(COOKIE_AUTH_NAME, newJoseToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    console.log('auth-cookie/refresh: Token refreshed successfully');

    return Response.json({
      success: true,
      message: 'Token refreshed successfully',
      userId: decodedToken.uid,
    });
  } catch (error: any) {
    console.error('auth-cookie/refresh: Unexpected error:', error);

    // If token verification fails, clear the cookie
    try {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_AUTH_NAME);
    } catch (cleanupError) {
      console.error('auth-cookie/refresh: Failed to cleanup cookie:', cleanupError);
    }

    return Response.json(
      {
        success: false,
        error: 'REFRESH_FAILED',
        message: 'An unexpected error occurred during token refresh',
        requiresReauth: true,
      },
      { status: 500 },
    );
  }
}
