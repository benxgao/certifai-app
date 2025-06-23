import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const FIRMS_SEARCH_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/firms/search`;

export async function GET(request: NextRequest) {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid token' },
        { status: 401 },
      );
    }

    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = queryString ? `${FIRMS_SEARCH_API_URL}?${queryString}` : FIRMS_SEARCH_API_URL;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to search firms:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to search firms', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error searching firms:', error);

    return NextResponse.json(
      { message: 'Error searching firms', error: (error as Error).message },
      { status: 500 },
    );
  }
}
