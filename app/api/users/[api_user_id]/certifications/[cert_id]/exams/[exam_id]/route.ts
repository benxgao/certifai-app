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
    const { api_user_id, cert_id, exam_id } = await params;

    if (!api_user_id || !cert_id || !exam_id) {
      return NextResponse.json(
        { message: 'User ID, Certification ID, or Exam ID is missing from the request path' },
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

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/exams/${exam_id}`;

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
        `Failed to fetch exam state for user ${api_user_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to fetch exam state`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching exam state:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error fetching exam state', error: errorMessage },
      { status: 500 },
    );
  }
}
