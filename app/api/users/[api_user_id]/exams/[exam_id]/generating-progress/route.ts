import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ api_user_id: string; exam_id: string }> },
) {
  try {
    const { api_user_id, exam_id } = await params;

    // Get Firebase token from cookie instead of authorization header
    const firebaseToken = await getFirebaseTokenFromCookie();
    if (!firebaseToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    // Get API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: 'API URL not configured' },
        { status: 500 },
      );
    }

    // Call the backend API
    const response = await fetch(
      `${apiUrl}/api/users/${api_user_id}/exams/${exam_id}/generating-progress`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching exam generating progress:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch exam generating progress',
      },
      { status: 500 },
    );
  }
}
