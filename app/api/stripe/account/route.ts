import { NextRequest, NextResponse } from 'next/server';
import { serverFetchWithAuth } from '@/src/stripe/server';

/**
 * Frontend API route to get unified account data
 * Calls the backend unified account endpoint
 */
export async function GET(req: NextRequest) {
  try {
    const response = await serverFetchWithAuth('/stripe/account');

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Backend API error: ${response.status}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format from backend');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format from backend',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Account data API error:', error);

    // Provide more specific error responses
    if (error.message?.includes('No authentication token')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          requiresReauth: true,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch account data',
      },
      { status: error.status || 500 },
    );
  }
}
