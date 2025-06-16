import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const CERTIFICATIONS_REGISTER_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/certifications`;

export async function POST(request: NextRequest) {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid token' },
        { status: 401 },
      );
    }

    const { certificationId } = await request.json();

    if (!certificationId) {
      return NextResponse.json({ message: 'Certification ID is required' }, { status: 400 });
    }

    const response = await fetch(CERTIFICATIONS_REGISTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({ certificationId }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error('Failed to register for certification:', response.status, errorData);

      return NextResponse.json(
        { message: 'Failed to register for certification', error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error registering for certification:', error);

    return NextResponse.json(
      { message: 'Error registering for certification', error: (error as Error).message },
      { status: 500 },
    );
  }
}
