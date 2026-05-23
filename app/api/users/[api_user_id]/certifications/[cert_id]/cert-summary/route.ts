import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';
import { getApiUserIdFromToken } from '@/src/lib/auth-claims-server';

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

  return {
    status,
    payload: buildErrorEnvelope(
      parsed.error || fallbackMessage,
      parsed.error_code || (isRetriableByStatus ? 'UPSTREAM_ERROR' : 'UPSTREAM_REQUEST_FAILED'),
      parsed.retriable ?? isRetriableByStatus,
      parsed.details,
    ),
  };
}

function buildProxyPathError() {
  return NextResponse.json(
    buildErrorEnvelope('User ID or Certification ID is missing from the request path', 'BAD_REQUEST', false),
    { status: 400 },
  );
}

function buildProxyAuthError() {
  return NextResponse.json(
    buildErrorEnvelope('Authentication failed: Invalid or missing token', 'UNAUTHENTICATED', false),
    { status: 401 },
  );
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ api_user_id: string; cert_id: string }>;
  },
) {
  try {
    const { api_user_id, cert_id } = await params;

    if (!api_user_id || !cert_id) {
      return buildProxyPathError();
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return buildProxyAuthError();
    }

    // Check if api_user_id is actually a Firebase UID and convert if needed
    let actualApiUserId = api_user_id;

    if (api_user_id.length === 28 && /^[a-zA-Z0-9]+$/.test(api_user_id)) {
      console.log('Detected Firebase UID in URL, attempting to get API User ID from token');

      try {
        const apiUserIdFromToken = await getApiUserIdFromToken(firebaseToken);
        if (apiUserIdFromToken) {
          actualApiUserId = apiUserIdFromToken;
          console.log('Successfully converted Firebase UID to API User ID:', actualApiUserId);
        } else {
          console.warn('Could not get API User ID from token, proceeding with original ID');
        }
      } catch (error) {
        console.warn('Error getting API User ID from token:', error);
      }
    }

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${actualApiUserId}/certifications/${cert_id}/cert-summary`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        `Failed to fetch cert summary for user ${api_user_id} and cert ${cert_id}:`,
        response.status,
        responseText,
      );
      const normalized = normalizeUpstreamError(
        response.status,
        responseText,
        'Failed to fetch cert summary',
      );
      return NextResponse.json(normalized.payload, { status: normalized.status });
    }

    try {
      return NextResponse.json(JSON.parse(responseText), { status: 200 });
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
    console.error('Error fetching cert summary:', error);
    return NextResponse.json(
      buildErrorEnvelope('Error fetching cert summary', 'INTERNAL_SERVER_ERROR', true),
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ api_user_id: string; cert_id: string }>;
  },
) {
  try {
    const { api_user_id, cert_id } = await params;

    if (!api_user_id || !cert_id) {
      return buildProxyPathError();
    }

    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      return buildProxyAuthError();
    }

    // Check if api_user_id is actually a Firebase UID and convert if needed
    let actualApiUserId = api_user_id;

    if (api_user_id.length === 28 && /^[a-zA-Z0-9]+$/.test(api_user_id)) {
      console.log('Detected Firebase UID in URL, attempting to get API User ID from token');

      try {
        const apiUserIdFromToken = await getApiUserIdFromToken(firebaseToken);
        if (apiUserIdFromToken) {
          actualApiUserId = apiUserIdFromToken;
          console.log('Successfully converted Firebase UID to API User ID:', actualApiUserId);
        } else {
          console.warn('Could not get API User ID from token, proceeding with original ID');
        }
      } catch (error) {
        console.warn('Error getting API User ID from token:', error);
      }
    }

    const targetUrl = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/${actualApiUserId}/certifications/${cert_id}/cert-summary`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        `Failed to generate cert summary for user ${api_user_id} and cert ${cert_id}:`,
        response.status,
        responseText,
      );
      const normalized = normalizeUpstreamError(
        response.status,
        responseText,
        'Failed to generate cert summary',
      );
      return NextResponse.json(normalized.payload, { status: normalized.status });
    }

    try {
      return NextResponse.json(JSON.parse(responseText), { status: 200 });
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
    console.error('Error generating cert summary:', error);
    return NextResponse.json(
      buildErrorEnvelope('Error generating cert summary', 'INTERNAL_SERVER_ERROR', true),
      { status: 500 },
    );
  }
}
