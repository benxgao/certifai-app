import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

export async function PUT(
  request: NextRequest,
  { params }: { params: { api_user_id: string; cert_id: string; exam_id: string } },
) {
  try {
    const { api_user_id, exam_id } = params; // cert_id is available from the path but not used in the target URL

    const body = await request.json();
    const { quiz_question_id, answer_option_id } = body;

    if (!api_user_id || !exam_id) {
      return NextResponse.json(
        { message: 'User ID or Exam ID is missing from the request path' },
        { status: 400 },
      );
    }

    if (!quiz_question_id || answer_option_id === undefined) {
      // Check for undefined as answer_option_id could be null or other falsy values
      return NextResponse.json(
        { message: 'quiz_question_id or answer_option_id is missing from the request body' },
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

    const TARGET_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${api_user_id}/exams/${exam_id}/questions/${quiz_question_id}`;

    const response = await fetch(TARGET_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({ answer_option_id }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Failed to update question ${quiz_question_id} for user ${api_user_id}:`,
        response.status,
        errorData,
      );
      return NextResponse.json(
        { message: `Failed to update question ${quiz_question_id}`, error: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating question:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { message: 'Error updating question', error: errorMessage },
      { status: 500 },
    );
  }
}
