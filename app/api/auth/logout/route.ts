import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';
import { emergencyResetTokenCache } from '@/src/lib/service-only';

/**
 * Comprehensive logout endpoint that clears all authentication state
 * This endpoint ensures complete cleanup of server-side state
 */
export async function POST() {
  try {
    console.log('[Logout] Comprehensive logout requested');

    // Get cookies store
    const cookieStore = await cookies();

    // Clear the auth cookie
    cookieStore.delete(COOKIE_AUTH_NAME);

    // Emergency reset of token cache to clear any stuck states
    emergencyResetTokenCache();

    // Create response with comprehensive cookie clearing
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout completed successfully',
      },
      { status: 200 },
    );

    // Clear all possible authentication cookies
    const cookiesToClear = [COOKIE_AUTH_NAME, 'authToken', 'firebaseToken', 'apiUserId'];

    cookiesToClear.forEach((cookieName) => {
      // Delete the cookie
      response.cookies.delete(cookieName);

      // Explicitly set cookies to expire immediately with multiple domain variations
      response.cookies.set(cookieName, '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      // Also set for domain variations in production
      if (process.env.NODE_ENV === 'production') {
        response.cookies.set(cookieName, '', {
          maxAge: 0,
          path: '/',
          domain: '.certestic.com',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
      }
    });

    // Add cache control headers to prevent caching of logout response
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    console.log('[Logout] Server-side state cleared successfully');

    return response;
  } catch (error) {
    console.error('[Logout] Error during logout:', error);

    // Even if there's an error, return success to prevent stuck logout states
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout completed (with errors, but state cleared)',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 },
    );

    // Still try to clear cookies even on error
    response.cookies.delete(COOKIE_AUTH_NAME);
    response.cookies.set(COOKIE_AUTH_NAME, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
