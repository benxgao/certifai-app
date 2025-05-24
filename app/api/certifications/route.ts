import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { getInternalApiToken } from '@/src/lib/service-only';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

const CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/certifications`;
const secretKey = process.env.JOSE_JWT_SECRET;

export async function GET() {
  try {
    const cookieToken = (await cookies()).get(COOKIE_AUTH_NAME)?.value;

    // payload = {token, iat, exp}
    const { payload } = await jwtVerify(cookieToken as string, new TextEncoder().encode(secretKey));
    const firebaseToken = payload.token;

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
