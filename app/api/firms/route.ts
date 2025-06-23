import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const FIRMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/firms`;

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
    const apiUrl = queryString ? `${FIRMS_API_URL}?${queryString}` : FIRMS_API_URL;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to fetch firms:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to fetch firms', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching firms:', error);

    return NextResponse.json(
      { message: 'Error fetching firms', error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid token' },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(FIRMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to create firm:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to create firm', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating firm:', error);

    return NextResponse.json(
      { message: 'Error creating firm', error: (error as Error).message },
      { status: 500 },
    );
  }
}
