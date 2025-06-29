import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';
import { generatePublicJWTToken } from '@/src/lib/jwt-utils';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error with status code
 */
export class ApiError extends Error {
  constructor(public message: string, public statusCode: number = 500, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Validate request parameters
 */
export function validateRequiredParams(params: Record<string, any>, required: string[]): void {
  for (const param of required) {
    if (!params[param]) {
      throw new ApiError(`Missing required parameter: ${param}`, 400);
    }
  }
}

/**
 * Validate ID parameter (must be a positive integer)
 */
export function validateId(id: string, paramName: string = 'id'): number {
  const numId = Number(id);
  if (!id || isNaN(numId) || numId <= 0 || !Number.isInteger(numId)) {
    throw new ApiError(`Invalid ${paramName}. Must be a positive integer.`, 400);
  }
  return numId;
}

/**
 * Get Firebase token with proper error handling
 */
export async function getAuthenticatedToken(): Promise<string> {
  try {
    const firebaseToken = await getFirebaseTokenFromCookie();

    if (!firebaseToken) {
      console.error('Authentication failed: No Firebase token found in cookie');
      throw new ApiError('Authentication failed: Invalid token', 401);
    }

    return firebaseToken;
  } catch (error) {
    console.error('getAuthenticatedToken error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Authentication failed: Unable to retrieve token', 401);
  }
}

/**
 * Get JWT token for public API access
 */
export async function getJWTToken(): Promise<string> {
  const jwtToken = await generatePublicJWTToken();

  if (!jwtToken) {
    throw new ApiError('Authentication failed: Unable to generate JWT token', 401);
  }

  return jwtToken;
}

/**
 * Make authenticated API request to backend
 */
export async function makeAuthenticatedRequest(
  url: string,
  options: RequestInit & { firebaseToken: string },
): Promise<Response> {
  const { firebaseToken, ...requestOptions } = options;

  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
      ...requestOptions.headers,
    },
  });

  return response;
}

/**
 * Make authenticated API request to backend using JWT token
 */
export async function makeJWTAuthenticatedRequest(
  url: string,
  options: RequestInit & { jwtToken: string },
): Promise<Response> {
  const { jwtToken, ...requestOptions } = options;

  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
      ...requestOptions.headers,
    },
  });

  return response;
}

/**
 * Handle API response with consistent error formatting
 */
export async function handleApiResponse(
  response: Response,
  operation: string,
): Promise<NextResponse> {
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    console.error(`Failed to ${operation}:`, response.status, errorData);

    return NextResponse.json(
      {
        success: false,
        message: `Failed to ${operation}`,
        error: errorData,
      },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}

/**
 * Create error response
 */
export function createErrorResponse(error: Error | ApiError, operation: string): NextResponse {
  console.error(`Error ${operation}:`, error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: error.details,
      },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: `Error ${operation}`,
      error: error.message,
    },
    { status: 500 },
  );
}

/**
 * Build API URL with query parameters
 */
export function buildApiUrl(
  baseUrl: string,
  request: NextRequest,
  additionalPath?: string,
): string {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  let apiUrl = baseUrl;
  if (additionalPath) {
    apiUrl += `/${additionalPath}`;
  }

  if (queryString) {
    apiUrl += `?${queryString}`;
  }

  return apiUrl;
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T, statusCode: number = 200): NextResponse {
  return NextResponse.json(data, { status: statusCode });
}

/**
 * Check if request is authorized for public API access
 * More permissive approach - allows legitimate server-side and direct API calls
 */
export function isPublicCertificationPageRequest(request: NextRequest): boolean {
  const referer = request.headers.get('referer');

  // Allow requests without referer (server-side requests, direct API calls, etc.)
  if (!referer) {
    return true;
  }

  try {
    const parsedUrl = new URL(referer);
    const pathname = parsedUrl.pathname;

    // Block requests from authenticated main pages to public APIs
    if (pathname.startsWith('/main/')) {
      return false;
    }

    // Allow all other requests (including public certification pages)
    return true;
  } catch {
    // If URL parsing fails, allow the request
    return true;
  }
}
