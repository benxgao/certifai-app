import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';
import { emergencyResetTokenCache } from '@/src/lib/service-only';

/**
 * Comprehensive logout endpoint that clears all authentication state
 * This endpoint ensures complete cleanup of server-side state with detailed error tracking
 *
 * Response includes:
 * - success: boolean indicating if logout succeeded
 * - message: human-readable message
 * - phasesFailed: (if error) which phases failed (format "phase1, phase2")
 */
export async function POST() {
  const failedPhases: string[] = [];

  try {
    console.log('[API:Logout] Comprehensive logout requested');

    // Phase 1: Clear auth cookie
    try {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_AUTH_NAME);
      console.log('[API:Logout] Phase 1: Auth cookie cleared');
    } catch (error) {
      console.error('[API:Logout] Phase 1 failed: Cookie clear failed:', error);
      failedPhases.push('cookie-clear');
    }

    // Phase 2: Emergency reset of token cache
    try {
      emergencyResetTokenCache();
      console.log('[API:Logout] Phase 2: Token cache reset');
    } catch (error) {
      console.error('[API:Logout] Phase 2 failed: Token cache reset failed:', error);
      failedPhases.push('cache-reset');
    }

    // Phase 3: Create response with comprehensive cookie clearing
    try {
      // Create base response
      const response = NextResponse.json(
        {
          success: failedPhases.length === 0,
          message: failedPhases.length === 0
            ? 'Logout completed successfully'
            : `Logout completed with warnings (${failedPhases.join(', ')} had issues)`,
          ...(failedPhases.length > 0 && { phasesFailed: failedPhases.join(', ') }),
        },
        { status: 200 },
      );

      // Clear all possible authentication cookies
      const cookiesToClear = [COOKIE_AUTH_NAME, 'authToken', 'firebaseToken', 'apiUserId'];

      cookiesToClear.forEach((cookieName) => {
        try {
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
        } catch (cookieError) {
          console.warn(`[API:Logout] Failed to clear cookie ${cookieName}:`, cookieError);
          if (!failedPhases.includes('cookie-clearing')) {
            failedPhases.push('cookie-clearing');
          }
        }
      });

      // Add cache control headers to prevent caching of logout response
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      console.log('[API:Logout] Phase 3: Response prepared', {
        success: failedPhases.length === 0,
        failedPhases: failedPhases.length > 0 ? failedPhases.join(', ') : 'none',
      });

      return response;
    } catch (error) {
      console.error('[API:Logout] Phase 3 failed: Response preparation failed:', error);
      failedPhases.push('response-prepare');

      // Fall through to error handler
      throw error;
    }
  } catch (error) {
    console.error('[API:Logout] Logout encountered errors:', {
      error: error instanceof Error ? error.message : String(error),
      failedPhases: failedPhases.join(', '),
    });

    // Even if there's an error, return success to prevent stuck logout states
    // But include the failed phases for debugging
    const response = NextResponse.json(
      {
        success: false,
        message: 'Logout completed with errors',
        phasesFailed: failedPhases.join(', '),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }, // Still return 200 to ensure logout completes client-side
    );

    // Still try to clear cookies even on error
    try {
      response.cookies.delete(COOKIE_AUTH_NAME);
      response.cookies.set(COOKIE_AUTH_NAME, '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    } catch (cookieError) {
      console.error('[API:Logout] Failed to clear cookies in error handler:', cookieError);
    }

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
