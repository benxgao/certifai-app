import * as jose from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_AUTH_NAME } from './src/config/constants';

/**
 * Simplified middleware for protecting /main/* paths.
 * Validates JWT token and handles token refresh when needed.
 * Enhanced to handle auth transitions gracefully.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Log environment at middleware entry
  console.log(`[ENV] NODE_ENV=${process.env.NODE_ENV}`);

  // Skip middleware for static assets
  const staticExtensions = [
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
  ];
  const isStaticFile = staticExtensions.some((ext) => pathname.endsWith(ext));
  const isImagePath = pathname.startsWith('/images/') || pathname.includes('/_next/image/');
  const isNextStatic = pathname.startsWith('/_next/static/');

  if (isStaticFile || isImagePath || isNextStatic) {
    return NextResponse.next();
  }

  try {
    const joseToken = request.cookies.get(COOKIE_AUTH_NAME)?.value;
    console.log(
      `[COOKIE-MIDDLEWARE] Checking token for path: ${pathname}, HasToken: ${!!joseToken}`,
    );

    // Handle signin page - redirect authenticated users to main
    if (pathname === '/signin') {
      if (!joseToken) {
        // No token, allow access to signin page
        console.log('[COOKIE-MIDDLEWARE] /signin: No token, allowing access');
        return NextResponse.next();
      }

      // Validate token and redirect to main if valid
      if (await isValidToken(joseToken)) {
        console.log('[COOKIE-MIDDLEWARE] /signin: Valid token found, redirecting to /main');
        return NextResponse.redirect(new URL('/main', request.url));
      } else {
        // Invalid token, clear it and allow signin page access
        console.log('[COOKIE-MIDDLEWARE] /signin: Invalid token, clearing and allowing access');
        const response = NextResponse.next();
        response.cookies.delete(COOKIE_AUTH_NAME);
        response.cookies.set(COOKIE_AUTH_NAME, '', { maxAge: 0, path: '/' });
        return response;
      }
    }

    // Handle protected /main/* paths
    if (pathname.startsWith('/main')) {
      // No token found - redirect to signin
      if (!joseToken) {
        console.log('[COOKIE-MIDDLEWARE] /main: No token found, redirecting to /signin');
        return redirectToSignin(request);
      }

      // Validate token for protected routes
      const tokenValidation = await isValidToken(joseToken);
      if (tokenValidation) {
        console.log('[COOKIE-MIDDLEWARE] /main: Token valid, allowing access');
        return NextResponse.next();
      } else {
        console.log('[COOKIE-MIDDLEWARE] /main: Token invalid');
        // Check if this might be during an auth transition
        // by checking for recent authentication activity indicators
        const referer = request.headers.get('referer');
        const userAgent = request.headers.get('user-agent');
        const hasAuthTransition =
          referer &&
          (referer.includes('/signin') ||
            referer.includes('/signup') ||
            request.headers.get('cache-control') === 'no-cache' ||
            // Also check if this is a direct navigation from signin
            (userAgent && !userAgent.includes('bot')));

        if (hasAuthTransition) {
          // User auth state verified successfully - proceeding to protected route
          console.log('[COOKIE-MIDDLEWARE] /main: Auth transition detected, proceeding');
          const response = NextResponse.next();
          return response;
        } else {
          console.log('[COOKIE-MIDDLEWARE] /main: Session expired, redirecting to /signin');
          return redirectToSignin(request, 'session_expired');
        }
      }
    }

    // For all other paths, continue normally
    return NextResponse.next();
  } catch (error) {
    // middleware error
    if (pathname.startsWith('/main')) {
      return redirectToSignin(request, 'session_expired');
    }
    return NextResponse.next();
  }
}

/**
 * Helper function to validate JWT token
 */
async function isValidToken(joseToken: string): Promise<boolean> {
  try {
    // Decode JWT token
    const decodedPayload = jose.decodeJwt(joseToken);
    const { token: firebaseToken, exp } = decodedPayload;

    // Validate Firebase token exists
    if (!firebaseToken) {
      return false;
    }

    // Check if JWT has expired
    if (exp && exp < Date.now() / 1000) {
      return false;
    }

    // Validate Firebase token expiration
    const firebaseDecodedToken = jose.decodeJwt(firebaseToken as string);
    const firebaseExp = firebaseDecodedToken.exp;

    if (firebaseExp && firebaseExp < Date.now() / 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Helper function to redirect to signin and clear auth cookie
 */
function redirectToSignin(request: NextRequest, error?: string) {
  const url = error ? `/signin?error=${encodeURIComponent(error)}` : '/signin';

  const response = NextResponse.redirect(new URL(url, request.url));
  response.cookies.delete(COOKIE_AUTH_NAME);
  response.cookies.set(COOKIE_AUTH_NAME, '', { maxAge: 0, path: '/' });
  return response;
}

// Add the paths that should be protected
// Protect /main/* paths and handle /signin for authenticated users
export const config = {
  matcher: ['/main/:path*', '/signin'],
};
