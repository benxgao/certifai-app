import { NextRequest } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  validateId,
} from '@/src/lib/api-utils';

const CERTIFICATIONS_BY_FIRM_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/firms`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ firmId: string }> },
) {
  try {
    const firebaseToken = await getAuthenticatedToken();
    const resolvedParams = await params;
    const firmId = validateId(resolvedParams.firmId, 'firmId');

    const baseUrl = `${CERTIFICATIONS_BY_FIRM_API_URL}/${firmId}/certifications`;
    const apiUrl = buildApiUrl(baseUrl, request);

    const response = await makeAuthenticatedRequest(apiUrl, {
      method: 'GET',
      firebaseToken,
    });

    return handleApiResponse(response, 'fetch certifications by firm');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching certifications by firm');
  }
}
