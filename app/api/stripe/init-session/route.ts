import { NextRequest, NextResponse } from 'next/server';
import {
  cacheCheckoutSession,
  generateBrowserFingerprint,
} from '@/src/services/stripe-checkout-cache';

/**
 * Public API endpoint for caching checkout session data
 * Allows unauthenticated users to store checkout intent
 */
export async function POST(request: NextRequest) {
  try {
    const {
      price_id,
      success_url,
      cancel_url,
      trial_days,
      session_key, // Optional override for browser fingerprint
    } = await request.json();

    if (!price_id) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Generate or use provided session key
    const sessionKey = session_key || generateBrowserFingerprint();

    // Generate a unique session ID for this cached session
    const session_id = `cached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Cache the checkout session data
    await cacheCheckoutSession(sessionKey, {
      session_id,
      price_id,
      success_url:
        success_url || `${process.env.NEXT_PUBLIC_APP_URL}/main/billing?session_success=true`,
      cancel_url:
        cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/main/billing?session_canceled=true`,
      trial_days,
    });

    return NextResponse.json({
      success: true,
      session_key: sessionKey,
      session_id,
      message: 'Checkout session cached successfully',
    });
  } catch (error) {
    console.error('Error caching checkout session:', error);
    return NextResponse.json({ error: 'Failed to cache checkout session' }, { status: 500 });
  }
}
