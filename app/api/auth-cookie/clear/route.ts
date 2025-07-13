import { NextResponse } from 'next/server';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie with the correct name
  response.cookies.delete(COOKIE_AUTH_NAME);

  // Also clear legacy cookie name if it exists
  response.cookies.delete('joseToken');
  response.cookies.delete('authToken');

  // Add additional cookie clearing options to handle browser caching
  // Set all possible cookie variations to empty with immediate expiration
  const cookiesToClear = [COOKIE_AUTH_NAME, 'joseToken', 'authToken'];
  
  cookiesToClear.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    // Also set for root domain to handle subdomain cases
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.certifai.com' : undefined,
      maxAge: 0, // Expire immediately
    });
  });

  // Add cache control headers to prevent caching of this response
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  console.log('Auth cookies cleared with enhanced compatibility');

  return response;
}
