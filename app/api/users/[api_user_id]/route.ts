import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function DELETE(
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
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const TARGET_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}`;

    const response = await fetch(TARGET_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to delete user ${api_user_id}:`, response.status, errorData);
      return NextResponse.json(
        { message: `Failed to delete user account`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error deleting user account', error: errorMessage },
      { status: 500 },
    );
  }
}
