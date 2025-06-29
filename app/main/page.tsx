'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import {
  UserCertificationRegistrationInput,
  useAllAvailableCertifications,
} from '@/swr/certifications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast, Toaster } from 'sonner';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import {
  DashboardStatSkeleton,
  UserCertificationCardSkeleton,
} from '@/src/components/ui/card-skeletons';
import useSWRMutation from 'swr/mutation';

// Fetcher function for registering a user for a certification
const registerUserForCertification = async (
  url: string,
  { arg }: { arg: UserCertificationRegistrationInput },
) => {
  const response = await fetch('/api/certifications/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register for certification');
  }

  return response.json();
};

const MainPage = () => {
  const { firebaseUser, apiUserId } = useFirebaseAuth();
  const {
    profile,
    isLoading: isLoadingProfile,
    isError: profileError,
    displayName,
  } = useProfileData();
  const { userCertifications, mutateUserCertifications } = useUserCertifications();
  const {
    availableCertifications,
    isLoadingAvailableCertifications,
    isAvailableCertificationsError,
  } = useAllAvailableCertifications();
  const router = useRouter();

  // State for modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCertificationId, setSelectedCertificationId] = useState<number | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const { trigger: registerCertification, isMutating: isRegistering } = useSWRMutation(
    '/api/certifications/register',
    registerUserForCertification,
  );

  // Function to handle certification registration
  const handleRegisterCertification = async () => {
    if (!selectedCertificationId) {
      setRegistrationError('Please select a certification');
      return;
    }

    if (!apiUserId) {
      setRegistrationError('You must be logged in to register for certifications');
      return;
    }

    // Check if user is already registered for this certification
    const isAlreadyRegistered = userCertifications?.some(
      (uc) => uc.cert_id === selectedCertificationId,
    );

    if (isAlreadyRegistered) {
      const selectedCert = availableCertifications?.find(
        (c) => c.cert_id === selectedCertificationId,
      );
      toast.info(`You are already registered for "${selectedCert?.name || 'this certification'}".`);
      setIsRegisterModalOpen(false);
      return;
    }

    try {
      setRegistrationError(null);
      await registerCertification({ certificationId: selectedCertificationId });

      const selectedCert = availableCertifications?.find(
        (c) => c.cert_id === selectedCertificationId,
      );
      toast.success(`Successfully registered for "${selectedCert?.name || 'certification'}"!`);

      setIsRegisterModalOpen(false);
      setSelectedCertificationId(null);

      // Refresh user certifications using the context
      await mutateUserCertifications();
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to register for certification';
      setRegistrationError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      console.log(`Firebase user ID: ${JSON.stringify(firebaseUser.uid, null, 2)}`);
    }
  }, [firebaseUser]);

  // Cleanup effect to handle component unmounting
  useEffect(() => {
    return () => {
      // Reset local state when component unmounts to prevent stale state
      setIsRegisterModalOpen(false);
      setSelectedCertificationId(null);
      setRegistrationError(null);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Dashboard', current: true }]} />

        {/* Welcome Section */}
        <div className="mb-6 bg-gradient-to-r from-violet-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome back, {displayName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {profile ? (
                  <>
                    You have {profile.credit_tokens} credit tokens and {profile.energy_tokens}{' '}
                    energy tokens available.
                  </>
                ) : isLoadingProfile ? (
                  'Loading your account information...'
                ) : profileError ? (
                  'Ready to continue your certification journey.'
                ) : (
                  'Ready to continue your certification journey.'
                )}
              </p>
            </div>
            {!isLoadingProfile && profile && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{profile.credit_tokens}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Credits</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{profile.energy_tokens}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Energy</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
              </div>
              <div className="flex-shrink-0">
                <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      disabled={
                        isLoadingAvailableCertifications ||
                        (availableCertifications && availableCertifications.length === 0)
                      }
                    >
                      {isLoadingAvailableCertifications
                        ? 'Loading...'
                        : 'Register for Certification'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        🎓 Register for Certification
                      </DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Choose from our available certifications to start your learning journey.
                        Once registered, you&apos;ll have access to practice exams and study
                        materials.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      {isLoadingAvailableCertifications ? (
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"
                            />
                          ))}
                        </div>
                      ) : isAvailableCertificationsError ? (
                        <div className="text-red-500 text-center py-4">
                          Failed to load available certifications
                        </div>
                      ) : availableCertifications && availableCertifications.length > 0 ? (
                        availableCertifications.filter(
                          (cert) => !userCertifications?.some((uc) => uc.cert_id === cert.cert_id),
                        ).length > 0 ? (
                          <div className="max-h-[300px] overflow-y-auto pr-2">
                            <div className="space-y-2">
                              {availableCertifications
                                .filter(
                                  (cert) =>
                                    !userCertifications?.some((uc) => uc.cert_id === cert.cert_id),
                                )
                                .map((cert) => (
                                  <div
                                    key={cert.cert_id}
                                    className={`relative p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                      selectedCertificationId === cert.cert_id
                                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm'
                                    }`}
                                    onClick={() => setSelectedCertificationId(cert.cert_id)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                          {cert.name}
                                        </h4>
                                        {cert.firm && (
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md font-medium">
                                              {cert.firm.name}
                                            </span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                          <span className="flex items-center gap-1">
                                            📝 {cert.min_quiz_counts}-{cert.max_quiz_counts}{' '}
                                            questions
                                          </span>
                                          <span className="flex items-center gap-1">
                                            🎯 {cert.pass_score}% pass score
                                          </span>
                                        </div>
                                      </div>
                                      {selectedCertificationId === cert.cert_id && (
                                        <div className="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center ml-3 flex-shrink-0">
                                          <svg
                                            className="w-3 h-3"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                              ✨
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 font-medium">
                              You&apos;re all caught up!
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              You are already registered for all available certifications
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            🎓
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">
                            No certifications available at this time
                          </p>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            Check back later for new opportunities
                          </p>
                        </div>
                      )}

                      {registrationError && (
                        <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 text-sm rounded-md border border-red-200 dark:border-red-800/50">
                          {registrationError}
                        </div>
                      )}
                    </div>
                    <DialogFooter className="flex justify-between items-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRegisterModalOpen(false);
                          setSelectedCertificationId(null);
                          setRegistrationError(null);
                        }}
                        disabled={isRegistering}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRegisterCertification}
                        disabled={!selectedCertificationId || isRegistering}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isRegistering ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Registering...
                          </div>
                        ) : (
                          'Register'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="px-6 py-6">
            <Suspense fallback={<DashboardStatSkeleton count={5} />}>
              <DashboardStats />
            </Suspense>
          </div>
        </div>

        {/* Your Registered Certifications Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Your Registered Certifications
            </h2>
            <Button
              variant="outline"
              onClick={() => router.push('/main/certifications')}
              className="border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Explore More
            </Button>
          </div>

          <Suspense fallback={<UserCertificationCardSkeleton count={3} />}>
            <CertificationsSection />
          </Suspense>
        </section>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default MainPage;
