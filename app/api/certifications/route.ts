import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getInternalApiToken } from '@/src/lib/service-only';

const CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/certifications`;

export async function GET() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    const firebaseToken = getInternalApiToken(authorization);

    const response = await fetch(CERTIFICATIONS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to fetch certifications:', response.status, errorData);
      return NextResponse.json(
        { message: 'Failed to fetch certifications', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { message: 'Error fetching certifications', error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    const firebaseToken = getInternalApiToken(authorization);

    const body = await request.json();
    const response = await fetch(CERTIFICATIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to create certification:', response.status, errorData);
      return NextResponse.json(
        { message: 'Failed to create certification', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { message: 'Error creating certification', error: (error as Error).message },
      { status: 500 },
    );
  }
}
