import { NextRequest, NextResponse } from 'next/server';
import { getServerSubscriptionStatus } from '@/src/stripe/server';

export async function GET(request: NextRequest) {
  try {
    const result = await getServerSubscriptionStatus();

    // The server function now always returns a standardized response
    if (result) {
      return NextResponse.json(result);
    }

    // Fallback response (should rarely be reached now)
    return NextResponse.json({
      success: true,
      data: null,
      message: 'No subscription found',
    });
  } catch (error) {
    console.error('API: Get subscription status error:', error);

    // For subscription status, it's better to return a "no subscription" response
    // rather than an error, since not having a subscription is a valid state
    return NextResponse.json({
      success: true,
      data: null,
      message: 'No subscription found',
    });
  }
}
