import { NextRequest, NextResponse } from 'next/server';
import { handleAuthenticatedRequest } from '@/src/stripe/server';

export async function POST(request: NextRequest) {
  try {
    const result = await handleAuthenticatedRequest('/stripe/subscription/reactivate', {
      method: 'POST',
    });

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
    console.error('API: Reactivate subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reactivate subscription',
      },
      { status: 500 },
    );
  }
}
