import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ api_user_id: string }> },
) {
  try {
    const { api_user_id } = await params;

    // Forward the request to the backend API with the same path structure
    const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/rate-limit`;

    // Get Firebase token from the JWT cookie for authentication
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: 'Failed to fetch rate limit info',
      }));

      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to fetch rate limit info' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching rate limit info:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
