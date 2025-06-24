import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerAuthStateWithRefresh, createJWTWrapper } from '@/src/lib/server-auth-strategy';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

/**
 * Enhanced server-side authentication refresh endpoint
 * This reduces client-side Firebase token requests by handling JWT wrapper refresh server-side
 * when possible, and gracefully falling back to client-side refresh when needed
 */
export async function POST() {
  try {
    const authState = await getServerAuthStateWithRefresh();

    if (!authState.isAuthenticated && !authState.needsRefresh) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'No valid authentication found',
          requiresReauth: true,
        },
        { status: 401 },
      );
    }

    if (authState.isAuthenticated && !authState.needsRefresh) {
      // Already authenticated, no refresh needed
      return NextResponse.json({
        success: true,
        message: 'Authentication still valid',
        userId: authState.userId,
      });
    }

    // Check if we can refresh the JWT wrapper (Firebase token still valid)
    if (authState.isAuthenticated && authState.needsRefresh && !authState.needsClientRefresh) {
      const cookieStore = await cookies();

      // Extract the current Firebase token and create a new JWT wrapper
      const currentJoseToken = cookieStore.get(COOKIE_AUTH_NAME)?.value;
      if (currentJoseToken) {
        try {
          // Decode the JWT to extract the Firebase token
          const parts = currentJoseToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const firebaseToken = payload.token;

            if (firebaseToken) {
              // Create new JWT wrapper with the same Firebase token
              const newJoseToken = await createJWTWrapper(firebaseToken);

              if (newJoseToken) {
                cookieStore.set(COOKIE_AUTH_NAME, newJoseToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'strict',
                  path: '/',
                  maxAge: 60 * 60, // 1 hour
                });

                return NextResponse.json({
                  success: true,
                  message: 'JWT wrapper refreshed successfully (server-side)',
                  userId: authState.userId,
                });
              }
            }
          }
        } catch (decodeError) {
          console.error('Failed to decode JWT for wrapper refresh:', decodeError);
        }
      }
    }

    // If we reach here, we need client-side refresh
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_AUTH_NAME);

    return NextResponse.json(
      {
        success: false,
        error: 'CLIENT_REFRESH_REQUIRED',
        message: 'Firebase token refresh required, please sign in again',
        requiresReauth: true,
      },
      { status: 401 },
    );
  } catch (error) {
    console.error('Enhanced auth refresh failed:', error);

    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_AUTH_NAME);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Authentication refresh failed',
        requiresReauth: true,
      },
      { status: 500 },
    );
  }
}
