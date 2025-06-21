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
  timeoutMs = 10000, // Increased default timeout to 10 seconds
): Promise<Response> => {
  // Check if there's already an abort signal provided
  const existingSignal = options.signal;
  const controller = new AbortController();

  // If there's an existing signal, abort when it aborts
  if (existingSignal) {
    if (existingSignal.aborted) {
      throw new Error('Request was cancelled before it started');
    }
    existingSignal.addEventListener('abort', () => controller.abort());
  }

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

    // Enhance error messages for better user experience
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        // Check if it was a timeout or an external abort
        if (existingSignal?.aborted) {
          // External abort (component unmounted, navigation, etc.)
          console.log('Request cancelled due to component cleanup or navigation');
          const cancelError = new Error('Request was cancelled');
          cancelError.name = 'CancelledError';
          throw cancelError;
        } else {
          // Timeout abort
          const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
          timeoutError.name = 'TimeoutError';
          throw timeoutError;
        }
      }

      // Preserve other error types but ensure they have meaningful messages
      if (error.message === 'Failed to fetch') {
        const networkError = new Error(
          'Network error. Please check your connection and try again.',
        );
        networkError.name = 'NetworkError';
        throw networkError;
      }
    }

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
