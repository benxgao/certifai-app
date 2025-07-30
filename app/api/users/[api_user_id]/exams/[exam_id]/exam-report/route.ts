import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

interface RouteParams {
  params: {
    api_user_id: string;
    exam_id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { api_user_id, exam_id } = params;

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

    // Get the auth token from the cookie or authorization header
    const authCookie = request.cookies.get(COOKIE_AUTH_NAME);
    const authHeader = request.headers.get('authorization');

    if (!authCookie?.value && !authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const token = authCookie?.value || authHeader?.replace('Bearer ', '');

    // Forward the request to the backend API with RESTful structure
    const response = await fetch(
      `${API_BASE_URL}/api/users/${api_user_id}/exams/${exam_id}/exam-report`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

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

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { api_user_id, exam_id } = params;
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

    // Get the auth token from the cookie or authorization header
    const authCookie = request.cookies.get(COOKIE_AUTH_NAME);
    const authHeader = request.headers.get('authorization');

    if (!authCookie?.value && !authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const token = authCookie?.value || authHeader?.replace('Bearer ', '');

    // Forward the request to the backend API with RESTful structure
    const response = await fetch(
      `${API_BASE_URL}/api/users/${api_user_id}/exams/${exam_id}/exam-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

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
