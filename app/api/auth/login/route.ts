import { NextRequest, NextResponse } from 'next/server';
import { getAdminSDK } from '@/src/firebase/firebaseAdminConfig';

export async function POST(request: NextRequest) {
  try {
    // Get the Firebase token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid authorization header' },
        { status: 401 },
      );
    }

    const firebaseToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    const { auth } = getAdminSDK();

    // Verify the token and get user info
    const decodedToken = await auth.verifyIdToken(firebaseToken);
    const firebaseUserId = decodedToken.uid; // Firebase UID (not our api_user_id)
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required for authentication' },
        { status: 400 },
      );
    }

    // Check if user already has api_user_id in custom claims
    let apiUserId = decodedToken.api_user_id as string | undefined;

    // If api_user_id starts with 'fb_', it's a fallback ID that needs to be fixed
    const needsApiUserIdFix = apiUserId && apiUserId.startsWith('fb_');

    // If no api_user_id in claims, or if it's a fallback ID, try to get the correct one from external API
    if (!apiUserId || needsApiUserIdFix) {
      if (needsApiUserIdFix) {
        console.log(
          'Detected fallback api_user_id, attempting to get correct ID from backend:',
          apiUserId,
        );
      }

      // Try to authenticate with external API first
      if (process.env.NEXT_PUBLIC_SERVER_API_URL) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({
              firebase_user_id: firebaseUserId, // Send Firebase UID to backend
              email,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log('External API response:', result);
            apiUserId = result.api_user_id || result.user_id || result.id;
            console.log('Successfully authenticated with external API:', apiUserId);

            if (!apiUserId) {
              console.warn('External API response missing api_user_id field:', result);
            }
          } else {
            const errorText = await response.text();
            console.warn(
              'Failed to authenticate with external API:',
              response.status,
              response.statusText,
              errorText,
            );
          }
        } catch (apiError) {
          console.error('Error calling external API for authentication:', apiError);
        }
      }

      // If external API failed or isn't configured, try to fall back to valid custom claims only
      if (!apiUserId) {
        console.log('External API failed, attempting to use valid custom claims as fallback');

        // Get the original api_user_id from custom claims, but reject fb_ prefixed ones
        const fallbackApiUserId = decodedToken.api_user_id as string | undefined;

        if (fallbackApiUserId) {
          if (fallbackApiUserId.startsWith('fb_')) {
            console.warn(
              'Rejecting fb_ prefixed api_user_id, user needs proper authentication:',
              fallbackApiUserId,
            );
            // Don't use fb_ prefixed IDs as they are invalid
          } else {
            apiUserId = fallbackApiUserId;
            console.log(
              'Using valid api_user_id from custom claims as fallback:',
              fallbackApiUserId,
            );
          }
        }
      }

      // If we still don't have an api_user_id after all attempts, return error
      if (!apiUserId) {
        console.error(
          'Authentication failed: Unable to get valid api_user_id from backend API or custom claims',
        );
        return NextResponse.json(
          {
            message:
              'Authentication service temporarily unavailable. Please contact support to resolve your account.',
            error: 'Unable to authenticate with valid credentials',
          },
          { status: 503 }, // Service Unavailable
        );
      }

      // If we successfully got a new api_user_id from API (not fallback), update claims
      const usingFallbackFromClaims = !needsApiUserIdFix && decodedToken.api_user_id === apiUserId;

      if ((needsApiUserIdFix || !decodedToken.api_user_id) && !usingFallbackFromClaims) {
        // Set custom claims with the api_user_id for future use
        try {
          const customClaims: any = {
            api_user_id: apiUserId, // Our internal UUID for API operations
          };

          // Preserve existing init_cert_id if it exists
          const existingRecord = await auth.getUser(firebaseUserId);
          if (existingRecord.customClaims?.init_cert_id) {
            customClaims.init_cert_id = existingRecord.customClaims.init_cert_id;
          }

          await auth.setCustomUserClaims(firebaseUserId, customClaims);

          if (needsApiUserIdFix) {
            console.log(
              'Successfully fixed fallback api_user_id for Firebase UID:',
              firebaseUserId,
              'new api_user_id:',
              apiUserId,
            );
          } else {
            console.log(
              'Successfully set custom claims for Firebase UID:',
              firebaseUserId,
              'with api_user_id:',
              apiUserId,
            );
          }
        } catch (claimsError) {
          console.error('Failed to set custom claims:', claimsError);
          // Continue anyway since we have the api_user_id
        }
      } else if (usingFallbackFromClaims) {
        console.log('Using existing api_user_id from custom claims (fallback mode):', apiUserId);
      } else {
        console.log('Found existing valid api_user_id in custom claims:', apiUserId);
      }
    }

    return NextResponse.json(
      {
        message: 'Authentication successful',
        firebase_user_id: firebaseUserId, // Firebase UID for reference
        api_user_id: apiUserId, // Our internal UUID for API operations
        email,
        // Deprecated: keeping for backward compatibility only
        uid: firebaseUserId, // @deprecated Use firebase_user_id instead
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error during authentication:', error);

    // Handle specific Firebase Auth errors
    if (error instanceof Error) {
      if (error.message.includes('Firebase ID token has expired')) {
        return NextResponse.json(
          { message: 'Token expired. Please refresh your session.' },
          { status: 401 },
        );
      }

      if (error.message.includes('Firebase ID token has invalid signature')) {
        return NextResponse.json(
          { message: 'Invalid token signature. Please sign in again.' },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Error during authentication',
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
