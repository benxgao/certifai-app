import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

type CanonicalErrorEnvelope = {
  success: false;
  error: string;
  error_code: string;
  retriable: boolean;
  details?: unknown;
};

function buildErrorEnvelope(
  error: string,
  errorCode: string,
  retriable: boolean,
  details?: unknown,
): CanonicalErrorEnvelope {
  return {
    success: false,
    error,
    error_code: errorCode,
    retriable,
    ...(details === undefined ? {} : { details }),
  };
}

function parseUpstreamErrorBody(bodyText: string): Partial<CanonicalErrorEnvelope> {
  try {
    const parsed = JSON.parse(bodyText) as Partial<CanonicalErrorEnvelope> & {
      message?: string;
    };
    return {
      error: parsed.error ?? parsed.message,
      error_code: parsed.error_code,
      retriable: parsed.retriable,
      details: parsed.details,
    };
  } catch {
    return {
      error: bodyText || undefined,
    };
  }
}

function normalizeUpstreamError(status: number, bodyText: string, fallbackMessage: string) {
  const parsed = parseUpstreamErrorBody(bodyText);
  const isRetriableByStatus = status >= 500;
  const normalizedError = parsed.error || fallbackMessage;

  return {
    status,
    payload: buildErrorEnvelope(
      normalizedError,
      parsed.error_code || (isRetriableByStatus ? 'UPSTREAM_ERROR' : 'UPSTREAM_REQUEST_FAILED'),
      parsed.retriable ?? isRetriableByStatus,
      parsed.details,
    ),
  };
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      api_user_id: string;
      exam_id: string;
    }>;
  },
) {
  try {
    const { api_user_id, exam_id } = await params;

    if (!API_BASE_URL) {
      return NextResponse.json(
        buildErrorEnvelope('API base URL is not configured', 'PROXY_CONFIG_ERROR', false),
        { status: 500 },
      );
    }

    if (!api_user_id || !exam_id) {
      return NextResponse.json(
        buildErrorEnvelope('User ID and Exam ID are required', 'BAD_REQUEST', false),
        { status: 400 },
      );
    }

    // Get the Firebase token from the JWT wrapper cookie
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        buildErrorEnvelope('Authentication required', 'UNAUTHENTICATED', false),
        { status: 401 },
      );
    }

    // Forward the request to the backend API with RESTful structure
    const response = await fetch(
      `${API_BASE_URL}/api/users/${api_user_id}/exams/${exam_id}/exam-report`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      const normalized = normalizeUpstreamError(
        response.status,
        responseText,
        'Failed to fetch exam report',
      );
      return NextResponse.json(normalized.payload, { status: normalized.status });
    }

    try {
      return NextResponse.json(JSON.parse(responseText));
    } catch {
      return NextResponse.json(
        buildErrorEnvelope(
          'Invalid response format from server',
          'PROXY_UPSTREAM_INVALID_RESPONSE',
          true,
        ),
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Error fetching exam report:', error);
    return NextResponse.json(
      buildErrorEnvelope('Internal server error', 'INTERNAL_SERVER_ERROR', true),
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      api_user_id: string;
      exam_id: string;
    }>;
  },
) {
  try {
    const { api_user_id, exam_id } = await params;
    const body = await request.json();

    if (!API_BASE_URL) {
      return NextResponse.json(
        buildErrorEnvelope('API base URL is not configured', 'PROXY_CONFIG_ERROR', false),
        { status: 500 },
      );
    }

    if (!api_user_id || !exam_id) {
      return NextResponse.json(
        buildErrorEnvelope('User ID and Exam ID are required', 'BAD_REQUEST', false),
        { status: 400 },
      );
    }

    // Get the Firebase token from the JWT wrapper cookie
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return NextResponse.json(
        buildErrorEnvelope('Authentication required', 'UNAUTHENTICATED', false),
        { status: 401 },
      );
    }

    // Forward the request to the backend API with RESTful structure
    const response = await fetch(
      `${API_BASE_URL}/api/users/${api_user_id}/exams/${exam_id}/exam-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      const normalized = normalizeUpstreamError(
        response.status,
        responseText,
        'Failed to generate exam report',
      );
      return NextResponse.json(normalized.payload, { status: normalized.status });
    }

    try {
      return NextResponse.json(JSON.parse(responseText));
    } catch {
      return NextResponse.json(
        buildErrorEnvelope(
          'Invalid response format from server',
          'PROXY_UPSTREAM_INVALID_RESPONSE',
          true,
        ),
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Error generating exam report:', error);
    return NextResponse.json(
      buildErrorEnvelope('Internal server error', 'INTERNAL_SERVER_ERROR', true),
      { status: 500 },
    );
  }
}
