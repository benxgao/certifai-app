import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { subscribeUserToMarketing } from '@/src/lib/marketing-api';

/**
 * Marketing Subscription API Route
 *
 * IMPORTANT: This API always returns HTTP 200 status code to prevent frontend error popups.
 * Success/failure is indicated in the response body via the 'success' field.
 * This ensures that marketing subscription failures don't disrupt the user signup flow.
 *
 * USAGE: This API is automatically called when users successfully verify their email addresses
 * after signup. It can also be called manually for other marketing subscription needs.
 *
 * CLIENT-SIDE USAGE EXAMPLE:
 * ```typescript
 * const response = await fetch('/api/marketing/subscribe', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     userAgent: navigator.userAgent
 *   }),
 *   signal: AbortSignal.timeout(15000)
 * });
 * const result = await response.json();
 * if (result.success) {
 *   console.log('Subscribed:', result.subscriberId);
 * }
 * ```
 */

export async function POST(request: NextRequest) {
  try {
    console.log('marketing_api: Subscribe API called');

    const body = await request.json();
    const { email, firstName, lastName, userAgent } = body;

    console.log('marketing_api: Request data:', {
      email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : 'null',
      firstName: firstName || 'null',
      lastName: lastName || 'null',
      hasUserAgent: !!userAgent,
    });

    // Validate required fields
    if (!email) {
      console.warn('marketing_api: Email is missing from request');
      // Always return 200 but with success: false for validation errors
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 200 },
      );
    }

    // Subscribe user to marketing using the centralized function
    console.log('marketing_api: Calling subscribeUserToMarketing...');
    const result = await subscribeUserToMarketing(email, firstName, lastName, userAgent);

    console.log('marketing_api: Subscribe result:', {
      success: result.success,
      hasSubscriberId: !!result.subscriberId,
      error: result.error || 'none',
    });

    // Always return 200 status code regardless of subscription success/failure
    // The success/failure is indicated in the response body
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('marketing_api: Marketing subscription API error:', error);

    // Always return 200 even for internal server errors
    // This prevents frontend error popups for non-critical marketing functionality
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 200 },
    );
  }
}
