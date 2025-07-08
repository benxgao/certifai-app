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
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import LandingHeader from '@/src/components/custom/LandingHeader';
import AuthLeftSection from '@/src/components/auth/AuthLeftSection';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import { toast, Toaster } from 'sonner';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      setError('Please enter your last name');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      // Register user in external API and set custom claims
      try {
        const token = await user.getIdToken();
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }),
        });

        if (registerResponse.ok) {
          const result = await registerResponse.json();
          console.log('User registered successfully with api_user_id:', result.api_user_id);
        } else {
          console.warn('Failed to register user in external API, but proceeding with signup');
        }
      } catch (registrationError) {
        console.error('Error during user registration:', registrationError);
        // Don't block signup for registration errors
      }

      // Subscribe user to marketing list (non-blocking)
      // Note: Marketing API now always returns 200 to prevent frontend error popups
      try {
        const { subscribeUserToMarketing } = await import('@/src/lib/marketing-client');
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : undefined;

        const marketingResult = await subscribeUserToMarketing(
          email,
          firstName.trim(),
          lastName.trim(),
          userAgent,
        );

        if (marketingResult.success) {
          console.log('User successfully subscribed to marketing list');
        } else {
          console.warn('Marketing subscription failed (non-blocking):', marketingResult.error);
        }
      } catch (marketingError) {
        console.error('Error during marketing subscription (non-blocking):', marketingError);
        // Marketing subscription errors are non-blocking and won't affect signup flow
      }

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      // Send email verification with retry mechanism
      try {
        await sendEmailVerificationWithRetry(user);

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;

        setShowVerificationStep(true);
        const successMessage =
          'Account created successfully! Please check your email to verify your account.';
        setSuccess(successMessage);
        toast.success('Welcome to Certifai!', {
          description: 'Please check your email and verify your account to complete registration.',
        });
      } catch (verificationError: any) {
        console.error('Email verification error:', verificationError);

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;

        // Handle specific verification errors
        if (
          verificationError.message?.includes('signal is aborted') ||
          verificationError.message?.includes('timeout') ||
          verificationError.code === 'auth/internal-error'
        ) {
          // Still show verification step even if email sending failed
          setShowVerificationStep(true);
          const emailFailedMessage =
            'Account created but verification email may not have been sent. You can resend it below.';
          setError(emailFailedMessage);
          toast.warning('Account created successfully!', {
            description:
              'However, the verification email may not have been sent. You can resend it from the next screen.',
          });
        } else {
          throw verificationError; // Re-throw other errors to be handled by outer catch
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      // Handle signal aborted errors specifically
      if (error.message?.includes('signal is aborted')) {
        setError('Operation was interrupted. Please try again.');
        return;
      }

      switch (error.code) {
        case 'auth/email-already-in-use':
          const emailInUseMessage =
            'This email address is already registered. Please use a different email or try signing in instead.';
          setError(emailInUseMessage);
          toast.error(emailInUseMessage, {
            description: 'If you forgot your password, you can reset it from the sign-in page.',
            action: {
              label: 'Go to Sign In',
              onClick: () => router.push('/signin'),
            },
          });
          break;
        case 'auth/invalid-email':
          const invalidEmailMessage = 'Please enter a valid email address';
          setError(invalidEmailMessage);
          toast.error(invalidEmailMessage);
          break;
        case 'auth/weak-password':
          const weakPasswordMessage = 'Password is too weak. Please choose a stronger password';
          setError(weakPasswordMessage);
          toast.error(weakPasswordMessage, {
            description: 'Try using at least 6 characters with a mix of letters and numbers.',
          });
          break;
        case 'auth/operation-not-allowed':
          const operationMessage =
            'Email/password accounts are not enabled. Please contact support.';
          setError(operationMessage);
          toast.error(operationMessage);
          break;
        case 'auth/network-request-failed':
          const networkMessage = 'Network error. Please check your connection and try again.';
          setError(networkMessage);
          toast.error(networkMessage);
          break;
        default:
          const defaultMessage = error.message || 'An error occurred during signup';
          setError(defaultMessage);
          toast.error('Signup failed', {
            description: defaultMessage,
          });
      }
    } finally {
      // Check if component is still mounted before updating loading state
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;

    setResendingVerification(true);
    setError('');

    try {
      await sendEmailVerificationWithRetry(auth.currentUser);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      const successMessage = 'Verification email sent! Please check your inbox.';
      setSuccess(successMessage);
      toast.success('Verification email sent!', {
        description: 'Please check your inbox (and spam folder) for the verification email.',
      });
    } catch (error: any) {
      console.error('Error resending verification:', error);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      // Handle signal aborted errors specifically
      if (error.message?.includes('signal is aborted')) {
        const interruptedMessage = 'Operation was interrupted. Please try again.';
        setError(interruptedMessage);
        toast.error(interruptedMessage);
      } else if (error.message?.includes('timeout')) {
        const timeoutMessage = 'Request timed out. Please check your connection and try again.';
        setError(timeoutMessage);
        toast.error(timeoutMessage);
      } else if (error.code === 'auth/internal-error') {
        const internalErrorMessage = 'Internal error occurred. Please try again in a moment.';
        setError(internalErrorMessage);
        toast.error(internalErrorMessage);
      } else {
        const failedMessage = 'Failed to resend verification email. Please try again.';
        setError(failedMessage);
        toast.error(failedMessage);
      }
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

  // Helper function to retry email verification with exponential backoff
  const sendEmailVerificationWithRetry = async (user: any, maxRetries = 2): Promise<void> => {
    // Configure action code settings to use the new URL structure
    const actionCodeSettings = {
      url: `${window.location.origin}?mode=verifyEmail`,
      handleCodeInApp: true,
    };

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add timeout for each attempt
        const verificationPromise = sendEmailVerification(user, actionCodeSettings);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Email verification timeout')), 15000); // 15 second timeout per attempt
        });

        await Promise.race([verificationPromise, timeoutPromise]);
        return; // Success, exit the retry loop
      } catch (error: any) {
        console.error(`Email verification attempt ${attempt + 1} failed:`, error);

        // If this is the last attempt or it's a non-retryable error, throw the error
        if (
          attempt === maxRetries ||
          (!error.message?.includes('signal is aborted') &&
            !error.message?.includes('timeout') &&
            !error.message?.includes('network') &&
            error.code !== 'auth/internal-error')
        ) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  if (showVerificationStep) {
    return (
      <div className="flex flex-col min-h-screen auth-page-mobile">
        {/* Header */}
        <LandingHeader showFeaturesLink={false} />

        <div className="flex-1 w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 lg:bg-none auth-container">
          {/* Left Column - Welcome Section */}
          <AuthLeftSection mode="signup" />

          {/* Right Column - Verification Step */}
          <div className="flex items-center justify-center py-3 sm:py-6 lg:py-12 px-3 sm:px-6 lg:px-8 relative bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 min-h-full lg:min-h-0 auth-container auth-form-mobile">
            {/* Subtle background decoration for mobile */}
            <div className="absolute inset-0 lg:hidden overflow-hidden">
              <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-300/20 rounded-full"></div>
              <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full"></div>
            </div>

            {/* Additional subtle patterns for desktop right section */}
            <div className="absolute inset-0 hidden lg:block overflow-hidden">
              <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-xl rotate-12 animate-pulse delay-3000"></div>
              <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-lg rotate-45 animate-pulse delay-4000"></div>
            </div>

            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative z-10">
              <CardHeader className="text-center space-y-1 pb-2 sm:pb-3 lg:pb-6 px-4 sm:px-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent auth-title-mobile">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  We&apos;ve sent a verification link to {email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 lg:space-y-6 px-4 sm:px-6 auth-content-mobile">
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
      <LandingHeader showFeaturesLink={false} />

      <div className="flex-1 w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 lg:bg-none auth-container">
        {/* Left Column - Welcome Section */}
        <AuthLeftSection mode="signup" />

        {/* Right Column - Signup Form */}
        <div className="flex items-center justify-center py-3 sm:py-6 lg:py-12 px-3 sm:px-6 lg:px-8 relative bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 min-h-full lg:min-h-0 auth-container auth-form-mobile">
          {/* Subtle background decoration for mobile */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-300/20 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full"></div>
          </div>

          {/* Additional subtle patterns for desktop right section */}
          <div className="absolute inset-0 hidden lg:block overflow-hidden">
            <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-xl rotate-12 animate-pulse delay-3000"></div>
            <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-lg rotate-45 animate-pulse delay-4000"></div>
          </div>

          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative z-10">
            <CardHeader className="text-center space-y-1 pb-2 sm:pb-3 lg:pb-6 px-4 sm:px-6">
              {/* Small decorative element */}
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto mb-3 sm:mb-4"></div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent auth-title-mobile">
                Create Account
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Sign up to get started with Certestic
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp} autoComplete="off">
              <CardContent className="space-y-2 sm:space-y-3 lg:space-y-6 px-4 sm:px-6 auth-content-mobile">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="given-name"
                      className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="family-name"
                      className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="off"
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    autoComplete="new-password"
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    autoComplete="new-password"
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>

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
                    className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer"
                  >
                    I agree to the{' '}
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
                  <div className="text-sm p-3 rounded-xl border animate-in slide-in-from-top-2 duration-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 border-red-200 dark:border-red-800/50">
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
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

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={
                    loading ||
                    !firstName.trim() ||
                    !lastName.trim() ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !acceptTerms
                  }
                  size="lg"
                >
                  <ButtonLoadingText
                    isLoading={loading}
                    loadingText="Creating Account..."
                    defaultText="Create Account"
                    showSpinner={true}
                    spinnerSize="sm"
                  />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-400 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/50 px-4 sm:px-6">
                Already have an account?&nbsp;
                <Link
                  href="/signin"
                  className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
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
