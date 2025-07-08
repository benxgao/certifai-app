/**
 * Client-side marketing API utilities
 * This file provides functions to subscribe users to marketing from the client side
 */

interface MarketingApiResult {
  success: boolean;
  error?: string;
  subscriberId?: string;
}

/**
 * Subscribe user to marketing list via internal API route
 * This function is client-safe and calls the server-side API
 * This function is non-blocking and will not prevent signup completion if it fails
 * The API now always returns 200 status to prevent frontend error popups
 */
export async function subscribeUserToMarketing(
  email: string,
  firstName?: string,
  lastName?: string,
  userAgent?: string,
): Promise<MarketingApiResult> {
  try {
    const response = await fetch('/api/marketing/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        userAgent,
      }),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 second timeout (longer for client-server-AWS chain)
    });

    // The API now always returns 200, so we check the response body for success/failure
    const result = await response.json();

    if (result.success) {
      console.log('User successfully subscribed to marketing:', result.subscriberId);
    } else {
      console.warn('Marketing subscription failed:', result.error);
    }

    return result;
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
