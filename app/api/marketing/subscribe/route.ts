import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

interface SubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  fields?: Record<string, string | number>;
  groups?: string[];
  ip_address?: string;
  status?: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

interface MarketingApiResult {
  success: boolean;
  error?: string;
  subscriberId?: string;
}

/**
 * Generate JWT token for marketing API access
 * Server-side only function
 */
async function generateMarketingJWT(): Promise<string | null> {
  try {
    const secret = process.env.MARKETING_API_JWT_SECRET;
    if (!secret) {
      console.warn('MARKETING_API_JWT_SECRET environment variable is not set');
      return null;
    }

    const secretKey = new TextEncoder().encode(secret);

    const jwt = await new SignJWT({
      sub: 'certifai-app',
      scope: 'marketing:write',
      iat: Math.floor(Date.now() / 1000),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secretKey);

    console.log(`marketing api jwt: ${jwt}`);

    return jwt;
  } catch (error) {
    console.error('Failed to generate marketing JWT:', error);
    return null;
  }
}

/**
 * Subscribe user to marketing list via AWS Lambda
 * This function is non-blocking and will not prevent signup completion if it fails
 */
async function subscribeUserToMarketing(
  email: string,
  firstName?: string,
  lastName?: string,
  userAgent?: string,
): Promise<MarketingApiResult> {
  try {
    const marketingApiUrl = process.env.MARKETING_API_URL;

    if (!marketingApiUrl) {
      console.warn(
        'MARKETING_API_URL environment variable is not set, skipping marketing subscription',
      );
      return { success: false, error: 'Marketing API URL not configured' };
    }

    // Generate JWT token for authentication
    const jwtToken = await generateMarketingJWT();
    if (!jwtToken) {
      console.warn('Failed to generate JWT token for marketing API, skipping subscription');
      return { success: false, error: 'Failed to generate authentication token' };
    }

    // Prepare subscription data
    const subscriptionData: SubscriptionRequest = {
      email,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      fields: {
        source: 'certestic-app-signup',
        signup_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        ...(userAgent && { user_agent: userAgent }),
      },
      groups: ['new-users', 'newsletter'],
      status: 'active',
    };

    // Make request to marketing API
    const response = await fetch(`${marketingApiUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(subscriptionData),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Marketing API subscription failed:', response.status, errorText);

      // Return non-blocking error for better user experience
      return {
        success: false,
        error: `Marketing subscription failed: ${response.status}`,
      };
    }

    const result: SubscriptionResponse = await response.json();

    console.log(`marketing api result: ${JSON.stringify(result)}`);

    if (result.success) {
      console.log('User successfully subscribed to marketing:', result.subscriberId);
      return {
        success: true,
        subscriberId: result.subscriberId,
      };
    } else {
      console.warn('Marketing subscription failed:', result.message);
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    // Handle network errors, timeouts, etc.
    const errorMessage = error.message || 'Unknown error occurred';
    console.error('Error during marketing subscription:', errorMessage);

    // Don't block signup for marketing subscription errors
    return {
      success: false,
      error: `Marketing subscription error: ${errorMessage}`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, userAgent } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Subscribe user to marketing
    const result = await subscribeUserToMarketing(email, firstName, lastName, userAgent);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error('Marketing subscription API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
