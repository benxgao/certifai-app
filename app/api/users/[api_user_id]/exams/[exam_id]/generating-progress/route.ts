import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ api_user_id: string; exam_id: string }> },
) {
  try {
    const { api_user_id, exam_id } = await params;

    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
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
          Authorization: authHeader,
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
