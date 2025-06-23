import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const CERTIFICATIONS_BY_FIRM_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/firms`;

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
      ? `${CERTIFICATIONS_BY_FIRM_API_URL}/${firmId}/certifications?${queryString}`
      : `${CERTIFICATIONS_BY_FIRM_API_URL}/${firmId}/certifications`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();

      console.error('Failed to fetch certifications by firm:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to fetch certifications by firm', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching certifications by firm:', error);

    return NextResponse.json(
      { message: 'Error fetching certifications by firm', error: (error as Error).message },
      { status: 500 },
    );
  }
}
