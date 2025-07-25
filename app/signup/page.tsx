'use client';

import { useState, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { CheckCircle, AlertCircle, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingHeader from '@/src/components/custom/LandingHeader';
import AuthLeftSection from '@/src/components/auth/AuthLeftSection';
import NotificationBar from '@/src/components/custom/NotificationBar';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Toaster } from '@/src/components/ui/sonner';
import CertificationSelector from '@/src/components/custom/CertificationSelector';
import {
  signupDebugger,
  validateSignupForm,
  getFirebaseErrorMessage,
} from '@/src/utils/signup-debug';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [isRedirectingToSignin, setIsRedirectingToSignin] = useState(false);
  const router = useRouter();
  const { firebaseUser } = useFirebaseAuth();
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    // Check environment on component mount
    signupDebugger.checkEnvironment();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Safety mechanism to reset loading state if it gets stuck
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        if (loading && isMountedRef.current) {
          setLoading(false);
          setError('Request timed out. Please try again.');
        }
      }, 60000); // 60 second safety timeout

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Redirect if already signed in
  useEffect(() => {
    if (firebaseUser && !loading && !showVerificationStep && !isRedirectingToSignin) {
      // Silently redirect to main without showing any loading state
      router.replace('/main');
    }
  }, [firebaseUser, loading, showVerificationStep, isRedirectingToSignin, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    signupDebugger.pending('form-validation', 'Starting form validation');

    // Use the validation utility
    const validationResult = validateSignupForm({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      acceptTerms,
      selectedCertId,
    });

    if (!validationResult.isValid) {
      const firstError = validationResult.errors[0];
      setError(firstError);
      signupDebugger.error('form-validation', firstError);
      return;
    }

    signupDebugger.success('form-validation', 'Form validation passed');
    setLoading(true);

    // Safety timeout to prevent hanging forever
    const safetyTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false);
        setError('Signup process timed out. Please try again.');
      }
    }, 60000); // 1 minute timeout

    signupDebugger.pending('firebase-signup', 'Creating Firebase user account');

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      signupDebugger.success('firebase-signup', `User created with UID: ${user.uid}`);

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      signupDebugger.pending('profile-update', 'Updating user profile');

      // Update user profile with display name immediately
      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      signupDebugger.success('profile-update', 'User profile updated successfully');

      // Sequential execution to avoid race conditions and provide better error handling

      // Step 1: Register user in backend API first
      let registrationSuccess = false;
      signupDebugger.pending('api-registration', 'Registering user in backend API');

      try {
        const apiUserId = await handleUserRegistration(user, firstName, lastName, selectedCertId!);
        signupDebugger.success('api-registration', `Registered with API ID: ${apiUserId}`);
        registrationSuccess = true;
      } catch (registrationError: any) {
        signupDebugger.error('api-registration', registrationError.message, registrationError);
        // Continue with email verification even if registration fails
        // Set a timeout to prevent hanging forever on registration
        if (registrationError.message?.includes('timeout')) {
        }
      }

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      // Step 2: Send email verification with timeout
      signupDebugger.pending('email-verification', 'Sending email verification');

      try {
        // Add timeout to email verification to prevent hanging
        const emailVerificationPromise = sendEmailVerificationWithRetry(user);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email verification timed out')), 20000),
        );

        await Promise.race([emailVerificationPromise, timeoutPromise]);
        signupDebugger.success('email-verification', 'Email verification sent successfully');

        // Reset loading state before showing verification step
        setLoading(false);
        setShowVerificationStep(true);
        setSuccess('Account created successfully! Please check your email to verify your account.');

        toast.success('Welcome to Certestic!', {
          description: 'Please check your email and verify your account to complete registration.',
        });

        // Show additional message if registration failed but verification succeeded
        if (!registrationSuccess) {
          setTimeout(() => {
            if (isMountedRef.current) {
              toast.info('Account Setup', {
                description:
                  'Your account was created successfully. Some features may be limited until backend registration completes.',
              });
            }
          }, 2000);
        }
      } catch (verificationError: any) {
        signupDebugger.error('email-verification', verificationError.message, verificationError);

        // Reset loading state before showing verification step
        setLoading(false);
        // Still show verification step but with error message
        setShowVerificationStep(true);
        setError(`Account created but verification email failed: ${verificationError.message}`);

        toast.warning('Account created successfully!', {
          description:
            'However, the verification email failed to send. You can resend it from the next screen.',
        });
      }
    } catch (error: any) {
      signupDebugger.error('signup-process', 'Signup process failed', error);

      // Always reset loading state first to re-enable the button
      setLoading(false);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) {
        return;
      }

      // Parse error and set appropriate message using the utility
      const errorMessage = getFirebaseErrorMessage(error);


      // Force state update to ensure error is visible
      setError(errorMessage);

      // Force re-render by updating timestamp (if error doesn't show)

      // Enhanced toast messages for specific errors
      if (error.code === 'auth/email-already-in-use') {
        toast.error(errorMessage, {
          description: 'If you forgot your password, you can reset it from the sign-in page.',
          action: {
            label: 'Go to Sign In',
            onClick: () => router.push('/signin'),
          },
          duration: 10000, // Show for 10 seconds
        });
      } else if (error.code === 'auth/weak-password') {
        toast.error(errorMessage, {
          description: 'Try using at least 6 characters with a mix of letters and numbers.',
          duration: 8000,
        });
      } else {
        toast.error('Signup failed', {
          description: errorMessage,
          duration: 8000,
        });
      }
    } finally {
      // Clear the safety timeout
      clearTimeout(safetyTimeout);

      // Always ensure loading state is reset to re-enable the button
      // regardless of component mount status
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError('No user found. Please try signing up again.');
      return;
    }

    setResendingVerification(true);
    setError('');
    setSuccess('');

    try {
      // Refresh the user state before sending verification
      await auth.currentUser.reload();

      await sendEmailVerificationWithRetry(auth.currentUser);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      setSuccess('Verification email sent! Please check your inbox.');
      toast.success('Verification email sent!', {
        description: 'Please check your inbox (and spam folder) for the verification email.',
      });
    } catch (error: any) {

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      const errorMessage = getEmailVerificationErrorMessage(error);
      setError(errorMessage);
      toast.error('Failed to send verification email', {
        description: errorMessage,
      });
    } finally {
      // Check if component is still mounted before updating loading state
      if (isMountedRef.current) {
        setResendingVerification(false);
      }
    }
  };

  const handleGoToSignIn = () => {
    setIsRedirectingToSignin(true);
    router.push('/signin?message=verification-sent');
  };

  // Enhanced user registration with better error handling and timeout management
  const handleUserRegistration = async (
    user: any,
    firstName: string,
    lastName: string,
    selectedCertId: number,
  ): Promise<string> => {
    try {
      const token = await user.getIdToken();

      // Create AbortController for timeout management
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          initCertId: selectedCertId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `Registration failed with status: ${registerResponse.status}`;
        throw new Error(errorMessage);
      }

      const result = await registerResponse.json();

      if (!result.api_user_id) {
        throw new Error('Registration succeeded but no user ID was returned');
      }

      return result.api_user_id;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Registration request timed out. Please try again.');
      }

      // Re-throw with original message for other errors
      throw error;
    }
  };

  // Enhanced email verification with better error handling and user account propagation wait
  const sendEmailVerificationWithRetry = async (user: any, maxRetries = 3): Promise<void> => {
    const actionCodeSettings = {
      url: `${window.location.origin}?mode=verifyEmail`,
      handleCodeInApp: true,
    };

    // Wait for user account to propagate in Firebase systems
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Refresh the user object to ensure we have the latest state
        await user.reload();
        await sendEmailVerification(user, actionCodeSettings);

        return; // Success, exit the retry loop
      } catch (error: any) {

        // Check if this is a retryable error
        const isRetriableError =
          error.message?.includes('network') ||
          error.message?.includes('timeout') ||
          error.code === 'auth/internal-error' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/too-many-requests';

        if (attempt === maxRetries || !isRetriableError) {
          // If all retries failed, provide a helpful error message
          const userFriendlyError = getEmailVerificationErrorMessage(error);
          throw new Error(userFriendlyError);
        }

        // Wait before retrying with exponential backoff
        const delay = Math.min(Math.pow(2, attempt) * 1000, 5000); // Cap at 5 seconds
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  // Helper function to provide user-friendly error messages for email verification
  const getEmailVerificationErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User account not found. This might be a temporary issue, please try resending the verification email.';
      case 'auth/too-many-requests':
        return 'Too many verification emails sent. Please wait a few minutes before requesting another.';
      case 'auth/internal-error':
        return 'Internal error occurred. Please try again in a moment.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return error.message || 'Failed to send verification email. Please try again.';
    }
  };

  if (showVerificationStep) {
    return (
      <div className="flex flex-col min-h-screen auth-page-mobile">
        {/* Header */}
        <LandingHeader />

        <div className="flex-1 w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 lg:bg-none auth-container">
          {/* Left Column - Welcome Section */}
          <AuthLeftSection mode="signup" />

          {/* Right Column - Verification Step */}
          <div className="flex items-center justify-center py-4 sm:py-8 lg:py-20 px-4 sm:px-6 lg:px-16 relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full lg:min-h-0 auth-container auth-form-mobile">
            {/* Enhanced background decoration matching main form */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Large gradient orbs for depth */}
              <div className="absolute top-10 right-10 w-48 h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl lg:hidden"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl lg:hidden"></div>

              {/* Desktop patterns */}
              <div className="absolute top-20 right-16 w-32 h-32 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl hidden lg:block"></div>
              <div className="absolute bottom-32 left-16 w-40 h-40 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl hidden lg:block"></div>

              {/* Subtle geometric accent shapes */}
              <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-700/20 rounded-2xl rotate-12 animate-pulse delay-3000 hidden lg:block"></div>
              <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 dark:from-blue-800/20 dark:to-cyan-700/20 rounded-xl rotate-45 animate-pulse delay-4000 hidden lg:block"></div>
            </div>

            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl dark:shadow-slate-900/50 relative z-10 rounded-3xl overflow-hidden">
              <CardHeader className="text-center space-y-4 pb-6 sm:pb-8 lg:pb-10 px-6 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-12">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent auth-title-mobile">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                  We&apos;ve sent a verification link to{' '}
                  <span className="font-semibold text-violet-600 dark:text-violet-400">
                    {email}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8 px-6 sm:px-8 lg:px-12 auth-content-mobile">
                {success && (
                  <div className="text-sm p-3 rounded-xl border animate-in slide-in-from-top-2 duration-300 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-100 border-green-200 dark:border-green-800/50">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">{success}</div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-sm p-3 rounded-xl border animate-in slide-in-from-top-2 duration-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 border-red-200 dark:border-red-800/50">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">{error}</div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 1.26a2 2 0 001.78-1.89V4a2 2 0 011.78-1.89L22 3.74"
                      />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-100 mb-2">
                        Verification email sent!
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                        We&apos;ve sent a verification link to{' '}
                        <span className="font-medium">{email}</span>. Click the link in your email
                        to activate your account.
                      </p>
                      <div className="space-y-3">
                        <Button
                          onClick={handleResendVerification}
                          disabled={resendingVerification || isRedirectingToSignin}
                          variant="outline"
                          className="w-full bg-white hover:bg-blue-50 border-blue-300 text-blue-800 hover:text-blue-900 transition-all duration-200 hover:shadow-md"
                          size="sm"
                        >
                          {resendingVerification ? (
                            <div className="flex items-center">
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Resend Verification Email
                            </div>
                          )}
                        </Button>
                        <div className="text-xs text-blue-600 dark:text-blue-300 text-center">
                          Check your spam folder if you don&apos;t see the email
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGoToSignIn}
                  disabled={isRedirectingToSignin}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  size="lg"
                >
                  {isRedirectingToSignin && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  {isRedirectingToSignin ? 'Redirecting...' : 'Continue to Sign In'}
                </Button>

                <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/50">
                  <span>Need help? </span>
                  <Link
                    href="/support"
                    className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
                  >
                    Contact Support
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Toaster richColors />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen auth-page-mobile">
      {/* Header */}
      <LandingHeader />

      {/* Notification Bar */}
      <NotificationBar
        message="🚀 Try our platform instantly with demo account - username/password: demo@certestic.com"
        ctaText=""
        ctaLink="/signin"
        variant="promo"
      />

      <div className="flex-1 w-full lg:relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 lg:bg-none auth-container">
        {/* Left Column - Welcome Section */}
        <AuthLeftSection mode="signup" />

        {/* Right Column - Signup Form */}
        <div className="flex items-center justify-center py-4 sm:py-8 lg:py-20 px-4 sm:px-6 lg:px-16 lg:ml-[50%] relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full lg:min-h-0 auth-container auth-form-mobile">
          {/* Enhanced background decoration matching home page */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large gradient orbs for depth */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl lg:hidden"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl lg:hidden"></div>

            {/* Desktop patterns */}
            <div className="absolute top-20 right-16 w-32 h-32 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl hidden lg:block"></div>
            <div className="absolute bottom-32 left-16 w-40 h-40 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl hidden lg:block"></div>

            {/* Subtle geometric accent shapes */}
            <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-700/20 rounded-2xl rotate-12 animate-pulse delay-3000 hidden lg:block"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 dark:from-blue-800/20 dark:to-cyan-700/20 rounded-xl rotate-45 animate-pulse delay-4000 hidden lg:block"></div>
          </div>

          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl dark:shadow-slate-900/50 relative z-10 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pt-4 sm:pt-6 lg:pt-6 pb-3 sm:pb-6 lg:pb-6 px-6 sm:px-8 lg:px-12">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent auth-title-mobile">
                Create Account
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed"></CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp} autoComplete="off">
              <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6 px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-12 auth-content-mobile">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        // Clear error when user starts typing again
                        if (error) setError('');
                      }}
                      required
                      disabled={loading}
                      autoComplete="given-name"
                      className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        // Clear error when user starts typing again
                        if (error) setError('');
                      }}
                      required
                      disabled={loading}
                      autoComplete="family-name"
                      className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                  >
                    Email address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear error when user starts typing again
                      if (error) setError('');
                    }}
                    required
                    disabled={loading}
                    autoComplete="off"
                    className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                  >
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Clear error when user starts typing again
                      if (error) setError('');
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                    autoComplete="new-password"
                    className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      // Clear error when user starts typing again
                      if (error) setError('');
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                    autoComplete="new-password"
                    className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                </div>

                <CertificationSelector
                  selectedCertId={selectedCertId}
                  onCertificationChange={setSelectedCertId}
                  disabled={loading}
                  required={true}
                />

                <div className="flex items-start space-x-3 py-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled={loading}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer"
                  >
                    <span className="text-red-500">*</span> I agree to the
                    <Link
                      href="/terms"
                      className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {error && (
                  <div className="text-sm p-4 sm:p-5 lg:p-6 rounded-xl border animate-in slide-in-from-top-2 duration-300 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/50">
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">{error}</div>
                    </div>
                  </div>
                )}

                {/* Debug info in development - only show when there's an actual error or loading state */}
                {process.env.NODE_ENV === 'development' && (loading || error) && (
                  <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                    Loading: {loading.toString()} | Error: {error || 'none'}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 text-base sm:text-lg relative overflow-hidden group"
                  disabled={
                    loading ||
                    !firstName.trim() ||
                    !lastName.trim() ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !acceptTerms ||
                    !selectedCertId
                  }
                  size="lg"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <ButtonLoadingText
                    isLoading={loading}
                    loadingText="Creating Account..."
                    defaultText="Create Account"
                    showSpinner={true}
                    spinnerSize="sm"
                  />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-300 pt-4 sm:pt-6 lg:pt-8 border-t border-slate-100/80 dark:border-slate-700/50 px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10 bg-slate-50/50 dark:bg-slate-800/30">
                <span>Already have an account?</span>&nbsp;
                <Link
                  href="/signin"
                  className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
                >
                  Sign in
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
