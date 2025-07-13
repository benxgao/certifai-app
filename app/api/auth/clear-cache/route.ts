import { NextResponse } from 'next/server';
import { emergencyResetTokenCache, getTokenCacheStats } from '@/src/lib/service-only';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

export async function POST() {
  try {
    console.log('[ClearCache] Emergency cache clear requested');

    // Get cache stats before clearing for debugging
    const statsBefore = getTokenCacheStats();
    console.log('[ClearCache] Cache stats before clearing:', statsBefore);

    // Use emergency reset for complete cleanup
    emergencyResetTokenCache();

    // Create response to clear client-side cookies as well
    const response = NextResponse.json(
      {
        success: true,
        message: 'Cache cleared successfully',
        statsBefore,
        statsAfter: getTokenCacheStats(),
      },
      { status: 200 },
    );

    // Clear all auth-related cookies
    response.cookies.delete(COOKIE_AUTH_NAME);
    response.cookies.delete('joseToken'); // Legacy cookie

    // Explicitly set cookies to expire immediately
    response.cookies.set(COOKIE_AUTH_NAME, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.cookies.set('joseToken', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    console.log('[ClearCache] Server-side cache and cookies cleared');

    return response;
  } catch (error) {
    console.error('[ClearCache] Error clearing cache:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
