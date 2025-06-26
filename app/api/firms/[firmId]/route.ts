import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  validateId,
  isCertCatalogPageRequest,
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
    const resolvedParams = await params;
    const firmId = validateId(resolvedParams.firmId, 'firmId');

    const apiUrl = buildApiUrl(FIRMS_API_URL, request, String(firmId));

    const response = await makeAuthenticatedRequest(apiUrl, {
      method: 'GET',
      firebaseToken,
    });

    return handleApiResponse(response, 'fetch firm');
  } catch (error) {
    // Optionally log error for debugging
    // console.error('Error fetching firm:', error);
    return createErrorResponse(error as Error, 'fetching firm');
  }
}
