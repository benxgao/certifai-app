import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';
import { getApiUserIdFromToken } from '@/src/lib/auth-claims-server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ api_user_id: string; cert_id: string }>;
  },
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

    // Check if api_user_id is actually a Firebase UID and convert if needed
    let actualApiUserId = api_user_id;

    if (api_user_id.length === 28 && /^[a-zA-Z0-9]+$/.test(api_user_id)) {
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
      }
    }

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${actualApiUserId}/certifications/${cert_id}/cert-summary`;

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
        `Failed to fetch cert summary for user ${api_user_id} and cert ${cert_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to fetch cert summary`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching cert summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error fetching cert summary', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ api_user_id: string; cert_id: string }>;
  },
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

    // Check if api_user_id is actually a Firebase UID and convert if needed
    let actualApiUserId = api_user_id;

    if (api_user_id.length === 28 && /^[a-zA-Z0-9]+$/.test(api_user_id)) {
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
      }
    }

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${actualApiUserId}/certifications/${cert_id}/cert-summary`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to generate cert summary for user ${api_user_id} and cert ${cert_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to generate cert summary`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error generating cert summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error generating cert summary', error: errorMessage },
      { status: 500 },
    );
  }
}
