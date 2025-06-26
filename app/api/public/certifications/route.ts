import { NextRequest, NextResponse } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
} from '@/src/lib/api-utils';

const CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications`;

export async function GET(request: NextRequest) {
  try {
    const jwtToken = await getJWTToken();
    const apiUrl = buildApiUrl(CERTIFICATIONS_API_URL, request);

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch certifications');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching certifications');
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwtToken = await getJWTToken();
    const body = await request.json();

    const response = await makeJWTAuthenticatedRequest(CERTIFICATIONS_API_URL, {
      method: 'POST',
      jwtToken,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error('Failed to create certification:', response.status, errorData);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create certification',
          error: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return createErrorResponse(error as Error, 'creating certification');
  }
}
