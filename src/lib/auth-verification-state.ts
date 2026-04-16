/**
 * Authentication Verification State Management
 * Centralizes email verification state handling, replacing scattered localStorage keys
 * with type-safe helpers
 */

/**
 * Verification state keys (previously scattered across components)
 */
const VERIFICATION_STATE_KEY = 'auth.verification.state';
const VERIFICATION_LOADING_KEY = 'auth.verification.loading';
const VERIFICATION_EMAIL_SENT_KEY = 'auth.verification.emailSent';
const VERIFICATION_EMAIL_KEY = 'auth.verification.email';
const VERIFICATION_TIMESTAMP_KEY = 'auth.verification.timestamp';

/**
 * Verification state enum
 */
export enum VerificationState {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  EmailSent = 'email-sent',
  Verified = 'verified',
  Failed = 'failed',
}

/**
 * Complete verification state object
 */
export interface VerificationStateObject {
  state: VerificationState;
  email: string | null;
  emailSent: boolean;
  isLoading: boolean;
  timestamp: number;
}

/**
 * Initialize verification state (for new signin/signup)
 */
export const initializeVerificationState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();

    localStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.NotStarted);
    localStorage.setItem(VERIFICATION_LOADING_KEY, 'false');
    localStorage.setItem(VERIFICATION_EMAIL_SENT_KEY, 'false');
    localStorage.setItem(VERIFICATION_EMAIL_KEY, '');
    localStorage.setItem(VERIFICATION_TIMESTAMP_KEY, String(now));

    sessionStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.NotStarted);
    sessionStorage.setItem(VERIFICATION_LOADING_KEY, 'false');

    console.log('[verificationState] Verification state initialized');
  } catch (error) {
    console.warn('[verificationState] Failed to initialize verification state:', error);
  }
};

/**
 * Set verification as in progress
 * @param email - Email being verified
 */
export const setVerificationInProgress = (email: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.InProgress);
    localStorage.setItem(VERIFICATION_LOADING_KEY, 'true');
    localStorage.setItem(VERIFICATION_EMAIL_KEY, email);
    localStorage.setItem(VERIFICATION_TIMESTAMP_KEY, String(Date.now()));

    sessionStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.InProgress);
    sessionStorage.setItem(VERIFICATION_LOADING_KEY, 'true');

    console.log('[verificationState] Verification set in progress for:', email);
  } catch (error) {
    console.warn('[verificationState] Failed to set verification in progress:', error);
  }
};

/**
 * Set verification email as sent
 * @param email - Email that verification was sent to
 */
export const setVerificationEmailSent = (email: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.EmailSent);
    localStorage.setItem(VERIFICATION_EMAIL_SENT_KEY, 'true');
    localStorage.setItem(VERIFICATION_EMAIL_KEY, email);
    localStorage.setItem(VERIFICATION_LOADING_KEY, 'false');
    localStorage.setItem(VERIFICATION_TIMESTAMP_KEY, String(Date.now()));

    sessionStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.EmailSent);
    sessionStorage.setItem(VERIFICATION_EMAIL_SENT_KEY, 'true');

    console.log('[verificationState] Verification email sent to:', email);
  } catch (error) {
    console.warn('[verificationState] Failed to set email sent state:', error);
  }
};

/**
 * Set verification as complete
 * @param email - Email that was verified
 */
export const setVerificationComplete = (email: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.Verified);
    localStorage.setItem(VERIFICATION_EMAIL_SENT_KEY, 'false');
    localStorage.setItem(VERIFICATION_EMAIL_KEY, email);
    localStorage.setItem(VERIFICATION_LOADING_KEY, 'false');
    localStorage.setItem(VERIFICATION_TIMESTAMP_KEY, String(Date.now()));

    sessionStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.Verified);

    console.log('[verificationState] Verification complete for:', email);
  } catch (error) {
    console.warn('[verificationState] Failed to set verification complete:', error);
  }
};

/**
 * Set verification as failed
 * @param error - Error message
 */
export const setVerificationFailed = (error: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.Failed);
    localStorage.setItem(VERIFICATION_LOADING_KEY, 'false');
    localStorage.setItem(VERIFICATION_TIMESTAMP_KEY, String(Date.now()));

    sessionStorage.setItem(VERIFICATION_STATE_KEY, VerificationState.Failed);
    sessionStorage.setItem(VERIFICATION_LOADING_KEY, 'false');

    console.log('[verificationState] Verification failed:', error);
  } catch (error) {
    console.warn('[verificationState] Failed to set verification failed:', error);
  }
};

/**
 * Get current verification state
 * @returns Complete verification state object
 */
export const getVerificationState = (): VerificationStateObject => {
  if (typeof window === 'undefined') {
    return {
      state: VerificationState.NotStarted,
      email: null,
      emailSent: false,
      isLoading: false,
      timestamp: 0,
    };
  }

  try {
    const state = (localStorage.getItem(VERIFICATION_STATE_KEY) ||
      VerificationState.NotStarted) as VerificationState;
    const email = localStorage.getItem(VERIFICATION_EMAIL_KEY);
    const emailSent = localStorage.getItem(VERIFICATION_EMAIL_SENT_KEY) === 'true';
    const isLoading = localStorage.getItem(VERIFICATION_LOADING_KEY) === 'true';
    const timestamp = parseInt(localStorage.getItem(VERIFICATION_TIMESTAMP_KEY) || '0', 10);

    return {
      state,
      email,
      emailSent,
      isLoading,
      timestamp,
    };
  } catch (error) {
    console.warn('[verificationState] Failed to get verification state:', error);
    return {
      state: VerificationState.NotStarted,
      email: null,
      emailSent: false,
      isLoading: false,
      timestamp: 0,
    };
  }
};

/**
 * Check if verification is in progress
 */
export const isVerificationInProgress = (): boolean => {
  const state = getVerificationState();
  return state.state === VerificationState.InProgress && state.isLoading;
};

/**
 * Check if verification email has been sent
 */
export const isVerificationEmailSent = (): boolean => {
  const state = getVerificationState();
  return state.emailSent && state.state === VerificationState.EmailSent;
};

/**
 * Check if verification is complete
 */
export const isVerificationComplete = (): boolean => {
  const state = getVerificationState();
  return state.state === VerificationState.Verified;
};

/**
 * Clear all verification state
 * Use after successful signin or logout
 */
export const clearVerificationState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Clear localStorage
    localStorage.removeItem(VERIFICATION_STATE_KEY);
    localStorage.removeItem(VERIFICATION_LOADING_KEY);
    localStorage.removeItem(VERIFICATION_EMAIL_SENT_KEY);
    localStorage.removeItem(VERIFICATION_EMAIL_KEY);
    localStorage.removeItem(VERIFICATION_TIMESTAMP_KEY);

    // Clear sessionStorage (also clear legacy keys for backward compatibility)
    sessionStorage.removeItem(VERIFICATION_STATE_KEY);
    sessionStorage.removeItem(VERIFICATION_LOADING_KEY);
    sessionStorage.removeItem(VERIFICATION_EMAIL_SENT_KEY);
    sessionStorage.removeItem('showVerificationStep');
    sessionStorage.removeItem('verificationLoading');
    sessionStorage.removeItem('emailVerificationSent');

    console.log('[verificationState] Verification state cleared');
  } catch (error) {
    console.warn('[verificationState] Failed to clear verification state:', error);
  }
};

/**
 * Check if verification state is stale (older than 1 hour)
 * @returns true if state is older than 1 hour
 */
export const isVerificationStateStale = (): boolean => {
  const state = getVerificationState();
  if (state.timestamp === 0) return false;

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return state.timestamp < oneHourAgo;
};

/**
 * Clean up stale verification state
 * Call this on signin page initialization
 */
export const cleanupStaleVerificationState = (): void => {
  if (isVerificationStateStale()) {
    console.log('[verificationState] Verification state is stale, clearing');
    clearVerificationState();
  }
};
