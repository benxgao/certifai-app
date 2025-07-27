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
  // Skip middleware for static assets and images
  const pathname = request.nextUrl.pathname;

  // Define static file extensions that should bypass authentication
  const staticFileExtensions = [
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.ico',
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.json',
    '.xml',
    '.txt',
    '.pdf',
    '.doc',
    '.docx',
    '.zip',
  ];

  // Check if the request is for a static file or image
  const isStaticFile = staticFileExtensions.some((ext) => pathname.endsWith(ext));
  const isImagePath = pathname.startsWith('/images/') || pathname.includes('/_next/image/');
  const isNextStatic = pathname.startsWith('/_next/static/');

  if (isStaticFile || isImagePath || isNextStatic) {
    console.log(`middleware: skipping static asset: ${pathname}`);
    return NextResponse.next();
  }

  try {
    // Debug: Log all cookies to see what's available
    const allCookies = request.cookies.getAll();
    console.log(
      `middleware: all cookies:`,
      allCookies.map((c) => ({ name: c.name, hasValue: !!c.value })),
    );
    console.log(`middleware: looking for cookie name: ${COOKIE_AUTH_NAME}`);

    const joseToken = request.cookies.get(COOKIE_AUTH_NAME)?.value;

    console.log(`middleware:
      | origin: ${request.nextUrl.origin}
      | path: ${request.nextUrl.pathname}
      | has_auth_token: ${!!joseToken}
      | url: ${request.url}`);

    // If we find a legacy token but no current token, clear the legacy token
    if (!joseToken) {
      console.log('middleware: Found legacy token, clearing it and redirecting to signin');
      const response = NextResponse.redirect(
        new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      response.cookies.set(COOKIE_AUTH_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }

    if (!joseToken) {
      console.log('middleware: No auth token found, redirecting to signin');
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Decode and validate the JWT structure
    let decodedPayload;
    try {
      decodedPayload = jose.decodeJwt(joseToken as string);
    } catch (decodeError) {
      console.error('middleware: Invalid JWT format:', decodeError);
      const response = NextResponse.redirect(
        new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      return response;
    }

    const { token, exp, jti } = decodedPayload;
    const firebaseToken = token; // this is the token containing the firebase info

    // Validate that we have required fields
    if (!firebaseToken) {
      console.error('middleware: Missing Firebase token in JWT');
      const response = NextResponse.redirect(
        new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      return response;
    }

    // For additional security, we can check if the token has our unique identifier (jti)
    // Tokens without jti are likely legacy tokens, but we'll give them a grace period
    if (!jti) {
      console.log('middleware: Token missing unique identifier - checking if recent token');

      // Check if token is recent (less than 1 hour old) - allow recent tokens without jti
      const tokenIssuedAt = decodedPayload.iat || 0;
      const tokenAge = Math.floor(Date.now() / 1000) - tokenIssuedAt;

      if (tokenAge > 3600) {
        // 1 hour
        console.log('middleware: Legacy token older than 1 hour, requiring refresh');
        const response = NextResponse.redirect(
          new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
        );
        response.cookies.delete(COOKIE_AUTH_NAME);
        return response;
      } else {
        console.log('middleware: Recent token without jti accepted, will refresh on next request');
      }
    }

    // Check if the outer JWT has expired
    if (exp && exp < Date.now() / 1000) {
      console.error('middleware: JWT token expired:', {
        expiredAt: exp,
        currentTime: Date.now() / 1000,
      });

      // Try to refresh the token using enhanced server-side refresh
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL || request.nextUrl.origin;
        const refreshUrl = `${BASE_URL}/api/auth-cookie/server-refresh`;

        console.log(`middleware: attempting enhanced server-side token refresh at ${refreshUrl}`);

        // Set a timeout for the refresh request to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.warn('middleware: token refresh timed out after 10 seconds');
        }, 10000); // 10 second timeout

        const refreshResponse = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

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
          new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
        );
        response.cookies.delete(COOKIE_AUTH_NAME);
        // Add explicit cookie expiration
        response.cookies.set(COOKIE_AUTH_NAME, '', { maxAge: 0, path: '/' });

        return response;
      }
    }

    // Validate the Firebase token inside the JWT
    let firebaseDecodedToken;
    try {
      firebaseDecodedToken = jose.decodeJwt(firebaseToken as string);
    } catch (decodeError) {
      console.error('middleware: Invalid Firebase token format:', decodeError);
      const response = NextResponse.redirect(
        new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
      );
      response.cookies.delete(COOKIE_AUTH_NAME);
      return response;
    }

    // Check if Firebase token has expired
    const firebaseExp = firebaseDecodedToken.exp;
    if (firebaseExp && firebaseExp < Date.now() / 1000) {
      console.error('middleware: Firebase token expired:', {
        expiredAt: firebaseExp,
        currentTime: Date.now() / 1000,
      });

      // Try token refresh for expired Firebase tokens
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL || request.nextUrl.origin;
        const refreshUrl = `${BASE_URL}/api/auth-cookie/server-refresh`;

        const refreshResponse = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
          },
        });

        if (refreshResponse.ok) {
          console.log('middleware: Firebase token refreshed successfully');
          const response = NextResponse.next();
          const setCookieHeader = refreshResponse.headers.get('set-cookie');
          if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
          }
          return response;
        } else {
          throw new Error(`Token refresh failed: ${refreshResponse.status}`);
        }
      } catch (refreshError) {
        console.error('middleware: Firebase token refresh failed:', refreshError);
        const response = NextResponse.redirect(
          new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
        );
        response.cookies.delete(COOKIE_AUTH_NAME);
        return response;
      }
    }

    // Basic validation passed, allow request to proceed
    console.log('middleware: basic token validation passed, allowing request');
    return NextResponse.next();
  } catch (error: any) {
    console.error('middleware error:', {
      message: error.message,
      code: error.code,
    });

    const response = NextResponse.redirect(
      new URL('/signin?error=' + encodeURIComponent('session_expired'), request.url),
    );
    response.cookies.delete(COOKIE_AUTH_NAME);
    response.cookies.set(COOKIE_AUTH_NAME, '', { maxAge: 0, path: '/' });

    return response;
  }
}

// Add the paths that should be protected
// Only protect /main/* paths, exclude static assets via regex
export const config = {
  matcher: ['/main/:path*'],
};
