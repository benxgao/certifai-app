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
        { message: 'Email is required for user registration' },
        { status: 400 },
      );
    }

    // Get additional user data from request body
    const body = await request.json();
    const { firstName, lastName, initCertId } = body;

    // Try to create user in external API first with better error handling
    // This will return our internal api_user_id if successful
    let apiUserId = null;

    if (process.env.NEXT_PUBLIC_SERVER_API_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({
              firebase_user_id: firebaseUserId, // Send Firebase UID to backend
              email,
              first_name: firstName,
              last_name: lastName,
            }),
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const result = await response.json();
          apiUserId = result.user_id || result.api_user_id || result.id;
          console.log('Successfully registered user in external API:', apiUserId);
        } else {
          // Try to get error details from response
          let errorDetails = 'Unknown error';
          try {
            const errorData = await response.json();
            errorDetails = errorData.error || errorData.message || `Status: ${response.status}`;
          } catch {
            errorDetails = `HTTP ${response.status}: ${response.statusText}`;
          }

          console.warn('Failed to register user in external API:', errorDetails);
        }
      } catch (apiError: any) {
        // Handle specific errors with better logging
        if (apiError.name === 'AbortError') {
          console.error('External API registration timed out after 12 seconds');
        } else if (apiError.message?.includes('ECONNREFUSED')) {
          console.error('External API connection refused - API server may be down');
        } else if (apiError.message?.includes('ENOTFOUND')) {
          console.error('External API host not found - check API URL configuration');
        } else {
          console.error(
            'Error calling external API for user registration:',
            apiError.message || apiError,
          );
        }
      }
    } else {
      console.warn('NEXT_PUBLIC_SERVER_API_URL not configured, skipping external API registration');
    }

    // If external API failed or isn't configured, generate a fallback ID
    // This fallback is still an api_user_id, but based on Firebase UID
    if (!apiUserId) {
      // Generate a fallback api_user_id based on Firebase UID
      apiUserId = `fb_${firebaseUserId}`;
      console.log('Using fallback api_user_id:', apiUserId);
    }

    // Set custom claims with the api_user_id and init_cert_id
    const customClaims: any = {
      api_user_id: apiUserId, // Our internal UUID for API operations
    };

    // Add init_cert_id to custom claims if provided
    if (initCertId) {
      customClaims.init_cert_id = initCertId;
    }

    await auth.setCustomUserClaims(firebaseUserId, customClaims);

    console.log(
      'Successfully set custom claims for Firebase UID:',
      firebaseUserId,
      'with api_user_id:',
      apiUserId,
      'and init_cert_id:',
      initCertId || 'none',
    );

    return NextResponse.json(
      {
        message: 'User registered successfully',
        firebase_user_id: firebaseUserId, // Firebase UID for reference
        api_user_id: apiUserId, // Our internal UUID for API operations
        init_cert_id: initCertId || null,
        // Deprecated: keeping for backward compatibility only
        uid: firebaseUserId, // @deprecated Use firebase_user_id instead
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error during user registration:', error);

    return NextResponse.json(
      {
        message: 'Error during user registration',
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
