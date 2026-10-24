'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Mail, RefreshCw, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingHeader from '@/src/components/custom/LandingHeader';
import AuthLeftSection from '@/src/components/auth/AuthLeftSection';
import AuthPageShell from '@/src/components/auth/AuthPageShell';
import AuthCard, { AuthCardHeader } from '@/src/components/auth/AuthCard';
import AuthField from '@/src/components/auth/AuthField';
import PasswordField from '@/src/components/auth/PasswordField';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';
import { AlertMessage } from '@/src/components/custom/AlertMessage';
import { authButton, authCard, authField, authLink, authNote } from '@/src/config/auth-theme';
import { cn } from '@/src/lib/utils';
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
import { isUATEnv } from '@/src/utils/env';
import { FeatureFlags } from '@/src/config/featureFlags';
import { useDemoCredentialsReveal } from '@/src/hooks/useDemoCredentialsReveal';
import {
  DEFAULT_DEMO_CREDENTIALS_DISPLAY,
  formatDemoCredentialsForDisplay,
} from '@/src/lib/demoCredentialsProvider';

/**
 * Toast styling shared by both signup states (form and verification step).
 * Declared once so the two branches can never drift apart.
 */
const TOAST_CLASS_NAMES = {
  toast:
    'group-[.toaster]:bg-white/95 group-[.toaster]:dark:bg-slate-800/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:border group-[.toaster]:border-slate-200/60 group-[.toaster]:dark:border-slate-700/60 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-slate-900/10 group-[.toaster]:dark:shadow-black/20 group-[.toaster]:rounded-xl',
  title:
    'group-[.toast]:text-slate-900 group-[.toast]:dark:text-slate-50 group-[.toast]:font-semibold',
  description: 'group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-300',
  actionButton:
    'group-[.toast]:bg-linear-to-r group-[.toast]:from-violet-600 group-[.toast]:to-blue-600 group-[.toast]:hover:from-violet-700 group-[.toast]:hover:to-blue-700 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:shadow-md group-[.toast]:transition-all group-[.toast]:duration-200',
  cancelButton:
    'group-[.toast]:bg-slate-100 group-[.toast]:dark:bg-slate-700 group-[.toast]:text-slate-700 group-[.toast]:dark:text-slate-300 group-[.toast]:hover:bg-slate-200 group-[.toast]:dark:hover:bg-slate-600 group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:shadow-sm group-[.toast]:transition-all group-[.toast]:duration-200',
  closeButton:
    'group-[.toast]:bg-slate-100/80 group-[.toast]:dark:bg-slate-700/80 group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400 group-[.toast]:hover:bg-slate-200 group-[.toast]:dark:hover:bg-slate-600 group-[.toast]:backdrop-blur-sm group-[.toast]:rounded-lg group-[.toast]:transition-all group-[.toast]:duration-200',
  success:
    'group-[.toaster]:bg-linear-to-r group-[.toaster]:from-emerald-50/95 group-[.toaster]:to-green-50/95 group-[.toaster]:dark:from-emerald-950/30 group-[.toaster]:dark:to-green-950/30 group-[.toaster]:border-emerald-200/60 group-[.toaster]:dark:border-emerald-700/60',
  error:
    'group-[.toaster]:bg-linear-to-r group-[.toaster]:from-red-50/95 group-[.toaster]:to-rose-50/95 group-[.toaster]:dark:from-red-950/30 group-[.toaster]:dark:to-rose-950/30 group-[.toaster]:border-red-200/60 group-[.toaster]:dark:border-red-700/60',
  warning:
    'group-[.toaster]:bg-linear-to-r group-[.toaster]:from-amber-50/95 group-[.toaster]:to-yellow-50/95 group-[.toaster]:dark:from-amber-950/30 group-[.toaster]:dark:to-yellow-950/30 group-[.toaster]:border-amber-200/60 group-[.toaster]:dark:border-amber-700/60',
  info: 'group-[.toaster]:bg-linear-to-r group-[.toaster]:from-blue-50/95 group-[.toaster]:to-cyan-50/95 group-[.toaster]:dark:from-blue-950/30 group-[.toaster]:dark:to-cyan-950/30 group-[.toaster]:border-blue-200/60 group-[.toaster]:dark:border-blue-700/60',
  loading:
    'group-[.toaster]:bg-linear-to-r group-[.toaster]:from-violet-50/95 group-[.toaster]:to-purple-50/95 group-[.toaster]:dark:from-violet-950/30 group-[.toaster]:dark:to-purple-950/30 group-[.toaster]:border-violet-200/60 group-[.toaster]:dark:border-violet-700/60',
} as const;

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
  const {
    isRevealed: isDemoCredentialsRevealed,
    isLoading: isDemoCredentialsLoading,
    error: demoCredentialsError,
    credentials: demoCredentials,
    revealCredentials,
  } = useDemoCredentialsReveal();
  const isDemoConsentEnabled = FeatureFlags.DEMO_CREDENTIALS_CONSENT_ENABLED;
  const shouldRequireDemoConsent = isDemoConsentEnabled && !isDemoCredentialsRevealed;
  const demoCredentialsDisplay = demoCredentials
    ? formatDemoCredentialsForDisplay(demoCredentials)
    : DEFAULT_DEMO_CREDENTIALS_DISPLAY;
  const demoMessage = shouldRequireDemoConsent
    ? 'Try our platform instantly with demo account credentials'
    : `Try our platform instantly with demo account - username/password: ${demoCredentialsDisplay}`;

  // Memoized onChange handlers to prevent unnecessary re-renders
  const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  }, []);

  const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const handleCertificationChange = useCallback((certId: number | null) => {
    setSelectedCertId(certId);
  }, []);

  const handleAcceptTermsChange = useCallback((checked: boolean) => {
    setAcceptTerms(checked);
  }, []);

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

    // Force immediate synchronous state update to show spinner instantly
    flushSync(() => {
      setLoading(true);
    });

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

        // UAT BYPASS: If UAT environment and registration succeeded, redirect directly to signin
        if (isUATEnv()) {
          setLoading(false);
          signupDebugger.success('uat-bypass', 'UAT environment detected, redirecting to signin');
          setIsRedirectingToSignin(true);
          // 5 second delay to allow Firestore and Prisma account creation, plus custom claims propagation
          await new Promise((resolve) => setTimeout(resolve, 5000));
          // `createUserWithEmailAndPassword` leaves an active Firebase session.
          // Without signing out, /signin immediately bounces the (already signed
          // in) user to /main, so the documented "signup → signin" hand-off never
          // happens. Clearing the session here also avoids the AuthGuard treating
          // a just-created, not-yet-verified account as fully authenticated.
          await signOut(auth).catch(() => {});
          // Hard navigation: `router.push` can win the race against the auth
          // context's state update, so /signin still saw a signed-in user and
          // redirected back to /main. A full load re-reads an empty session.
          window.location.replace('/signin');
          return;
        }
      } catch (registrationError: any) {
        signupDebugger.error('api-registration', registrationError.message, registrationError);
        // Continue with email verification even if registration fails
        // Set a timeout to prevent hanging forever on registration
        if (registrationError.message?.includes('timeout')) {
        }
      }

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      // Step 2: Send email verification with timeout (skipped in UAT)
      // In UAT, email is auto-verified by backend, so we skip this step
      if (!isUATEnv()) {
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

      const autoVerifyFlag = isUATEnv();
      console.debug('[handleUserRegistration] UAT Environment:', isUATEnv(), 'Auto-verify flag:', autoVerifyFlag);

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
          autoVerify: autoVerifyFlag,
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
      <AuthPageShell header={<LandingHeader />} aside={<AuthLeftSection mode="signup" />}>
        <AuthCard>
          <AuthCardHeader
            align="center"
            eyebrow="One more step"
            title="Check your email"
            subtitle={
              <>
                We&apos;ve sent a verification link to{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{email}</span>
              </>
            }
            icon={
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-500 text-white shadow-[0_16px_32px_-16px_rgba(109,40,217,0.7)]">
                <Mail className="h-7 w-7" aria-hidden="true" />
              </span>
            }
          />

          <div className={cn(authCard.body, 'space-y-5')}>
            {success && <AlertMessage message={success} variant="success" className="text-sm" />}
            {error && <AlertMessage message={error} className="text-sm" />}

            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-700/60 dark:bg-slate-800/40">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Verification email sent
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                Click the link in your email to activate your account. If it hasn&apos;t arrived,
                check your spam folder or send it again.
              </p>

              <Button
                onClick={handleResendVerification}
                disabled={resendingVerification || isRedirectingToSignin}
                variant="outline"
                className={cn(authButton.outline, 'mt-3')}
              >
                <RefreshCw
                  className={cn('h-4 w-4', resendingVerification && 'animate-spin')}
                  aria-hidden="true"
                />
                {resendingVerification ? 'Sending...' : 'Resend verification email'}
              </Button>
            </div>

            <Button
              onClick={handleGoToSignIn}
              disabled={isRedirectingToSignin}
              size="lg"
              className={authButton.primary}
            >
              {isRedirectingToSignin && (
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {isRedirectingToSignin ? 'Redirecting...' : 'Continue to Sign In'}
            </Button>
          </div>

          <div className={authCard.footer}>
            Need help?{' '}
            <Link href="/support" className={authLink.footer}>
              Contact support
            </Link>
          </div>
        </AuthCard>

        <Toaster
          richColors
          position="top-right"
          closeButton
          toastOptions={{ duration: 5000, classNames: TOAST_CLASS_NAMES }}
          expand={false}
          visibleToasts={4}
        />
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      header={<LandingHeader />}
      // banner={
      //   <EnhancedNotificationBar
      //     message={demoMessage}
      //     ctaText=""
      //     ctaLink="/signin"
      //     variant="promo"
      //     showIcon={true}
      //     requireConsent={shouldRequireDemoConsent}
      //     consentButtonText="Show demo login details"
      //     onConsentAccept={revealCredentials}
      //     privacyLink="/privacy"
      //     termsLink="/terms"
      //     isConsentLoading={isDemoCredentialsLoading}
      //     consentError={demoCredentialsError}
      //   />
      // }
      aside={<AuthLeftSection mode="signup" />}
    >
      <AuthCard>
        <AuthCardHeader
          eyebrow="Get started"
          title="Create Account"
          subtitle="Join thousands of professionals advancing their careers."
        />

        <form onSubmit={handleSignUp} autoComplete="off">
          <div className={cn(authCard.body, 'space-y-5')}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AuthField
                id="firstName"
                type="text"
                label="First name"
                requiredMark
                placeholder="John"
                value={firstName}
                onChange={handleFirstNameChange}
                required
                disabled={loading}
                autoComplete="given-name"
                icon={User}
              />
              <AuthField
                id="lastName"
                type="text"
                label="Last name"
                requiredMark
                placeholder="Doe"
                value={lastName}
                onChange={handleLastNameChange}
                required
                disabled={loading}
                autoComplete="family-name"
                icon={User}
              />
            </div>

            <AuthField
              id="email"
              type="email"
              label="Email address"
              requiredMark
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
              autoComplete="off"
              icon={Mail}
            />

            <PasswordField
              id="password"
              label="Password"
              requiredMark
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={loading}
              minLength={6}
              autoComplete="new-password"
              hint="Use at least 6 characters."
            />

            <PasswordField
              id="confirmPassword"
              label="Confirm password"
              requiredMark
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              disabled={loading}
              minLength={6}
              autoComplete="new-password"
            />

            <CertificationSelector
              selectedCertId={selectedCertId}
              onCertificationChange={handleCertificationChange}
              disabled={loading}
              required={true}
              labelClassName={authField.selectLabel}
              triggerClassName={authField.selectTrigger}
            />

            <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5 dark:border-slate-700/60 dark:bg-slate-800/40">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) => handleAcceptTermsChange(checked as boolean)}
                disabled={loading}
                className="mt-0.5"
              />
              <label
                htmlFor="acceptTerms"
                className="cursor-pointer text-[13px] leading-relaxed text-slate-600 dark:text-slate-300"
              >
                <span className="text-rose-500" aria-hidden="true">
                  *{' '}
                </span>
                I agree to the{' '}
                <Link
                  href="/terms"
                  className={authLink.subtle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className={authLink.subtle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {error && <AlertMessage message={error} className="text-sm" />}

            {/* Debug info in development - only show when there's an actual error or loading state */}
            {process.env.NODE_ENV === 'development' && (loading || error) && (
              <div className="rounded-lg bg-slate-100 p-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Loading: {loading.toString()} | Error: {error || 'none'}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className={authButton.primary}
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
            >
              <ButtonLoadingText
                isLoading={loading}
                loadingText="Creating Account..."
                defaultText="Create Account"
                showSpinner={true}
                spinnerSize="sm"
              />
            </Button>

            <p className={authNote.secure}>
              <ShieldCheck
                className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              No credit card required
            </p>
          </div>

          <div className={authCard.footer}>
            Already have an account?{' '}
            <Link href="/signin" className={authLink.footer}>
              Sign in
            </Link>
          </div>
        </form>
      </AuthCard>

      <Toaster
        richColors
        position="top-right"
        closeButton
        toastOptions={{ duration: 5000, classNames: TOAST_CLASS_NAMES }}
        expand={false}
        visibleToasts={4}
      />
    </AuthPageShell>
  );
}
