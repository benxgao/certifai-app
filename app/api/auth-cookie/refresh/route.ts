import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';
import { verifyToken } from '../../../../src/firebase/verifyTokenByAdmin';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function POST() {
  if (!secretKey) {
    console.error('auth-cookie/refresh: JWT secret not configured');
    return new Response('JWT secret not configured', { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const joseToken = cookieStore.get(COOKIE_AUTH_NAME)?.value;

    if (!joseToken) {
      console.log('auth-cookie/refresh: No token found in cookies');
      return new Response('No token found', { status: 401 });
    }

    console.log('auth-cookie/refresh: Attempting to refresh token');

    let payload;
    try {
      // Decode the expired JWT to get the Firebase token
      const result = await jwtVerify(joseToken, new TextEncoder().encode(secretKey));
      payload = result.payload;
    } catch (jwtError) {
      console.error('auth-cookie/refresh: JWT verification failed:', jwtError);
      // If JWT is completely invalid, clear the cookie
      cookieStore.delete(COOKIE_AUTH_NAME);
      return new Response('Invalid token format', { status: 401 });
    }

    const firebaseToken = payload.token as string;

    if (!firebaseToken) {
      console.error('auth-cookie/refresh: Invalid token structure - no Firebase token found');
      cookieStore.delete(COOKIE_AUTH_NAME);
      return new Response('Invalid token structure', { status: 401 });
    }

    // Verify the Firebase token is still valid (user still authenticated)
    const decodedToken = await verifyToken(firebaseToken);

    if (!decodedToken || !decodedToken.valid) {
      console.error('auth-cookie/refresh: Firebase token invalid or expired');
      cookieStore.delete(COOKIE_AUTH_NAME);
      return new Response('Firebase token invalid', { status: 401 });
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

    return new Response('Token refresh failed', { status: 401 });
  }
}
