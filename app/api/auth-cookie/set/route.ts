import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';
import {
  getAuthCookieOptions,
  logCookieOptions,
  assertAllowedOrigin,
} from '../../../../src/lib/cookie-options';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function POST(request: Request) {
  const csrfError = assertAllowedOrigin(request);
  if (csrfError) return csrfError;

  if (!secretKey) {
    return new Response('JWT secret not configured', { status: 500 });
  }

  const body = (await request.json()) as { firebaseToken?: string };

  console.log(`[ENV] NODE_ENV=${process.env.NODE_ENV}`);
  console.log(`auth-cookie/set:0
    | req_body: ${JSON.stringify(body)}`);

  const firebaseToken = body.firebaseToken;

  if (!firebaseToken) {
    return new Response('Firebase token required', { status: 400 });
  }

  try {
    // Get current cookies and clear any existing auth cookies first
    const cookieStore = await cookies();

    // Clear any existing auth cookies to ensure fresh state
    cookieStore.delete(COOKIE_AUTH_NAME);

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

    // Set secure cookie with enhanced security options
    const cookieOptions = getAuthCookieOptions();
    cookieStore.set(COOKIE_AUTH_NAME, joseToken, cookieOptions);

    logCookieOptions('SET', cookieOptions);

    // [DEBUG] Immediately read back the cookie to confirm it was stored in the
    // Next.js cookie jar before the response is flushed.
    const written = cookieStore.get(COOKIE_AUTH_NAME);
    if (written) {
      console.log(
        `[COOKIE-SET][DEBUG] Cookie "${COOKIE_AUTH_NAME}" verified in cookie store ` +
          `(value length=${written.value.length}, first8=${written.value.substring(0, 8)}…)`,
      );
    } else {
      console.error(
        `[COOKIE-SET][DEBUG] Cookie "${COOKIE_AUTH_NAME}" NOT found in cookie store immediately after set – ` +
          'this means Next.js rejected the write. Check options above.',
      );
    }
    console.log('[COOKIE-SET] Successfully set new auth cookie');

    return Response.json({ success: true });
  } catch (error) {
    console.error('auth-cookie/set: error:', error);
    return new Response('auth-cookie/set: error', { status: 500 });
  }
}
