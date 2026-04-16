/**
 * Authentication State Type Definitions
 * Provides strict TypeScript definitions for auth state management
 * Replaces implicit state detection with type-safe state machine
 */

/**
 * Core auth state - explicit enum for state machine
 */
export enum AuthState {
  NotAuthenticated = 'not-authenticated',
  Authenticating = 'authenticating',
  Authenticated = 'authenticated',
  SessionExpired = 'session-expired',
  Error = 'error',
}

/**
 * Type-safe auth state with validation
 */
export interface TypedAuthState {
  state: AuthState;
  firebaseUser: any | null;
  apiUserId: string | null;
  token: string | null;
  timestamp: number;
}

/**
 * State transition definition - which states can transition to which
 */
const validTransitions: Record<AuthState, AuthState[]> = {
  [AuthState.NotAuthenticated]: [
    AuthState.Authenticating,
    AuthState.Error,
  ],
  [AuthState.Authenticating]: [
    AuthState.Authenticated,
    AuthState.Error,
  ],
  [AuthState.Authenticated]: [
    AuthState.SessionExpired,
    AuthState.Error,
    AuthState.NotAuthenticated,
  ],
  [AuthState.SessionExpired]: [
    AuthState.NotAuthenticated,
    AuthState.Authenticating,
    AuthState.Error,
  ],
  [AuthState.Error]: [
    AuthState.NotAuthenticated,
    AuthState.Authenticating,
    AuthState.Authenticated,
  ],
};

/**
 * Check if a state transition is valid
 * @param from - Current state
 * @param to - Desired state
 * @returns true if transition is allowed, false otherwise
 */
export const isValidStateTransition = (from: AuthState, to: AuthState): boolean => {
  return validTransitions[from]?.includes(to) ?? false;
};

/**
 * Perform a state transition with validation
 * @param from - Current state
 * @param to - Desired state
 * @throws Error if transition is invalid
 */
export const assertValidStateTransition = (from: AuthState, to: AuthState): void => {
  if (!isValidStateTransition(from, to)) {
    throw new Error(
      `Invalid auth state transition: ${from} -> ${to}. ` +
      `Valid transitions from ${from}: ${validTransitions[from].join(', ')}`,
    );
  }
};

/**
 * Determine current auth state from component state
 * @param firebaseUser - Firebase user object (or null)
 * @param apiUserId - API user ID (or null)
 * @param token - Auth token (or null)
 * @returns Current AuthState
 */
export const determineAuthState = (
  firebaseUser: any | null,
  apiUserId: string | null,
  token: string | null,
): AuthState => {
  // Check if fully authenticated (has all three)
  if (firebaseUser && apiUserId && token) {
    return AuthState.Authenticated;
  }

  // Check if authenticating (has Firebase user but missing API user ID or token)
  if (firebaseUser && (!apiUserId || !token)) {
    return AuthState.Authenticating;
  }

  // Check if session expired (has user but no token or API ID is null due to expiry)
  if (firebaseUser && !token && apiUserId === null) {
    return AuthState.SessionExpired;
  }

  // Check if error state (has partial state)
  if ((firebaseUser && !apiUserId) || (!firebaseUser && apiUserId)) {
    return AuthState.Error;
  }

  // Otherwise, not authenticated
  return AuthState.NotAuthenticated;
};

/**
 * Validate that auth state is consistent
 * Returns validation errors, if any
 * @returns Array of validation errors (empty if valid)
 */
export const validateAuthStateConsistency = (
  firebaseUser: any | null,
  apiUserId: string | null,
  token: string | null,
): string[] => {
  const errors: string[] = [];

  // If firebaseUser exists, should have token and eventually apiUserId
  if (firebaseUser && !token) {
    errors.push('User authenticated but no token present');
  }

  // If apiUserId exists, should have firebaseUser
  if (apiUserId && !firebaseUser) {
    errors.push('API user ID present but no Firebase user');
  }

  // If token exists, should have firebaseUser
  if (token && !firebaseUser) {
    errors.push('Token present but no Firebase user');
  }

  return errors;
};

/**
 * Authentication error types
 */
export enum AuthErrorType {
  InvalidCredentials = 'invalid-credentials',
  NetworkError = 'network-error',
  SessionExpired = 'session-expired',
  EmailNotVerified = 'email-not-verified',
  TooManyAttempts = 'too-many-attempts',
  Unknown = 'unknown',
}

/**
 * Typed auth error
 */
export interface TypedAuthError {
  type: AuthErrorType;
  message: string;
  userFacingMessage: string;
}

/**
 * Parse Firebase error code to typed auth error
 */
export const parseFirebaseErrorToTypedError = (
  firebaseErrorCode: string,
  originalMessage: string,
): TypedAuthError => {
  switch (firebaseErrorCode) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return {
        type: AuthErrorType.InvalidCredentials,
        message: originalMessage,
        userFacingMessage: 'Invalid email or password.',
      };

    case 'auth/invalid-email':
      return {
        type: AuthErrorType.InvalidCredentials,
        message: originalMessage,
        userFacingMessage: 'Please enter a valid email address.',
      };

    case 'auth/too-many-requests':
      return {
        type: AuthErrorType.TooManyAttempts,
        message: originalMessage,
        userFacingMessage: 'Too many failed attempts. Please try again later.',
      };

    case 'auth/network-request-failed':
    case 'auth/internal-error':
      return {
        type: AuthErrorType.NetworkError,
        message: originalMessage,
        userFacingMessage: 'Network error. Please check your connection and try again.',
      };

    case 'auth/user-disabled':
      return {
        type: AuthErrorType.Unknown,
        message: originalMessage,
        userFacingMessage: 'This account has been disabled.',
      };

    default:
      return {
        type: AuthErrorType.Unknown,
        message: originalMessage,
        userFacingMessage: 'An unexpected error occurred. Please try again.',
      };
  }
};
