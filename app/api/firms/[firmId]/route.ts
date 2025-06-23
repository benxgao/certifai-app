import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const FIRMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/firms`;

export async function GET(request: NextRequest, { params }: { params: { firmId: string } }) {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid token' },
        { status: 401 },
      );
    }

    const { firmId } = params;

    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = queryString
      ? `${FIRMS_API_URL}/${firmId}?${queryString}`
      : `${FIRMS_API_URL}/${firmId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to fetch firm:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to fetch firm', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching firm:', error);

    return NextResponse.json(
      { message: 'Error fetching firm', error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { firmId: string } }) {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid token' },
        { status: 401 },
      );
    }

    const { firmId } = params;
    const body = await request.json();

    const response = await fetch(`${FIRMS_API_URL}/${firmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to update firm:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to update firm', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating firm:', error);

    return NextResponse.json(
      { message: 'Error updating firm', error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { firmId: string } }) {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid token' },
        { status: 401 },
      );
    }

    const { firmId } = params;

    const response = await fetch(`${FIRMS_API_URL}/${firmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to delete firm:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to delete firm', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error deleting firm:', error);

    return NextResponse.json(
      { message: 'Error deleting firm', error: (error as Error).message },
      { status: 500 },
    );
  }
}
