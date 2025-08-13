import { NextRequest, NextResponse } from 'next/server';
import { getServerPricingPlans } from '@/src/stripe/server';

export async function GET(request: NextRequest) {
  try {
    const result = await getServerPricingPlans();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API: Get pricing plans error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get pricing plans',
      },
      { status: 500 },
    );
  }
}
