import { NextRequest } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
} from '@/src/lib/api-utils';

const DEMO_CREDENTIALS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/demo-credentials`;

export async function GET(request: NextRequest) {
  try {
    const jwtToken = await getJWTToken();
    const apiUrl = buildApiUrl(DEMO_CREDENTIALS_API_URL, request);

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch demo credentials');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching demo credentials');
  }
}
