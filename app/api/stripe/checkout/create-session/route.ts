import { NextRequest, NextResponse } from 'next/server';
import { handleAuthenticatedRequest } from '@/src/stripe/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.price_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: price_id',
        },
        { status: 400 },
      );
    }

    // Validate price_id format (basic validation)
    if (typeof body.price_id !== 'string' || !body.price_id.startsWith('price_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid price_id format',
        },
        { status: 400 },
      );
    }

    // Validate optional fields
    if (body.trial_days && (typeof body.trial_days !== 'number' || body.trial_days < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid trial_days value',
        },
        { status: 400 },
      );
    }

    const result = await handleAuthenticatedRequest('/stripe/checkout/create-session', {
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

    // Validate response structure
    if (!responseData || !responseData.success) {
      console.error('Invalid checkout session response:', responseData);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from checkout service',
        },
        { status: 502 },
      );
    }

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
