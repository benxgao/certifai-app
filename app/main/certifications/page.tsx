'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/src/components/ui/sonner';
import { toastHelpers } from '@/src/lib/toast';
import {
  useAllAvailableCertifications,
  useRegisterUserForCertification,
  CertificationListItem,
  UserCertificationRegistrationInput,
} from '@/swr/certifications';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import Breadcrumb from '@/components/custom/Breadcrumb';
import EnhancedFirmNavigation from '@/components/custom/EnhancedFirmNavigation';
import { CertificationCardSkeleton } from '@/src/components/ui/card-skeletons';
import { FaAward, FaGraduationCap, FaCheck } from 'react-icons/fa';

export default function CertificationsPage() {
  const router = useRouter();
  const { apiUserId } = useFirebaseAuth();

  const {
    userCertifications, // Keep for checking existing registrations
    mutateUserCertifications,
  } = useUserCertifications();

  const { availableCertifications, isAvailableCertificationsError } =
    useAllAvailableCertifications();

  const { registerForCertification, isRegistering, registrationError } =
    useRegisterUserForCertification(apiUserId);

  const [registeringCertId, setRegisteringCertId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificationListItem | null>(
    null,
  );

  const handleOpenModal = (certification: CertificationListItem) => {
    setSelectedCertForModal(certification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCertForModal(null);
    setIsModalOpen(false);
  };

  const handleRegisterFromModal = async () => {
    if (!selectedCertForModal) return;

    if (!apiUserId) {
      toastHelpers.error.authenticationFailed();
      handleCloseModal();
      return;
    }
    if (userCertifications?.some((uc: any) => uc.cert_id === selectedCertForModal.cert_id)) {
      toastHelpers.info.loadingData(); // Fallback until types are updated
      handleCloseModal();
      return;
    }

    setRegisteringCertId(selectedCertForModal.cert_id);
    try {
      const input: UserCertificationRegistrationInput = {
        certificationId: selectedCertForModal.cert_id,
      };
      await registerForCertification(input);
      toastHelpers.success.certificationRegistered(selectedCertForModal.name);
      mutateUserCertifications();
    } catch (err: any) {
      toastHelpers.error.certificationRegistrationFailed(err.message);
    } finally {
      setRegisteringCertId(null);
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (registrationError) {
      toastHelpers.error.certificationRegistrationFailed(registrationError.message);
    }
  }, [registrationError]);

  if (isAvailableCertificationsError) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Certifications</h1>
            <p className="text-muted-foreground max-w-md">
              {isAvailableCertificationsError?.message || 'Error loading certification data.'}
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push('/main')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/main' },
            { label: 'Certifications', current: true },
          ]}
        />

        {/* Page Header */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  Available Certifications
                </h1>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-lg bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/50 shadow-sm">
                  <FaAward className="w-4 h-4 mr-2" />
                  Explore & Register
                </span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Available */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FaAward className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Available
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {availableCertifications?.length || 0}
                  </p>
                </div>
              </div>

              {/* Your Registrations */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Registered
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {userCertifications?.length || 0}
                  </p>
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FaCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Progress
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {userCertifications?.length
                      ? `${Math.round(
                          (userCertifications.filter((cert: any) => cert.status === 'completed')
                            .length /
                            userCertifications.length) *
                            100,
                        )}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toaster richColors />

        {/* Available Certifications Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Certification Catalog by Provider
            </h2>
          </div>

          <Suspense fallback={<CertificationCardSkeleton count={4} />}>
            <EnhancedFirmNavigation
              onRegister={handleOpenModal}
              registeringCertId={registeringCertId}
            />
          </Suspense>
        </section>

        {/* Modal for Certification Details and Registration */}
        {isModalOpen && selectedCertForModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {selectedCertForModal.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-sm font-normal border border-violet-100 dark:border-violet-800/50">
                    ID: {selectedCertForModal.cert_id}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Detailed information about the &quot;{selectedCertForModal.name}&quot;
                    certification would go here. This could include prerequisites, topics covered,
                    exam format, etc.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleRegisterFromModal}
                    disabled={isRegistering && registeringCertId === selectedCertForModal.cert_id}
                    className="bg-transparent hover:bg-violet-50 dark:hover:bg-primary-900/20 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 border border-violet-200 dark:border-violet-600 hover:border-violet-300 dark:hover:border-violet-500"
                  >
                    {isRegistering && registeringCertId === selectedCertForModal.cert_id
                      ? 'Registering...'
                      : 'Register for this Certification'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
