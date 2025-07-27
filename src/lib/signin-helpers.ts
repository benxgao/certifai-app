/**
 * Signin-specific helper functions extracted for reusability
 */

import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { resetAuthenticationState } from '@/src/lib/auth-utils';

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
    isRecovery: false, // Remove recovery mode
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

    if (urlParams.hasSessionExpired) {
      console.log('Session expiration detected - clearing auth state');
      errorMessage = 'Your session has expired. Please sign in again.';
    }

    // Clear client-side tokens
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

    console.log('Auth state cleared on signin page load');
    return errorMessage;
  } catch (error) {
    console.error('Failed to clear auth state on signin page load:', error);
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
 * Simplified signin operation
 * Cookie setting is now handled by the FirebaseAuthContext automatically
 */
export const performSignin = async (
  form: SigninFormData,
): Promise<{ success: boolean; error?: AuthError }> => {
  try {
    // Clear any existing auth state before signing in to handle user transitions
    console.log('Clearing existing auth state before signin...');
    await resetAuthenticationState();

    // Small delay to ensure auth state clearing is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Start the authentication process
    const signedIn = await signInWithEmailAndPassword(auth, form.email, form.password);

    // Check if email is verified
    if (!signedIn.user.emailVerified) {
      const error = await handleUnverifiedUser();
      return { success: false, error };
    }

    // Cookie setting and API login will be handled automatically by FirebaseAuthContext
    console.log('Signin successful, auth context will handle cookie setup');

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
 * Clear URL error parameters
 */
export const clearURLErrorParams = (): void => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    if (url.searchParams.has('error')) {
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.pathname);
    }
  }
};

/**
 * Simplified check if user should be redirected to main page
 */
export const shouldRedirectToMain = (
  loading: boolean,
  firebaseUser: any,
  apiUserId: string | null,
  isRedirecting: boolean,
  error: string,
): boolean => {
  const isAuthError = isAuthenticationError(error);

  return (
    !loading &&
    firebaseUser &&
    firebaseUser.emailVerified &&
    apiUserId &&
    !isRedirecting &&
    !isAuthError
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
