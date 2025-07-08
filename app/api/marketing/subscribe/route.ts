import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

/**
 * Marketing Subscription API Route
 *
 * IMPORTANT: This API always returns HTTP 200 status code to prevent frontend error popups.
 * Success/failure is indicated in the response body via the 'success' field.
 * This ensures that marketing subscription failures don't disrupt the user signup flow.
 */

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
      console.warn('marketing_api: environment variable is not set');
      return null;
    }

    const secretKey = new TextEncoder().encode(secret);

    const jwt = await new SignJWT({
      sub: 'certifai-app',
      scope: 'marketing:write',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secretKey);

    console.log(`marketing_api: jwt: ${jwt}`);
    console.log(`marketing_api: jwt payload:`, JSON.parse(atob(jwt.split('.')[1])));

    return jwt;
  } catch (error) {
    console.error('marketing_api: Failed to generate marketing JWT:', error);
    return null;
  }
}

/**
 * Subscribe user to marketing list via AWS Lambda
 * This function is non-blocking and will not prevent signup completion if it fails
 * The API always returns 200 status to prevent frontend error popups
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
        'marketing_api: environment variable is not set, skipping marketing subscription',
      );
      return { success: false, error: 'Marketing API URL not configured' };
    }

    // Generate JWT token for authentication
    const jwtToken = await generateMarketingJWT();
    if (!jwtToken) {
      console.warn(
        'marketing_api: Failed to generate JWT token for marketing API, skipping subscription',
      );
      return { success: false, error: 'Failed to generate authentication token' };
    }

    // Prepare subscription data
    const subscriptionData: SubscriptionRequest = {
      email,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      // fields: {
      //   source: 'certestic-app-signup',
      //   signup_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      //   ...(userAgent && { user_agent: userAgent }),
      // },
      // groups: ['new-users', 'newsletter'],
      status: 'active',
    };

    console.log(`marketing_api: userAgent: ${userAgent}`);

    console.log(
      'marketing_api: Sending subscription data to AWS Lambda:',
      JSON.stringify(subscriptionData, null, 2),
    );

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
      console.error(
        'marketing_api: Marketing API subscription failed:',
        response.status,
        errorText,
      );

      // Return non-blocking error for better user experience
      return {
        success: false,
        error: `marketing_api: Marketing subscription failed: ${response.status}`,
      };
    }

    const result: SubscriptionResponse = await response.json();

    console.log(`marketing_api: result: ${JSON.stringify(result)}`);

    if (result.success) {
      console.log('marketing_api: User successfully subscribed to marketing:', result.subscriberId);
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
      error: `marketing_api: Marketing subscription error: ${errorMessage}`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, userAgent } = body;

    // Validate required fields
    if (!email) {
      // Always return 200 but with success: false for validation errors
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 200 },
      );
    }

    // Subscribe user to marketing
    const result = await subscribeUserToMarketing(email, firstName, lastName, userAgent);

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
