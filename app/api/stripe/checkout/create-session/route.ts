import { NextRequest, NextResponse } from 'next/server';
import { handleAuthenticatedRequest } from '@/src/stripe/server';
import {
  getCachedCheckoutSession,
  removeCachedCheckoutSession,
} from '@/src/services/stripe-checkout-cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let checkoutData = body;

    // Check if this is a cached session request
    if (body.session_key && !body.price_id) {
      // Try to retrieve cached session data
      const cachedSession = await getCachedCheckoutSession(body.session_key);

      if (!cachedSession) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cached session not found or expired. Please try again.',
          },
          { status: 404 },
        );
      }

      // Use cached session data for checkout creation
      checkoutData = {
        price_id: cachedSession.price_id,
        success_url: cachedSession.success_url,
        cancel_url: cachedSession.cancel_url,
        trial_days: cachedSession.trial_days,
      };

      // Clean up the cached session after use
      await removeCachedCheckoutSession(body.session_key);
    }

    const result = await handleAuthenticatedRequest('/stripe/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
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
    console.error('API: Create checkout session error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create checkout session',
      },
      { status: 500 },
    );
  }
}
