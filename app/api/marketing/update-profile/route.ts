import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { generateMarketingJWT } from '@/src/lib/marketing-api';
import {
  type SubscriptionResponse,
  type MarketingApiResult,
  createProfileUpdateSubscriptionData,
} from '@/src/lib/marketing-types';

/**
 * Marketing Profile Update API Route
 *
 * IMPORTANT: This API always returns HTTP 200 status code to prevent frontend error popups.
 * Success/failure is indicated in the response body via the 'success' field.
 * This ensures that marketing profile update failures don't disrupt user profile updates.
 *
 * USAGE: This API is automatically called when users update their profile information
 * (like display name). It updates the marketing list with the new user information.
 *
 * CLIENT-SIDE USAGE EXAMPLE:
 * ```typescript
 * const response = await fetch('/api/marketing/update-profile', {
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
 *   console.log('Profile updated:', result.subscriberId);
 * }
 * ```
 */

async function updateMarketingProfile(
  email: string,
  firstName?: string,
  lastName?: string,
  userAgent?: string,
): Promise<MarketingApiResult> {
  try {
    const marketingApiUrl = process.env.MARKETING_API_URL;

    if (!marketingApiUrl) {
      console.warn(
        'marketing_api: MARKETING_API_URL environment variable is not set, skipping marketing profile update',
      );
      return { success: false, error: 'Marketing API URL not configured' };
    }

    // Generate JWT token for authentication
    const jwtToken = await generateMarketingJWT();
    if (!jwtToken) {
      console.warn(
        'marketing_api: Failed to generate JWT token for marketing API, skipping profile update',
      );
      return { success: false, error: 'Failed to generate authentication token' };
    }

    // Prepare subscription data using the profile update utility
    const subscriptionData = createProfileUpdateSubscriptionData(
      email,
      firstName,
      lastName,
      userAgent,
    );

    console.log(`marketing_api: userAgent: ${userAgent}`);
    console.log(
      'marketing_api: Updating user profile - Sending updated data to AWS Lambda:',
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
      console.error('marketing_api: Marketing profile update failed:', response.status, errorText);

      // Return non-blocking error for better user experience
      return {
        success: false,
        error: `marketing_api: Marketing profile update failed: ${response.status}`,
      };
    }

    const result: SubscriptionResponse = await response.json();

    console.log(`marketing_api: profile update result: ${JSON.stringify(result)}`);

    if (result.success) {
      console.log(
        'marketing_api: User profile successfully updated in marketing list:',
        result.subscriberId,
      );
      return {
        success: true,
        subscriberId: result.subscriberId,
      };
    } else {
      console.warn('marketing_api: Marketing profile update failed:', result.message);
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    // Handle network errors, timeouts, etc.
    const errorMessage = error.message || 'Unknown error occurred';
    console.error('marketing_api: Error during marketing profile update:', errorMessage);

    // Don't block profile updates for marketing errors
    return {
      success: false,
      error: `marketing_api: Marketing profile update error: ${errorMessage}`,
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

    // Update user profile in marketing using the centralized function
    const result = await updateMarketingProfile(email, firstName, lastName, userAgent);

    // Always return 200 status code regardless of update success/failure
    // The success/failure is indicated in the response body
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('marketing_api: Marketing profile update API error:', error);

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
