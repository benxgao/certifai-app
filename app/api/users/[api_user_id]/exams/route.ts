import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

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

    // Call the certifai-api to get all exams for the user
    const USER_EXAMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/exams`;

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

    console.log(`get_user_exams: ${JSON.stringify(data)}`);

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
