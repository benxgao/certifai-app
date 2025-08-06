import { NextRequest, NextResponse } from 'next/server';
import { serverFetchWithAuth } from '@/src/stripe/server';

/**
 * Frontend API route to get account data by API user ID
 * Calls the backend unified account endpoint
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ apiUserId: string }> },
) {
  try {
    const { apiUserId } = await params;

    if (!apiUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'API user ID is required',
        },
        { status: 400 },
      );
    }

    // Validate API user ID format (basic validation)
    if (typeof apiUserId !== 'string' || apiUserId.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid API user ID format',
        },
        { status: 400 },
      );
    }

    const response = await serverFetchWithAuth(`/stripe/account/${apiUserId.trim()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error for user', apiUserId, ':', response.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Backend API error: ${response.status}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format from backend for user', apiUserId);
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
    console.error('Account data by ID API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch account data',
      },
      { status: error.status || 500 },
    );
  }
}
