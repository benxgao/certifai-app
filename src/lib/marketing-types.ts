/**
 * Shared types for marketing API
 */

export interface SubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  fields?: Record<string, string | number>;
  groups?: string[];
  ip_address?: string;
  status?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

export interface MarketingApiResult {
  success: boolean;
  error?: string;
  subscriberId?: string;
}

/**
 * Create standardized subscription data object
 */
export function createSubscriptionData(
  email: string,
  firstName?: string,
  lastName?: string,
  userAgent?: string,
): SubscriptionRequest {
  return {
    email,
    firstName: firstName?.trim(),
    lastName: lastName?.trim(),
    fields: {
      source: 'certifai-app-signup',
      signup_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      ...(userAgent && { user_agent: userAgent }),
    },
    groups: ['new-users', 'newsletter'],
    status: 'active',
  };
}
