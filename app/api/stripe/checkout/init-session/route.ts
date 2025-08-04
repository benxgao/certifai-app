import { NextRequest, NextResponse } from 'next/server';
import { getServerPricingPlans } from '@/src/stripe/server';
import { cacheCheckoutSession } from '@/src/services/stripe-checkout-cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price_id, session_key, success_url, cancel_url, trial_days } = body;

    // Validate required fields
    if (!price_id || !session_key) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: price_id and session_key',
        },
        { status: 400 },
      );
    }

    // Validate that the price_id exists in our pricing plans
    const pricingPlansResult = await getServerPricingPlans();
    if (!pricingPlansResult?.success || !pricingPlansResult.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to validate pricing plan',
        },
        { status: 400 },
      );
    }

    const validPriceIds = pricingPlansResult.data.map((plan: any) => plan.id);
    if (!validPriceIds.includes(price_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid price_id',
        },
        { status: 400 },
      );
    }

    // Generate a temporary session ID for caching
    const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Cache the checkout session data
    await cacheCheckoutSession(session_key, {
      session_id: tempSessionId,
      price_id,
      success_url,
      cancel_url,
      trial_days,
    });

    return NextResponse.json({
      success: true,
      data: {
        session_key,
        temp_session_id: tempSessionId,
        message: 'Checkout session initialized. Please sign in to continue.',
      },
    });
  } catch (error) {
    console.error('API: Initialize checkout session error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize checkout session',
      },
      { status: 500 },
    );
  }
}
