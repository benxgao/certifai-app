import { NextRequest } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  validateId,
} from '@/src/lib/api-utils';

const CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> },
) {
  try {
    const jwtToken = await getJWTToken();
    const resolvedParams = await params;
    const certificationId = validateId(resolvedParams.certificationId, 'certificationId');

    const apiUrl = buildApiUrl(CERTIFICATIONS_API_URL, request, certificationId.toString());

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch certification');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching certification');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> },
) {
  try {
    const jwtToken = await getJWTToken();
    const resolvedParams = await params;
    const certificationId = validateId(resolvedParams.certificationId, 'certificationId');
    const body = await request.json();

    const response = await makeJWTAuthenticatedRequest(
      `${CERTIFICATIONS_API_URL}/${certificationId}`,
      {
        method: 'PUT',
        jwtToken,
        body: JSON.stringify(body),
      },
    );

    return handleApiResponse(response, 'update certification');
  } catch (error) {
    return createErrorResponse(error as Error, 'updating certification');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> },
) {
  try {
    const jwtToken = await getJWTToken();
    const resolvedParams = await params;
    const certificationId = validateId(resolvedParams.certificationId, 'certificationId');

    const response = await makeJWTAuthenticatedRequest(
      `${CERTIFICATIONS_API_URL}/${certificationId}`,
      {
        method: 'DELETE',
        jwtToken,
      },
    );

    return handleApiResponse(response, 'delete certification');
  } catch (error) {
    return createErrorResponse(error as Error, 'deleting certification');
  }
}
