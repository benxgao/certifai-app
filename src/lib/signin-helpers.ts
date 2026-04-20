/**
 * Signin-specific helper functions extracted for reusability
 */

import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { resetAuthenticationState, clearClientAuthTokens } from '@/src/lib/auth-state-manager';
import { isUATEnv } from '@/src/utils/env';
import {
  clearVerificationState as clearVerificationStateImpl,
  cleanupStaleVerificationState,
} from '@/src/lib/auth-verification-state';

// Export verification state clearing for backward compatibility
export const clearVerificationState = clearVerificationStateImpl;

export interface SigninFormData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  showVerificationPrompt?: boolean;
}

export interface URLParams {
  isRecovery: boolean;
  hasSessionExpired: boolean;
  errorParam: string | null;
  signupParam: string | null;
  verificationParam: string | null;
  passwordResetParam: string | null;
  messageParam: string | null; // Add support for success messages
}

/**
 * Parse URL parameters and extract auth-related information
 */
export const parseAuthURLParams = (): URLParams => {
  if (typeof window === 'undefined') {
    return {
      isRecovery: false,
      hasSessionExpired: false,
      errorParam: null,
      signupParam: null,
      verificationParam: null,
      passwordResetParam: null,
      messageParam: null,
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  return {
    isRecovery: false, // Remove recovery mode
    hasSessionExpired: urlParams.get('error') === 'session_expired',
    errorParam: urlParams.get('error'),
    signupParam: urlParams.get('signup'),
    verificationParam: urlParams.get('verification'),
    passwordResetParam: urlParams.get('passwordReset'),
    messageParam: urlParams.get('message'),
  };
};

/**
 * Clear legacy auth state on signin page load
 *
 * This function:
 * 1. Processes URL parameters to detect session expiry
 * 2. Clears client-side auth tokens
 * 3. Signs out Firebase session
 * 4. Clears verification state
 * 5. Clears server-side cookies and cache
 */
export const clearLegacyAuthState = async (urlParams: URLParams): Promise<string | null> => {
  try {
    let errorMessage: string | null = null;

    if (urlParams.hasSessionExpired) {
      errorMessage = 'Your session has expired. Please sign in again.';
    }

    // Clear verification state (replaces scattered localStorage keys)
    cleanupStaleVerificationState();

    // Clear all authentication state (client + server)
    await resetAuthenticationState();

    // Sign out any existing Firebase auth session
    try {
      await signOut(auth);
    } catch {}

    return errorMessage;
  } catch (error) {
    console.warn('[clearLegacyAuthState] Error clearing legacy auth state:', error);
    return null;
  }
};

/**
 * Process URL parameters and set appropriate error messages
 */
export const processURLParamsError = (urlParams: URLParams): string | null => {
  // Handle success message first (for logout success, etc.)
  if (urlParams.messageParam) {
    return decodeURIComponent(urlParams.messageParam);
  }

  if (urlParams.errorParam) {
    if (urlParams.errorParam === 'session_expired') {
      return 'Your session has expired. Please sign in again.';
    }
    return decodeURIComponent(urlParams.errorParam);
  }

  if (urlParams.signupParam === 'success') {
    if (urlParams.verificationParam === 'pending') {
      return 'Account created! Please check your email and verify your account before signing in.';
    }
    return 'Account created successfully! You can now sign in.';
  }

  if (urlParams.verificationParam === 'success') {
    return 'Email verified successfully! You can now sign in.';
  }

  if (urlParams.passwordResetParam === 'success') {
    return 'Password reset successful! You can now sign in with your new password.';
  }

  return null;
};

/**
 * Clean up URL parameters after processing
 */
export const cleanupURLParams = (urlParams: URLParams): void => {
  if (typeof window === 'undefined') return;

  const hasParams =
    urlParams.errorParam ||
    urlParams.signupParam ||
    urlParams.verificationParam ||
    urlParams.passwordResetParam ||
    urlParams.messageParam;

  if (hasParams) {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
};

/**
 * Handle email verification for unverified users
 * Clears authentication state and returns verification prompt message
 */
export const handleUnverifiedUser = async (): Promise<AuthError> => {
  try {
    // Clear all auth state before signing out
    await resetAuthenticationState();
    await signOut(auth);
  } catch (error) {
    console.warn('[handleUnverifiedUser] Error cleaning up unverified user:', error);
  }

  return {
    message:
      'Please verify your email address before signing in. Check your inbox for a verification link.',
    showVerificationPrompt: true,
  };
};

/**
 * Parse Firebase auth error into user-friendly message
 */

/**
 * Parse Firebase auth errors into user-friendly messages
 */
export const parseFirebaseAuthError = (error: any): string => {
  // Handle specific signal abortion errors first
  if (error.message?.includes('signal is aborted')) {
    return 'Request timed out. Please check your connection and try again.';
  }

  if (error.message?.includes('timeout')) {
    return 'Connection timeout. Please try again.';
  }

  if (error.message?.includes('network') || error.message?.includes('Network')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.name === 'AbortError') {
    return 'Request was cancelled. Please try again.';
  }

  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/internal-error':
        return 'Internal error occurred. Please try again in a moment.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Clear auth state after signin error
 * Ensures complete cleanup of auth state when signin fails
 */
export const clearAuthStateOnError = async (): Promise<void> => {
  try {
    // Clear all auth tokens and sign out Firebase
    await resetAuthenticationState();
    await signOut(auth);
  } catch (clearError) {
    console.warn('[clearAuthStateOnError] Error clearing auth state:', clearError);
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (): Promise<string> => {
  if (!auth.currentUser) {
    return 'Please sign in first to resend verification email.';
  }

  try {
    const actionCodeSettings = {
      url: `${window.location.origin}?mode=verifyEmail`,
      handleCodeInApp: true,
    };
    await sendEmailVerification(auth.currentUser, actionCodeSettings);
    return 'Verification email sent! Please check your inbox.';
  } catch (error) {
    return 'Failed to send verification email. Please try again.';
  }
};

/**
 * Simplified signin operation
 *
 * This function:
 * 1. Clears any existing auth state (via centralized auth-state-manager)
 * 2. Performs Firebase authentication
 * 3. Checks email verification status
 * 4. Returns success or error
 *
 * Note: Cookie setting and API login are handled automatically by FirebaseAuthContext
 */
export const performSignin = async (
  form: SigninFormData,
): Promise<{ success: boolean; error?: AuthError }> => {
  try {
    // Clear any existing auth state before signing in to handle user transitions
    // Uses centralized auth-state-manager for consistent cleanup
    await resetAuthenticationState();

    // Small delay to ensure auth state clearing is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Start the authentication process
    const signedIn = await signInWithEmailAndPassword(auth, form.email, form.password);

    // Refresh user state from Firebase to ensure emailVerified reflects backend updates
    // This is necessary because backend may auto-verify emails (e.g., in UAT environment)
    // and the client-side token may not immediately reflect those changes
    try {
      await signedIn.user.reload();
      console.debug('[performSignin] User state refreshed. Email verified:', signedIn.user.emailVerified);
    } catch (reloadError) {
      console.warn('[performSignin] Failed to refresh user state:', reloadError);
      // Continue anyway - if reload fails, we'll check with the current state
    }

    // Check if email is verified
    // In UAT, emails are auto-verified by backend, so skip the verification requirement
    if (!signedIn.user.emailVerified && !isUATEnv()) {
      console.debug('[performSignin] Email not verified. Environment:', isUATEnv() ? 'UAT' : 'Non-UAT');
      const error = await handleUnverifiedUser();
      return { success: false, error };
    }

    // UAT bypass: Allow signin even without email verification in UAT environments
    if (!signedIn.user.emailVerified && isUATEnv()) {
      console.debug('[performSignin] UAT environment detected. Bypassing email verification requirement.');
    }

    // Cookie setting and API login will be handled automatically by FirebaseAuthContext

    return { success: true };
  } catch (error: any) {
    const errorMessage = parseFirebaseAuthError(error);
    await clearAuthStateOnError();
    return { success: false, error: { message: errorMessage } };
  }
};

/**
 * Check if error message indicates authentication failure
 */
export const isAuthenticationError = (error: string): boolean => {
  return !!(
    error &&
    !error.includes('created successfully') &&
    !error.includes('sent!') &&
    !error.includes('verified successfully') &&
    !error.includes('reset successful')
  );
};

/**
 * Initialize signin page - handles auth state clearing and URL params
 */
export const initializeSigninPage = async (): Promise<string | null> => {
  const urlParams = parseAuthURLParams();

  // Handle auth state clearing
  const authErrorMessage = await clearLegacyAuthState(urlParams);

  // Handle URL params error messages
  const urlErrorMessage = processURLParamsError(urlParams);

  // Clean up URL params
  cleanupURLParams(urlParams);

  // Return the first available error message
  return authErrorMessage || urlErrorMessage;
};
