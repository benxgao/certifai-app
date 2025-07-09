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

    // Get the api_user_id and init_cert_id from request body
    const body = await request.json();
    const { api_user_id, init_cert_id } = body;

    if (!api_user_id) {
      return NextResponse.json({ message: 'api_user_id is required' }, { status: 400 });
    }

    // Build custom claims object
    const customClaims: any = {
      api_user_id: api_user_id,
    };

    // Add init_cert_id if provided
    if (init_cert_id) {
      customClaims.init_cert_id = init_cert_id;
    }

    // Set custom claims with the api_user_id and optionally init_cert_id
    await auth.setCustomUserClaims(uid, customClaims);

    return NextResponse.json(
      {
        message: 'Custom claims set successfully',
        uid,
        api_user_id,
        init_cert_id: init_cert_id || null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error setting custom claims:', error);

    return NextResponse.json(
      {
        message: 'Error setting custom claims',
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
