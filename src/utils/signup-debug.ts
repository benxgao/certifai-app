/**
 * Debug utilities for signup workflow
 * This file helps debug common signup issues
 */

export interface SignupDebugInfo {
  step: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
  error?: any;
}

class SignupDebugger {
  private logs: SignupDebugInfo[] = [];
  private isEnabled: boolean;

  constructor() {
    // Only enable in development
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  log(step: string, status: 'success' | 'error' | 'pending', message?: string, error?: any) {
    if (!this.isEnabled) return;

    const debugInfo: SignupDebugInfo = {
      step,
      timestamp: new Date().toISOString(),
      status,
      message,
      error: error
        ? {
            code: error.code,
            message: error.message,
            name: error.name,
          }
        : undefined,
    };

    this.logs.push(debugInfo);

    // Also log to console with color coding
    const emoji = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
  }

  success(step: string, message?: string) {
    this.log(step, 'success', message);
  }

  error(step: string, message: string, error?: any) {
    this.log(step, 'error', message, error);
  }

  pending(step: string, message?: string) {
    this.log(step, 'pending', message);
  }

  getLogs(): SignupDebugInfo[] {
    return [...this.logs];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clear() {
    this.logs = [];
  }

  // Helper to check common signup environment issues
  checkEnvironment() {
    if (!this.isEnabled) return;


    // Check Firebase config
    const firebaseConfig = {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };


    // Check API URLs
    const apiConfig = {
      serverApiUrl: !!process.env.NEXT_PUBLIC_SERVER_API_URL,
      backendUrl: !!process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL,
    };


    // Check for missing environment variables
    const missing = [];
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missing.push('NEXT_PUBLIC_FIREBASE_API_KEY');
    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
      missing.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');

    if (missing.length > 0) {
    } else {
    }
  }
}

// Export singleton instance
export const signupDebugger = new SignupDebugger();

// Helper functions for common signup validation
export const validateSignupForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  selectedCertId: number | null;
}) => {
  const errors: string[] = [];

  if (!formData.firstName.trim()) errors.push('First name is required');
  if (!formData.lastName.trim()) errors.push('Last name is required');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) errors.push('Email is required');
  else if (!emailRegex.test(formData.email.trim())) errors.push('Invalid email format');

  if (!formData.password) errors.push('Password is required');
  else if (formData.password.length < 6) errors.push('Password must be at least 6 characters');
  else if (formData.password.length > 128) errors.push('Password must be less than 128 characters');

  if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');

  if (!formData.acceptTerms) errors.push('Must accept terms and conditions');
  if (!formData.selectedCertId) errors.push('Must select a certification');

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFirebaseErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please use a different email or try signing in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password with at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before trying again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again in a moment.';
    default:
      return error.message || 'An unexpected error occurred during signup.';
  }
};
