import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';
import { getApiUserIdFromToken } from '@/src/lib/auth-claims-server';

type RouteParams = Promise<{ api_user_id: string; cert_id: string }>;

async function resolveUserId(api_user_id: string, firebaseToken: string): Promise<string> {
  // Check if api_user_id is a Firebase UID and convert to API user ID if needed
  if (api_user_id.length === 28 && /^[a-zA-Z0-9]+$/.test(api_user_id)) {
    console.log('Detected Firebase UID in URL, attempting to get API User ID from token');
    try {
      const apiUserIdFromToken = await getApiUserIdFromToken(firebaseToken);
      if (apiUserIdFromToken) {
        console.log('Successfully converted Firebase UID to API User ID:', apiUserIdFromToken);
        return apiUserIdFromToken;
      }
      console.warn('Could not get API User ID from token, proceeding with original ID');
    } catch (error) {
      console.warn('Error getting API User ID from token:', error);
    }
  }
  return api_user_id;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { api_user_id, cert_id } = await params;

    if (!api_user_id || !cert_id) {
      return NextResponse.json(
        { message: 'User ID or Certification ID is missing from the request path' },
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

    const actualApiUserId = await resolveUserId(api_user_id, firebaseToken);

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${actualApiUserId}/certifications/${cert_id}/knowledge-pooling`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to fetch knowledge pooling for user ${api_user_id} and cert ${cert_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: 'Failed to fetch knowledge pooling', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching knowledge pooling:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Error fetching knowledge pooling', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    const { api_user_id, cert_id } = await params;

    if (!api_user_id || !cert_id) {
      return NextResponse.json(
        { message: 'User ID or Certification ID is missing from the request path' },
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

    const actualApiUserId = await resolveUserId(api_user_id, firebaseToken);

    const body = await request.json();

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${actualApiUserId}/certifications/${cert_id}/knowledge-pooling`;

    const response = await fetch(targetUrl, {
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
        `Failed to generate knowledge pooling for user ${api_user_id} and cert ${cert_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: 'Failed to generate knowledge pooling', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error generating knowledge pooling:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Error generating knowledge pooling', error: errorMessage },
      { status: 500 },
    );
  }
}
