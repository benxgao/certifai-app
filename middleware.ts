import * as jose from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_AUTH_NAME } from './src/config/constants';

/**
 * A sample of firebaseToken
 *  {
      "iss": "https://securetoken.google.com/certifai-prod",
      "aud": "certifai-prod",
      "auth_time": 1747879437,
      "user_id": "2GzVTQxxxxxzrnYO7pObj1",
      "sub": "2GzVTQxxxxxHONzrnYO7pObj1",
      "iat": 1747879491,
      "exp": 1747883091,
      "email": "xxxxx@gmail.com",
      "email_verified": false,
      "firebase": {
        "identities": {
          "email": [
            "xxxxx@gmail.com"
          ]
        },
        "sign_in_provider": "password"
      }
    }
  */

/**
 * For protecting path: /main/:path*, we assume a cookie has been set at the stage of login/signup
 * and the cookie contains a Jose token, and Firebase Token can be seen by decoding joseToken.
 */
export async function middleware(request: NextRequest) {
  try {
    const joseToken = request.cookies.get(COOKIE_AUTH_NAME)?.value;
    const legacyToken = request.cookies.get('joseToken')?.value; // Check for legacy cookie

    console.log(`middleware:
      | origin: ${request.nextUrl.origin}
      | path: ${request.nextUrl.pathname}
      | has_auth_token: ${!!joseToken}
      | has_legacy_token: ${!!legacyToken}
      | url: ${request.url}`);

    // If we find a legacy token but no current token, clear the legacy token
    if (legacyToken && !joseToken) {
      console.log('middleware: Found legacy token, clearing it and redirecting to signin');
      const response = NextResponse.redirect(
        new URL(
          '/signin?error=' + encodeURIComponent('Your session has expired. Please sign in again.'),
          request.url,
        ),
      );
      response.cookies.delete('joseToken');
      response.cookies.delete(COOKIE_AUTH_NAME);
      // Add explicit cookie expiration
      response.cookies.set('joseToken', '', { maxAge: 0, path: '/' });
      response.cookies.set(COOKIE_AUTH_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }

    if (!joseToken) {
      throw new Error('No auth token cookie found');
    }

    // Decode and validate the JWT structure
    let decodedPayload;
    try {
      decodedPayload = jose.decodeJwt(joseToken as string);
    } catch (decodeError) {
      console.error('middleware: Invalid JWT format:', decodeError);
      const response = NextResponse.redirect(
        new URL(
          '/signin?error=' + encodeURIComponent('Invalid session. Please sign in again.'),
          request.url,
        ),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      response.cookies.delete('joseToken');
      return response;
    }

    const { token, exp, jti } = decodedPayload;
    const firebaseToken = token; // this is the token containing the firebase info

    // Validate that we have required fields
    if (!firebaseToken) {
      console.error('middleware: Missing Firebase token in JWT');
      const response = NextResponse.redirect(
        new URL(
          '/signin?error=' + encodeURIComponent('Invalid session format. Please sign in again.'),
          request.url,
        ),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      response.cookies.delete('joseToken');
      return response;
    }

    // For additional security, we can check if the token has our unique identifier (jti)
    // Tokens without jti are likely legacy tokens
    if (!jti) {
      console.log('middleware: Token missing unique identifier, treating as legacy');
      const response = NextResponse.redirect(
        new URL(
          '/signin?error=' + encodeURIComponent('Please sign in again for enhanced security.'),
          request.url,
        ),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      response.cookies.delete('joseToken');
      return response;
    }

    if (exp && exp < Date.now() / 1000) {
      console.error('middleware: token expired:', {
        expiredAt: exp,
        currentTime: Date.now() / 1000,
      });

      // Try to refresh the token using enhanced server-side refresh
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL || request.nextUrl.origin;
        const refreshUrl = `${BASE_URL}/api/auth-cookie/server-refresh`;

        console.log(`middleware: attempting enhanced server-side token refresh at ${refreshUrl}`);

        const refreshResponse = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
          },
        });

        if (refreshResponse.ok) {
          console.log('middleware: token refreshed successfully');

          // Create a new response with the refreshed token cookie
          const response = NextResponse.next();

          // Extract the Set-Cookie header from the refresh response
          const setCookieHeader = refreshResponse.headers.get('set-cookie');
          if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
            console.log('middleware: updated cookie in response');
          } else {
            console.warn('middleware: no set-cookie header found in refresh response');
          }

          return response;
        } else {
          const errorText = await refreshResponse.text();
          console.error('middleware: token refresh failed:', {
            status: refreshResponse.status,
            error: errorText,
          });
          throw new Error(`Token refresh failed: ${refreshResponse.status}`);
        }
      } catch (refreshError: any) {
        console.error('middleware: token refresh error:', refreshError.message);

        // If refresh fails, clear the cookie and redirect to signin
        const response = NextResponse.redirect(
          new URL(
            '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
            request.url,
          ),
        );
        response.cookies.delete(COOKIE_AUTH_NAME);

        return response;
      }
    }

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL || request.nextUrl.origin;
      const url = `${BASE_URL}/api/auth-cookie/verify`;

      console.log(`middleware: api/auth-cookie/verify
        | BASE_URL: ${BASE_URL}
        | url: ${url}`);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${joseToken}`,
        },
      });

      if (!res.ok) {
        console.error(`fetch error: ${JSON.stringify(res.status)}`);
        throw new Error(`Failed to fetch data: ${JSON.stringify(res.body)}`);
      }

      const data: any = await res.json(); // {"valid":true}

      console.log(`middleware: api/auth-cookie/verify data: ${JSON.stringify(data)}`);

      if (!data.valid) {
        console.error('middleware: token invalid:', { data });

        const response = NextResponse.redirect(
          new URL(
            '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
            request.url,
          ),
        );
        response.cookies.delete(COOKIE_AUTH_NAME);

        return response;
      }

      return NextResponse.next();
    } catch (error: any) {
      console.log(`middleware: failed to verify: ${JSON.stringify(error.toString())}`);

      const response = NextResponse.redirect(
        new URL(
          '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
          request.url,
        ),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);

      return response;
    }
  } catch (error: any) {
    console.error('middleware error:', {
      message: error.message,
      code: error.code,
      // stack: error.stack,
    });

    const response = NextResponse.redirect(
      new URL(
        '/signin?error=' + encodeURIComponent('Session expired. Please sign in again.'),
        request.url,
      ),
    );
    response.cookies.delete(COOKIE_AUTH_NAME);

    return response;
  }
}

// Add the paths that should be protected
export const config = {
  matcher: ['/main/:path*'],
};
