import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  createErrorResponse,
  validateRequiredParams,
} from '@/src/lib/api-utils';

const CERTIFICATIONS_REGISTER_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/users/certifications`;

export async function POST(request: NextRequest) {
  try {
    const firebaseToken = await getAuthenticatedToken();
    const body = await request.json();

    // Validate required parameters
    validateRequiredParams(body, ['certificationId']);

    const response = await makeAuthenticatedRequest(CERTIFICATIONS_REGISTER_API_URL, {
      method: 'POST',
      firebaseToken,
      body: JSON.stringify({ certificationId: body.certificationId }),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error('Failed to register for certification:', response.status, errorData);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to register for certification',
          error: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return createErrorResponse(error as Error, 'registering for certification');
  }
}
