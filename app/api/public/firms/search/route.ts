import { NextRequest, NextResponse } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  isPublicCertificationPageRequest,
} from '@/src/lib/api-utils';

const FIRMS_SEARCH_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/firms/search`;

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
    const apiUrl = buildApiUrl(FIRMS_SEARCH_API_URL, request);

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'search firms');
  } catch (error) {
    return createErrorResponse(error as Error, 'searching firms');
  }
}
