import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  isCertCatalogPageRequest,
} from '@/src/lib/api-utils';

const FIRMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/firms`;

export async function GET(request: NextRequest) {
  try {
    // Check if request is from authenticated cert catalog pages
    if (!isCertCatalogPageRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Access denied: This endpoint is only available for authenticated cert catalog pages',
        },
        { status: 403 },
      );
    }

    const firebaseToken = await getAuthenticatedToken();
    const apiUrl = buildApiUrl(FIRMS_API_URL, request);

    const response = await makeAuthenticatedRequest(apiUrl, {
      method: 'GET',
      firebaseToken,
    });

    return handleApiResponse(response, 'fetch firms');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching firms');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if request is from authenticated cert catalog pages
    if (!isCertCatalogPageRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Access denied: This endpoint is only available for authenticated cert catalog pages',
        },
        { status: 403 },
      );
    }

    const firebaseToken = await getAuthenticatedToken();
    const body = await request.json();

    const response = await makeAuthenticatedRequest(FIRMS_API_URL, {
      method: 'POST',
      firebaseToken,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error('Failed to create firm:', response.status, errorData);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create firm',
          error: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return createErrorResponse(error as Error, 'creating firm');
  }
}
