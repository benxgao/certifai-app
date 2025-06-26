import { NextRequest } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
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
    const firebaseToken = await getAuthenticatedToken();
    const resolvedParams = await params;
    const certificationId = validateId(resolvedParams.certificationId, 'certificationId');

    const apiUrl = buildApiUrl(CERTIFICATIONS_API_URL, request, certificationId.toString());

    const response = await makeAuthenticatedRequest(apiUrl, {
      method: 'GET',
      firebaseToken,
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
    const firebaseToken = await getAuthenticatedToken();
    const resolvedParams = await params;
    const certificationId = validateId(resolvedParams.certificationId, 'certificationId');
    const body = await request.json();

    const response = await makeAuthenticatedRequest(
      `${CERTIFICATIONS_API_URL}/${certificationId}`,
      {
        method: 'PUT',
        firebaseToken,
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
    const firebaseToken = await getAuthenticatedToken();
    const resolvedParams = await params;
    const certificationId = validateId(resolvedParams.certificationId, 'certificationId');

    const response = await makeAuthenticatedRequest(
      `${CERTIFICATIONS_API_URL}/${certificationId}`,
      {
        method: 'DELETE',
        firebaseToken,
      },
    );

    return handleApiResponse(response, 'delete certification');
  } catch (error) {
    return createErrorResponse(error as Error, 'deleting certification');
  }
}
