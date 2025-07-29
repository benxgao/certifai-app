import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const examId = searchParams.get('exam_id');

    if (!examId) {
      return NextResponse.json({ success: false, error: 'Exam ID is required' }, { status: 400 });
    }

    // Get the auth token from the cookie or authorization header
    const authCookie = request.cookies.get('auth-token');
    const authHeader = request.headers.get('authorization');

    if (!authCookie?.value && !authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const token = authCookie?.value || authHeader?.replace('Bearer ', '');

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/ai/exam-report?exam_id=${examId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exam_id } = body;

    if (!exam_id) {
      return NextResponse.json({ success: false, error: 'Exam ID is required' }, { status: 400 });
    }

    // Get the auth token from the cookie or authorization header
    const authCookie = request.cookies.get('auth-token');
    const authHeader = request.headers.get('authorization');

    if (!authCookie?.value && !authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const token = authCookie?.value || authHeader?.replace('Bearer ', '');

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/ai/exam-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ exam_id }),
    });

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
