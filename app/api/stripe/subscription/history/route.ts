import { NextRequest, NextResponse } from 'next/server';
import { handleAuthenticatedRequest } from '@/src/stripe/server';

export async function GET(request: NextRequest) {
  try {
    const result = await handleAuthenticatedRequest('/stripe/subscription/history');

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: result.status },
      );
    }

    const responseData = await result.response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API: Get subscription history error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get subscription history',
      },
      { status: 500 },
    );
  }
}
