import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedToken,
  makeAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
  getJWTToken,
  makeJWTAuthenticatedRequest,
} from '@/src/lib/api-utils';

const FIRMS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/firms`;

export async function GET(request: NextRequest) {
  try {
    // Use JWT token for public endpoints instead of Firebase token
    const jwtToken = await getJWTToken();
    const apiUrl = buildApiUrl(FIRMS_API_URL, request);

    console.log('Calling firms API with JWT token:', apiUrl);

    const response = await makeJWTAuthenticatedRequest(apiUrl, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch firms');
  } catch (error) {
    console.error('Error in /api/firms GET:', error);
    return createErrorResponse(error as Error, 'fetching firms');
  }
}

export async function POST(request: NextRequest) {
  try {
    const firebaseToken = await getAuthenticatedToken();
    const body = await request.json();

    // Use the authenticated endpoint for creating firms
    const FIRMS_CREATE_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/firms`;

    const response = await makeAuthenticatedRequest(FIRMS_CREATE_URL, {
      method: 'POST',
      firebaseToken,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      console.error('Failed to create firm:', response.status, errorData);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create firm',
          error: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return createErrorResponse(error as Error, 'creating firm');
  }
}
