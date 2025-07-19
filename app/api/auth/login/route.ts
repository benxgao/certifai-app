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

    // If no api_user_id in claims, try to get it from external API or generate fallback
    if (!apiUserId) {
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
            apiUserId = result.user_id || result.api_user_id || result.id;
            console.log('Successfully authenticated with external API:', apiUserId);
          } else {
            console.warn(
              'Failed to authenticate with external API:',
              response.status,
              response.statusText,
            );
          }
        } catch (apiError) {
          console.error('Error calling external API for authentication:', apiError);
        }
      }

      // If external API failed or isn't configured, generate a fallback ID
      if (!apiUserId) {
        // Generate a fallback api_user_id based on Firebase UID
        apiUserId = `fb_${firebaseUserId}`;
        console.log('Using fallback api_user_id:', apiUserId);
      }

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
        console.log(
          'Successfully set custom claims for Firebase UID:',
          firebaseUserId,
          'with api_user_id:',
          apiUserId,
        );
      } catch (claimsError) {
        console.error('Failed to set custom claims:', claimsError);
        // Continue anyway since we have the api_user_id
      }
    } else {
      console.log('Found existing api_user_id in custom claims:', apiUserId);
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
