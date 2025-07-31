/**
 * Simple in-memory rate limiter for authentication endpoints
 * For production, consider using Redis or a proper rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: 50,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  REGISTER: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  TOKEN_REFRESH: {
    maxAttempts: 10,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Get client identifier from request
 */
function getClientId(request: Request): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  // Use the first available IP or fallback
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || cfConnectingIp || 'unknown';

  return ip;
}

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  request: Request,
  type: RateLimitType,
  additionalIdentifier?: string,
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const config = RATE_LIMITS[type];
  const clientId = getClientId(request);
  const key = additionalIdentifier
    ? `${type}:${clientId}:${additionalIdentifier}`
    : `${type}:${clientId}`;

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    // 10% chance to cleanup
    cleanupExpiredEntries();
  }

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or expired window - allow and create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxAttempts) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000), // seconds
    };
  }

  // Increment count and allow
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(
  result: ReturnType<typeof checkRateLimit>,
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Rate limiting middleware wrapper
 */
export function withRateLimit(
  type: RateLimitType,
  handler: (request: Request) => Promise<Response>,
  additionalIdentifier?: (request: Request) => string | Promise<string>,
) {
  return async (request: Request): Promise<Response> => {
    try {
      const identifier = additionalIdentifier ? await additionalIdentifier(request) : undefined;
      const rateLimitResult = checkRateLimit(request, type, identifier);
      const headers = createRateLimitHeaders(rateLimitResult);

      if (!rateLimitResult.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: `Too many ${type.toLowerCase()} attempts. Please try again later.`,
            retryAfter: rateLimitResult.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
          },
        );
      }

      // Call the original handler
      const response = await handler(request);

      // Add rate limit headers to successful responses
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      // If rate limiting fails, allow the request to proceed
      return handler(request);
    }
  };
}

/**
 * Get current rate limit stats (for debugging)
 */
export function getRateLimitStats(): {
  totalEntries: number;
  entriesByType: Record<string, number>;
} {
  const entriesByType: Record<string, number> = {};

  for (const key of rateLimitStore.keys()) {
    const type = key.split(':')[0];
    entriesByType[type] = (entriesByType[type] || 0) + 1;
  }

  return {
    totalEntries: rateLimitStore.size,
    entriesByType,
  };
}
