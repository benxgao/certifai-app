'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useProfileData } from '@/src/hooks/useProfileData';
import { UserCertificationRegistrationInput } from '@/swr/certifications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Breadcrumb from '@/components/custom/Breadcrumb';
import CertificationsSection from '@/components/custom/CertificationsSection';
import DashboardStats from '@/components/custom/DashboardStats';
import useSWR from 'swr';
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

// Interface for available certifications from the API
interface AvailableCertification {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const MainPage = () => {
  const { firebaseUser } = useFirebaseAuth();
  const {
    profile,
    isLoading: isLoadingProfile,
    isError: profileError,
    displayName,
  } = useProfileData();
  const router = useRouter();

  // State for modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCertificationId, setSelectedCertificationId] = useState<number | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // SWR hook for fetching available certifications
  const {
    data: availableCertifications,
    error: availableCertificationsError,
    isLoading: isLoadingAvailableCertifications,
  } = useSWR<AvailableCertification[]>(isRegisterModalOpen ? '/api/certifications' : null);

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

    try {
      setRegistrationError(null);
      await registerCertification({ certificationId: selectedCertificationId });
      setIsRegisterModalOpen(false);
      // Refresh user certifications
      // Note: You might need to add a mutate function to useUserCertifications if it's using SWR
      window.location.reload(); // Fallback to refresh the page
    } catch (error) {
      setRegistrationError((error as Error).message || 'Failed to register for certification');
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      console.log(`Firebase user ID: ${JSON.stringify(firebaseUser.uid, null, 2)}`);
    }
  }, [firebaseUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Dashboard', current: true }]} />

        {/* Welcome Section */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800/50 rounded-xl p-6">
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
                    <Button className="inline-flex items-center rounded-lg bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-sm font-medium text-white border border-purple-600 hover:border-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white dark:border-purple-700 shadow-sm">
                      Register for Certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Register for Certification</DialogTitle>
                      <DialogDescription>
                        Select a certification to register for. Once registered, you&apos;ll be able
                        to access exams and practice materials.
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
                      ) : availableCertificationsError ? (
                        <div className="text-red-500 text-center py-4">
                          Failed to load available certifications
                        </div>
                      ) : availableCertifications && availableCertifications.length > 0 ? (
                        <div className="max-h-[300px] overflow-y-auto pr-2">
                          <div className="space-y-2">
                            {availableCertifications.map((cert) => (
                              <div
                                key={cert.id}
                                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                                  selectedCertificationId === cert.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                                onClick={() => setSelectedCertificationId(cert.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                      {cert.name}
                                    </h4>
                                    {cert.description && (
                                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {cert.description}
                                      </p>
                                    )}
                                  </div>
                                  {selectedCertificationId === cert.id && (
                                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
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
                        <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                          No certifications available at this time
                        </div>
                      )}

                      {registrationError && (
                        <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
                          {registrationError}
                        </div>
                      )}
                    </div>
                    <DialogFooter className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRegisterCertification}
                        disabled={!selectedCertificationId || isRegistering}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isRegistering ? 'Registering...' : 'Register'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="px-6 py-6">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
                          <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-20" />
                        </div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-8 mx-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
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

          <Suspense
            fallback={
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`suspense-skeleton-${index}`}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-xl overflow-hidden"
                  >
                    {/* Header skeleton */}
                    <div className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-32"></div>
                          <div className="h-7 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-3/4"></div>
                        </div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse w-24"></div>
                      </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="p-6 pt-4">
                      <div className="flex flex-col space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-24"></div>
                                  <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-16"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center mt-2">
                          <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-xl animate-pulse w-64"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <CertificationsSection />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default MainPage;
