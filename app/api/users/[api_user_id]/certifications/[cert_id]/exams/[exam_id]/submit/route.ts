import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ api_user_id: string; cert_id: string; exam_id: string }>;
  },
) {
  try {
    const body = await request.json();

    const { api_user_id, cert_id, exam_id } = await params;

    const firebaseToken = await getFirebaseTokenFromCookie();
    if (!firebaseToken) {
      return NextResponse.json(
        { message: 'Authentication failed: Invalid or missing token' },
        { status: 401 },
      );
    }

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/certifications/${cert_id}/exams/${exam_id}/submit`;

    const apiResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(body || {}),
    });

    let responseData;

    try {
      responseData = await apiResponse.json();
    } catch (e: unknown) {
      const parseError = e instanceof Error ? e.message : String(e);
      responseData = {
        error: `Received non-JSON response from target API: ${parseError}: ${apiResponse.statusText}`,
      };
      if (apiResponse.status === 204) {
        return new NextResponse(null, { status: 204 });
      }
    }

    return NextResponse.json(responseData, { status: apiResponse.status });
  } catch (error: unknown) {
    console.error('Error submitting exam:', error);
    let errorMessage = 'Internal Server Error';
    const details = error instanceof Error ? error.message : String(error);
    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON in request body';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage, details }, { status: 500 });
  }
}
