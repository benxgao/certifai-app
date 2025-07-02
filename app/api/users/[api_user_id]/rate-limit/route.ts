import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ api_user_id: string }> },
) {
  try {
    const { api_user_id } = await params;

    // Forward the request to the backend API with the same path structure
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${api_user_id}/rate-limit`;

    // Get cookies from the incoming request to forward authentication
    const cookieHeader = request.headers.get('cookie');

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: 'Failed to fetch rate limit info',
      }));

      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to fetch rate limit info' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching rate limit info:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
