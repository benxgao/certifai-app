import { NextRequest } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
} from '@/src/lib/api-utils';

const FIRMS_SEARCH_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/firms/search`;

export async function GET(request: NextRequest) {
  try {
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
