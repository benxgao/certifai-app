import { NextRequest, NextResponse } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  isPublicCertificationPageRequest,
} from '@/src/lib/api-utils';

const FIRMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/firms`;

export async function GET(request: NextRequest) {
  try {
    // Check if request is from public certification pages
    if (!isPublicCertificationPageRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied: This endpoint is only available for public certification pages',
        },
        { status: 403 },
      );
    }

    const jwtToken = await getJWTToken();
    const apiUrl = buildApiUrl(FIRMS_API_URL, request);

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch firms');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching firms');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if request is from public certification pages
    if (!isPublicCertificationPageRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied: This endpoint is only available for public certification pages',
        },
        { status: 403 },
      );
    }

    const jwtToken = await getJWTToken();
    const body = await request.json();

    const response = await makeJWTAuthenticatedRequest(FIRMS_API_URL, {
      method: 'POST',
      jwtToken,
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
