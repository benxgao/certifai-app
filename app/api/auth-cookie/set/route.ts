import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function POST(request: Request) {
  if (!secretKey) {
    return new Response('JWT secret not configured', { status: 500 });
  }

  const body: { firebaseToken: string } = await request.json();

  console.log(`auth-cookie/set:0
    | req_body: ${JSON.stringify(body)}`);

  const firebaseToken = (body as any).firebaseToken;

  if (!firebaseToken) {
    return new Response('Firebase token required', { status: 400 });
  }

  try {
    // Get current cookies and clear any existing auth cookies first
    const cookieStore = await cookies();

    // Clear any existing auth cookies to ensure fresh state
    cookieStore.delete(COOKIE_AUTH_NAME);
    cookieStore.delete('joseToken'); // Clear legacy cookie name

    console.log('auth-cookie/set: Cleared existing auth cookies');

    // Generate a completely new JWT with current timestamp to ensure uniqueness
    const now = Math.floor(Date.now() / 1000);
    const joseToken = await new SignJWT({
      token: firebaseToken,
      iat: now,
      jti: `${now}-${Math.random().toString(36).substr(2, 9)}`, // Add unique identifier
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(secretKey));

    console.log('auth-cookie/set:1 | Generated new joseToken');

    // Set secure cookie with enhanced security options
    cookieStore.set(COOKIE_AUTH_NAME, joseToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
      // Add domain restriction in production
      ...(process.env.NODE_ENV === 'production' && {
        domain: '.certestic.com',
      }),
    });

    console.log('auth-cookie/set: Successfully set new auth cookie');

    return Response.json({ success: true });
  } catch (error) {
    console.error('auth-cookie/set: error:', error);
    return new Response('auth-cookie/set: error', { status: 500 });
  }
}
