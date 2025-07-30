import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';
import { getApiUserIdFromToken } from '@/src/lib/auth-claims-server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: any;
  },
) {
  try {
    const { api_user_id } = await params;

    if (!api_user_id) {
      return NextResponse.json(
        { message: 'User ID is missing from the request path' },
        { status: 400 },
      );
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    // Check if api_user_id is actually a Firebase UID (28 characters, alphanumeric)
    // Firebase UIDs are 28 characters, API User IDs are UUIDs (36 characters with hyphens)
    let actualApiUserId = api_user_id;

    if (api_user_id.length === 28 && /^[a-zA-Z0-9]+$/.test(api_user_id)) {
      // This looks like a Firebase UID, try to get the API User ID from custom claims
      console.log('Detected Firebase UID in URL, attempting to get API User ID from token');

      try {
        const apiUserIdFromToken = await getApiUserIdFromToken(firebaseToken);
        if (apiUserIdFromToken) {
          actualApiUserId = apiUserIdFromToken;
          console.log('Successfully converted Firebase UID to API User ID:', actualApiUserId);
        } else {
          console.warn('Could not get API User ID from token, proceeding with original ID');
        }
      } catch (error) {
        console.warn('Error getting API User ID from token:', error);
        // Continue with original ID - backend will handle Firebase UID lookup
      }
    }

    // Get query parameters from the original request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // Call the certifai-api to get all exams for the user
    const USER_EXAMS_API_URL = `${
      process.env.NEXT_PUBLIC_SERVER_API_URL
    }/api/users/${actualApiUserId}/exams${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(USER_EXAMS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to fetch exams for user ${api_user_id}:`, response.status, errorData);
      return NextResponse.json(
        { message: `Failed to fetch exams for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user exams:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error fetching user exams', error: errorMessage },
      { status: 500 },
    );
  }
}
