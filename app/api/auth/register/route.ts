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
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required for user registration' },
        { status: 400 },
      );
    }

    // Get additional user data from request body
    const body = await request.json();
    const { firstName, lastName } = body;

    // Try to create user in external API first
    let apiUserId = null;

    if (process.env.NEXT_PUBLIC_SERVER_API_URL) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({
              firebase_user_id: uid,
              email,
              first_name: firstName,
              last_name: lastName,
            }),
          },
        );

        if (response.ok) {
          const result = await response.json();
          apiUserId = result.user_id || result.api_user_id || result.id;
          console.log('Successfully registered user in external API:', apiUserId);
        } else {
          console.warn(
            'Failed to register user in external API:',
            response.status,
            response.statusText,
          );
        }
      } catch (apiError) {
        console.error('Error calling external API for user registration:', apiError);
      }
    }

    // If external API failed or isn't configured, generate a fallback ID
    if (!apiUserId) {
      // Generate a fallback user ID based on Firebase UID
      apiUserId = `fb_${uid}`;
      console.log('Using fallback api_user_id:', apiUserId);
    }

    // Set custom claims with the api_user_id
    await auth.setCustomUserClaims(uid, {
      api_user_id: apiUserId,
    });

    console.log('Successfully set custom claims for user:', uid, 'with api_user_id:', apiUserId);

    return NextResponse.json(
      {
        message: 'User registered successfully',
        uid,
        api_user_id: apiUserId,
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
