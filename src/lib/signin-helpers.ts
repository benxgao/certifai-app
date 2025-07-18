/**
 * Signin-specific helper functions extracted for reusability
 */

import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { resetAuthenticationState } from '@/src/lib/auth-utils';
import { setAuthCookie } from '@/src/lib/auth-setup';

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
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  return {
    isRecovery: urlParams.get('recovery') === 'true',
    hasSessionExpired: urlParams.get('error') === 'session_expired',
    errorParam: urlParams.get('error'),
    signupParam: urlParams.get('signup'),
    verificationParam: urlParams.get('verification'),
    passwordResetParam: urlParams.get('passwordReset'),
  };
};

/**
 * Clear client-side auth tokens and storage
 */
export const clearClientAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('apiUserId');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('firebaseToken');
    sessionStorage.removeItem('apiUserId');
    sessionStorage.removeItem('authToken');
  }
};

/**
 * Clear legacy auth state on signin page load
 */
export const clearLegacyAuthState = async (urlParams: URLParams): Promise<string | null> => {
  try {
    let errorMessage: string | null = null;

    if (urlParams.isRecovery) {
      console.log('Recovery mode detected - performing thorough cache cleanup');
      errorMessage = 'Session recovered. Please sign in again.';
    } else if (urlParams.hasSessionExpired) {
      console.log('Session expiration detected - clearing auth state immediately');
      errorMessage = 'Your session has expired. Please sign in again.';
    }

    // Clear client-side tokens immediately
    clearClientAuthTokens();

    // Sign out any existing Firebase auth session
    try {
      await signOut(auth);
      console.log('Existing Firebase auth session signed out');
    } catch {
      console.log('No existing Firebase session to sign out');
    }

    // Clear server-side cookies and cache
    await resetAuthenticationState();

    // Clear server-side token cache for recovery/session expiry
    if (urlParams.isRecovery || urlParams.hasSessionExpired) {
      try {
        await fetch('/api/auth/clear-cache', {
          method: 'POST',
          credentials: 'include',
        });
        console.log('Server-side token cache cleared for recovery/session expiry');
      } catch (error) {
        console.warn('Failed to clear server cache during recovery/session expiry:', error);
      }
    }

    console.log('Legacy auth state cleared on signin page load');
    return errorMessage;
  } catch (error) {
    console.error('Failed to clear legacy auth state on signin page load:', error);
    return null;
  }
};

/**
 * Process URL parameters and set appropriate error messages
 */
export const processURLParamsError = (urlParams: URLParams): string | null => {
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
    urlParams.passwordResetParam;

  if (hasParams) {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
};

/**
 * Handle email verification for unverified users
 */
export const handleUnverifiedUser = async (): Promise<AuthError> => {
  try {
    await signOut(auth);
    await resetAuthenticationState();
    console.log('Signed out unverified user and cleared auth state');
  } catch (signOutError) {
    console.error('Failed to sign out unverified user:', signOutError);
  }

  return {
    message:
      'Please verify your email address before signing in. Check your inbox for a verification link.',
    showVerificationPrompt: true,
  };
};

/**
 * Handle cookie setting during signin
 */
export const handleCookieSetup = async (firebaseToken: string): Promise<AuthError | null> => {
  try {
    const cookieResult = await setAuthCookie(firebaseToken);

    if (!cookieResult.success) {
      const errorMessage = cookieResult.error || 'Failed to set authentication cookie.';

      // Clear auth state on cookie failure
      try {
        await resetAuthenticationState();
        await signOut(auth);
      } catch (clearError) {
        console.error('Failed to clear auth state after cookie error:', clearError);
      }

      return { message: errorMessage };
    }

    return null; // Success
  } catch (cookieError: any) {
    let errorMessage = 'Failed to set authentication cookie.';

    if (
      cookieError.message?.includes('timeout') ||
      cookieError.message?.includes('signal is aborted') ||
      cookieError.name === 'TimeoutError'
    ) {
      errorMessage = 'Authentication timed out. Please try again.';
    } else if (cookieError.name === 'NetworkError') {
      errorMessage =
        'Network error during authentication. Please check your connection and try again.';
    }

    // Clear auth state on cookie failure
    try {
      await resetAuthenticationState();
      await signOut(auth);
    } catch (clearError) {
      console.error('Failed to clear auth state after cookie error:', clearError);
    }

    return { message: errorMessage };
  }
};

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
 */
export const clearAuthStateOnError = async (): Promise<void> => {
  try {
    await resetAuthenticationState();
    await signOut(auth);
    console.log('Auth state cleared after signin error');
  } catch (clearError) {
    console.error('Failed to clear auth state after signin error:', clearError);
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
    console.error('Failed to resend verification email:', error);
    return 'Failed to send verification email. Please try again.';
  }
};

/**
 * Perform the main signin operation
 */
export const performSignin = async (
  form: SigninFormData,
): Promise<{ success: boolean; error?: AuthError }> => {
  try {
    // Clear any existing auth state/cookies before signing in
    await resetAuthenticationState();

    // Start the authentication process
    const signedIn = await signInWithEmailAndPassword(auth, form.email, form.password);

    // Check if email is verified
    if (!signedIn.user.emailVerified) {
      const error = await handleUnverifiedUser();
      return { success: false, error };
    }

    // Force refresh to get a brand new Firebase token
    const firebaseToken = await signedIn.user.getIdToken(true);

    // Set the authentication cookie
    const cookieError = await handleCookieSetup(firebaseToken);
    if (cookieError) {
      return { success: false, error: cookieError };
    }

    // Small delay to ensure cookie is properly set
    await new Promise((resolve) => setTimeout(resolve, 150));

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
    !error.includes('reset successful') &&
    !error.includes('Session recovered')
  );
};

/**
 * Clear URL error parameters
 */
export const clearURLErrorParams = (): void => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    if (url.searchParams.has('error') || url.searchParams.has('recovery')) {
      url.searchParams.delete('error');
      url.searchParams.delete('recovery');
      window.history.replaceState({}, '', url.pathname);
    }
  }
};

/**
 * Check if user should be redirected to main page
 */
export const shouldRedirectToMain = (
  loading: boolean,
  authProcessing: boolean,
  isLoading: boolean,
  firebaseUser: any,
  apiUserId: string | null,
  isRedirecting: boolean,
  error: string,
): boolean => {
  const isAuthError = isAuthenticationError(error);

  return (
    !loading &&
    !authProcessing &&
    !isLoading &&
    firebaseUser &&
    firebaseUser.emailVerified &&
    (apiUserId || error.includes('Authentication timed out')) &&
    !isRedirecting &&
    !isAuthError
  );
};

/**
 * Initialize signin page - handles both auth state clearing and URL params
 */
export const initializeSigninPage = async (): Promise<string | null> => {
  const urlParams = parseAuthURLParams();

  // Handle legacy auth state clearing
  const legacyErrorMessage = await clearLegacyAuthState(urlParams);

  // Handle URL params error messages
  const urlErrorMessage = processURLParamsError(urlParams);

  // Clean up URL params
  cleanupURLParams(urlParams);

  // Return the first available error message
  return legacyErrorMessage || urlErrorMessage;
};
