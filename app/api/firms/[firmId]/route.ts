import { NextRequest } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  validateId,
} from '@/src/lib/api-utils';

const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_SERVER_API_URL environment variable is not set');
}
const FIRMS_API_URL = `${apiBaseUrl}/api/firms`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ firmId: string }> },
) {
  try {
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
