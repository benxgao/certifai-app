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

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const USER_PROFILE_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/profile`;

    const response = await fetch(USER_PROFILE_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to fetch profile for user ${api_user_id}:`, response.status, errorData);
      return NextResponse.json(
        { message: `Failed to fetch profile for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const profileData = await response.json();
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error in GET /api/users/[api_user_id]/profile:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(
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

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const USER_PROFILE_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/profile`;

    const response = await fetch(USER_PROFILE_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to update profile for user ${api_user_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to update profile for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const profileData = await response.json();
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error in PUT /api/users/[api_user_id]/profile:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 },
    );
  }
}
