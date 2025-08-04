import { NextRequest, NextResponse } from 'next/server';
import { handleAuthenticatedRequest } from '@/src/stripe/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await handleAuthenticatedRequest('/stripe/subscription/update-plan', {
      method: 'POST',
      body: JSON.stringify(body),
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
    console.error('API: Update subscription plan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update subscription plan',
      },
      { status: 500 },
    );
  }
}
