/**
 * Centralized authentication error handling utilities
 * Provides consistent error messages and handling across the app
 */

export interface AuthErrorResult {
  message: string;
  isRetriable: boolean;
  shouldShowToast: boolean;
}

/**
 * Parse Firebase authentication errors into user-friendly messages
 */
export function parseAuthError(error: any): AuthErrorResult {
  let message = 'An unexpected error occurred. Please try again.';
  let isRetriable = true;
  const shouldShowToast = true;

  if (error?.code) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email address is already registered. Please use a different email or try signing in instead.';
        isRetriable = false;
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address';
        isRetriable = false;
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger password';
        isRetriable = false;
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password.';
        isRetriable = false;
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        isRetriable = false;
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        isRetriable = false;
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password accounts are not enabled. Please contact support.';
        isRetriable = false;
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection and try again.';
        isRetriable = true;
        break;
      case 'auth/internal-error':
        message = 'Internal error occurred. Please try again in a moment.';
        isRetriable = true;
        break;
      case 'auth/expired-action-code':
        message = 'This verification link has expired. Please request a new one.';
        isRetriable = false;
        break;
      case 'auth/invalid-action-code':
        message = 'This verification link is invalid. Please check your email and try again.';
        isRetriable = false;
        break;
      default:
        message = error.message || message;
        break;
    }
  } else if (error?.message) {
    if (error.message.includes('network') || error.message.includes('timeout')) {
      message = 'Network error. Please check your connection and try again.';
      isRetriable = true;
    } else if (error.message.includes('signal is aborted')) {
      message = 'Operation was interrupted. Please try again.';
      isRetriable = true;
    } else {
      message = error.message;
    }
  }

  return { message, isRetriable, shouldShowToast };
}

/**
 * Check if an error is network-related and retriable
 */
export function isRetriableError(error: any): boolean {
  const retriableCodes = [
    'auth/network-request-failed',
    'auth/internal-error',
  ];

  const retriableMessages = [
    'network',
    'timeout',
    'signal is aborted',
    'connection',
  ];

  if (error?.code && retriableCodes.includes(error.code)) {
    return true;
  }

  if (error?.message) {
    return retriableMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }

  return false;
}

/**
 * Create a standardized error response for API routes
 */
export function createErrorResponse(error: any, defaultMessage = 'An error occurred') {
  let message = defaultMessage;
  let statusCode = 500;

  if (error instanceof Error) {
    message = error.message;

    // Handle specific error types
    if (error.message.includes('Unauthorized') || error.message.includes('unauthorized')) {
      statusCode = 401;
    } else if (error.message.includes('Forbidden') || error.message.includes('forbidden')) {
      statusCode = 403;
    } else if (error.message.includes('Not found') || error.message.includes('not found')) {
      statusCode = 404;
    } else if (error.message.includes('timeout')) {
      statusCode = 408;
    } else if (error.message.includes('Unique constraint') || error.message.includes('already exists')) {
      statusCode = 409;
    }
  }

  return {
    success: false,
    error: message,
    statusCode,
  };
}
