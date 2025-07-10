import 'server-only';

import { SignJWT } from 'jose';
import {
  type SubscriptionResponse,
  type MarketingApiResult,
  createSubscriptionData,
} from '@/src/lib/marketing-types';

/**
 * Generate JWT token for marketing API access
 * ⚠️ SERVER-SIDE ONLY - Contains sensitive environment variables
 */
export async function generateMarketingJWT(): Promise<string | null> {
  try {
    const secret = process.env.MARKETING_API_JWT_SECRET;
    if (!secret) {
      console.warn('marketing_api: MARKETING_API_JWT_SECRET environment variable is not set');
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
 * ⚠️ SERVER-SIDE ONLY - This function uses sensitive environment variables and JWT generation
 *
 * For client-side usage, call the API route directly: POST /api/marketing/subscribe
 *
 * This function is non-blocking and will not prevent signup completion if it fails
 */
export async function subscribeUserToMarketing(
  email: string,
  firstName?: string,
  lastName?: string,
  userAgent?: string,
): Promise<MarketingApiResult> {
  try {
    const marketingApiUrl = process.env.MARKETING_API_URL;

    if (!marketingApiUrl) {
      console.warn(
        'marketing_api: MARKETING_API_URL environment variable is not set, skipping marketing subscription',
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

    // Prepare subscription data using the shared utility
    const subscriptionData = createSubscriptionData(email, firstName, lastName, userAgent);

    console.log(`marketing_api: userAgent: ${userAgent}`);
    console.log(
      'marketing_api: Subscribing user after email verification - Sending subscription data to AWS Lambda:',
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
      console.warn('marketing_api: Marketing subscription failed:', result.message);
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    // Handle network errors, timeouts, etc.
    const errorMessage = error.message || 'Unknown error occurred';
    console.error('marketing_api: Error during marketing subscription:', errorMessage);

    // Don't block signup for marketing subscription errors
    return {
      success: false,
      error: `marketing_api: Marketing subscription error: ${errorMessage}`,
    };
  }
}
