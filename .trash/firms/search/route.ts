import { NextRequest } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
} from '@/src/lib/api-utils';

const FIRMS_SEARCH_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/firms/search`;

export async function GET(request: NextRequest) {
  try {
    const firebaseToken = await getAuthenticatedToken();
    const apiUrl = buildApiUrl(FIRMS_SEARCH_API_URL, request);

    const response = await makeAuthenticatedRequest(apiUrl, {
      method: 'GET',
      firebaseToken,
    });

    return handleApiResponse(response, 'search firms');
  } catch (error) {
    return createErrorResponse(error as Error, 'searching firms');
  }
}
