import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: any;
  },
) {
  try {
    const { api_user_id, cert_id } = await params;

    if (!api_user_id || !cert_id) {
      return NextResponse.json(
        { message: 'User ID or Certification ID is missing from the request path' },
        { status: 400 },
      );
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { numberOfQuestions, customPromptText } = body;

    if (!numberOfQuestions || numberOfQuestions < 1) {
      return NextResponse.json(
        { message: 'Number of questions is required and must be at least 1' },
        { status: 400 },
      );
    }

    // MARKED
    const CREATE_EXAM_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/certifications/${cert_id}/exams`;

    const response = await fetch(CREATE_EXAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({
        numberOfQuestions: parseInt(numberOfQuestions, 10),
        customPromptText: customPromptText || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to create exam for certification ${cert_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to create exam for certification ${cert_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error creating exam', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: any;
    // { api_user_id: string }
  },
) {
  try {
    const { api_user_id } = await params;

    if (!api_user_id) {
      return NextResponse.json(
        { message: 'User ID is missing from the request path' },
        { status: 400 },
      );
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const USER_EXAMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/exams`;

    const response = await fetch(USER_EXAMS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to fetch exams for user ${api_user_id}:`, response.status, errorData);
      return NextResponse.json(
        { message: `Failed to fetch exams for user ${api_user_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user exams:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error fetching user exams', error: errorMessage },
      { status: 500 },
    );
  }
}
