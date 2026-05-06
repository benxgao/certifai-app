import { NextResponse } from 'next/server';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';
import {
  getClearCookieOptions,
  logCookieOptions,
  assertAllowedOrigin,
} from '../../../../src/lib/cookie-options';

/**
 * POST /api/auth-cookie/clear
 *
 * Expires the auth cookie.  Called on logout and on auth setup rollback.
 *
 * ⚠️  Refactoring notes:
 * - Both `response.cookies.delete` AND an explicit `maxAge: 0` set are used
 *   intentionally — some browsers honour one and not the other.
 * - The production `.certestic.com` domain cookie is cleared separately;
 *   removing that block will leave a ghost cookie in production.
 * - CSRF guard (assertAllowedOrigin) must remain the first check.
 */
export async function POST(request: Request) {
  const csrfError = assertAllowedOrigin(request);
  if (csrfError) return csrfError;

  const response = NextResponse.json({ success: true });

  // Clear the auth cookie with the correct name
  response.cookies.delete(COOKIE_AUTH_NAME);

  // Add additional cookie clearing options to handle browser caching
  // Set all possible cookie variations to empty with immediate expiration
  const cookiesToClear = [COOKIE_AUTH_NAME];
  const clearCookieOptions = getClearCookieOptions();

  cookiesToClear.forEach((cookieName) => {
    response.cookies.set(cookieName, '', clearCookieOptions);
    logCookieOptions('CLEAR', clearCookieOptions);

    // Also set for root domain to handle subdomain cases in production
    if (process.env.NODE_ENV === 'production') {
      response.cookies.set(cookieName, '', {
        ...clearCookieOptions,
        domain: '.certestic.com',
      });
      console.log('[COOKIE-CLEAR] Also clearing with domain: .certestic.com');
    }
  });

  // Add cache control headers to prevent caching of this response
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  console.log('[COOKIE-CLEAR] Auth cookies cleared with enhanced compatibility');

  return response;
}
