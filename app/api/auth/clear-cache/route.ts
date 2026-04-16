import { NextResponse } from 'next/server';
import { emergencyResetTokenCache, getTokenCacheStats } from '@/src/lib/service-only';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

/**
 * Emergency cache clearing endpoint
 * Clears server-side token cache and cookies to prevent stuck authentication states
 *
 * Response includes cache statistics for debugging stuck state issues
 */
export async function POST() {
  const failedPhases: string[] = [];

  try {
    console.log('[API:ClearCache] Emergency cache clear requested');

    // Phase 1: Get cache stats before clearing
    let statsBefore: any = null;
    try {
      statsBefore = getTokenCacheStats();
      console.log('[API:ClearCache] Phase 1: Cache stats retrieved:', statsBefore);
    } catch (error) {
      console.warn('[API:ClearCache] Phase 1 warning: Could not retrieve cache stats:', error);
      failedPhases.push('stats-before');
    }

    // Phase 2: Emergency reset for complete cleanup
    try {
      emergencyResetTokenCache();
      console.log('[API:ClearCache] Phase 2: Token cache reset complete');
    } catch (error) {
      console.error('[API:ClearCache] Phase 2 failed: Token cache reset failed:', error);
      failedPhases.push('cache-reset');
    }

    // Phase 3: Prepare response with cache stats
    try {
      const statsAfter = getTokenCacheStats();

      const response = NextResponse.json(
        {
          success: failedPhases.length === 0,
          message: failedPhases.length === 0
            ? 'Cache cleared successfully'
            : `Cache cleared with warnings (${failedPhases.join(', ')} had issues)`,
          statsBefore,
          statsAfter,
          ...(failedPhases.length > 0 && { phasesFailed: failedPhases.join(', ') }),
        },
        { status: 200 },
      );

      // Clear all auth-related cookies
      try {
        response.cookies.delete(COOKIE_AUTH_NAME);

        // Explicitly set cookies to expire immediately
        response.cookies.set(COOKIE_AUTH_NAME, '', {
          maxAge: 0,
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        console.log('[API:ClearCache] Phase 3: Cookies cleared');
      } catch (cookieError) {
        console.warn('[API:ClearCache] Phase 3 warning: Cookie clearing failed:', cookieError);
        failedPhases.push('cookie-clear');
      }

      console.log('[API:ClearCache] Cache clear completed', {
        success: failedPhases.length === 0,
        failedPhases: failedPhases.length > 0 ? failedPhases.join(', ') : 'none',
      });

      return response;
    } catch (error) {
      console.error('[API:ClearCache] Phase 3 failed: Response preparation failed:', error);
      failedPhases.push('response-prepare');
      throw error;
    }
  } catch (error) {
    console.error('[API:ClearCache] Cache clear encountered errors:', {
      error: error instanceof Error ? error.message : String(error),
      failedPhases: failedPhases.join(', '),
    });

    // Return error response with failed phases
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
        message: error instanceof Error ? error.message : 'Unknown error',
        phasesFailed: failedPhases.join(', '),
      },
      { status: 500 },
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
