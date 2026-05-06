import { NextResponse } from 'next/server';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';
import { getClearCookieOptions, logCookieOptions } from '../../../../src/lib/cookie-options';

export async function POST() {
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
