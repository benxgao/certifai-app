import { NextRequest, NextResponse } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  validateId,
  isPublicCertificationPageRequest,
} from '@/src/lib/api-utils';

const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_SERVER_API_URL environment variable is not set');
}
const FIRMS_API_URL = `${apiBaseUrl}/api/public/firms`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ firmId: string }> },
) {
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
    const resolvedParams = await params;
    const firmId = validateId(resolvedParams.firmId, 'firmId');

    const apiUrl = buildApiUrl(FIRMS_API_URL, request, String(firmId));

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch firm');
  } catch (error) {
    // Optionally log error for debugging
    // console.error('Error fetching firm:', error);
    return createErrorResponse(error as Error, 'fetching firm');
  }
}
