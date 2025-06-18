/**
 * Optimized fetch configuration for performance
 * These settings improve connection reuse and reduce latency
 */

// Default fetch options for optimal performance
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  // Enable HTTP/2 multiplexing and connection reuse
  keepalive: true,

  // Add performance-oriented headers
  headers: {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache', // Prevent stale auth data
  },
};

// Optimized fetch wrapper with timeout and connection reuse
export const optimizedFetch = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      signal: controller.signal,
      headers: {
        ...DEFAULT_FETCH_OPTIONS.headers,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Specific optimizations for auth-related requests
export const AUTH_FETCH_OPTIONS: RequestInit = {
  ...DEFAULT_FETCH_OPTIONS,
  // Prioritize auth requests
  priority: 'high' as any, // Modern browsers support this

  headers: {
    ...DEFAULT_FETCH_OPTIONS.headers,
    'Content-Type': 'application/json',
  },
};
