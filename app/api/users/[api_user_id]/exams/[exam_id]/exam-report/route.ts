import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      api_user_id: string;
      exam_id: string;
    }>;
  },
) {
  try {
    const { api_user_id, exam_id } = await params;

    if (!API_BASE_URL) {
      return NextResponse.json(
        { success: false, error: 'API base URL is not configured' },
        { status: 500 },
      );
    }

    if (!api_user_id || !exam_id) {
      return NextResponse.json(
        { success: false, error: 'User ID and Exam ID are required' },
        { status: 400 },
      );
    }

    // Get the Firebase token from the JWT wrapper cookie
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Forward the request to the backend API with RESTful structure
    const response = await fetch(
      `${API_BASE_URL}/api/users/${api_user_id}/exams/${exam_id}/exam-report`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
      },
    );

    // Read response as text first, then try to parse as JSON
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      // Handle non-JSON responses (like plain text error messages)
      return NextResponse.json(
        { success: false, error: responseText || 'Invalid response format from server' },
        { status: response.status },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to fetch exam report' },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching exam report:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      api_user_id: string;
      exam_id: string;
    }>;
  },
) {
  try {
    const { api_user_id, exam_id } = await params;
    const body = await request.json();

    if (!API_BASE_URL) {
      return NextResponse.json(
        { success: false, error: 'API base URL is not configured' },
        { status: 500 },
      );
    }

    if (!api_user_id || !exam_id) {
      return NextResponse.json(
        { success: false, error: 'User ID and Exam ID are required' },
        { status: 400 },
      );
    }

    // Get the Firebase token from the JWT wrapper cookie
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Forward the request to the backend API with RESTful structure
    const response = await fetch(
      `${API_BASE_URL}/api/users/${api_user_id}/exams/${exam_id}/exam-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    // Read response as text first, then try to parse as JSON
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      // Handle non-JSON responses (like plain text error messages)
      return NextResponse.json(
        { success: false, error: responseText || 'Invalid response format from server' },
        { status: response.status },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to generate exam report' },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating exam report:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
