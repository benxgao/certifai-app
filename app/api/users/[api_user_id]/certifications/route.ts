import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ api_user_id: string }>;
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

    // Get cert_id from query string if present
    const { searchParams } = new URL(request.url);
    const cert_id = searchParams.get('cert_id');

    const firebaseToken = await getFirebaseTokenFromCookie();
    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    let USER_CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/certifications`;
    if (cert_id) {
      USER_CERTIFICATIONS_API_URL += `?cert_id=${encodeURIComponent(cert_id)}`;
    }

    const response = await fetch(USER_CERTIFICATIONS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to fetch certifications for user ${api_user_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to fetch certifications for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user certifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error fetching user certifications', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ api_user_id: string }> },
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

    const body = await request.json();
    const USER_CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/certifications`;

    const response = await fetch(USER_CERTIFICATIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to register certification for user ${api_user_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to register certification for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error registering user certification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Error registering user certification', error: errorMessage },
      { status: 500 },
    );
  }
}
