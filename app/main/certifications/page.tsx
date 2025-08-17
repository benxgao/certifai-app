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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/main' },
            { label: 'Certifications', current: true },
          ]}
        />

        {/* Page Header - Enhanced glass-morphism */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-3xl overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="px-8 py-8 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                    Available Certifications
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl">
                    Explore industry-recognized certifications and advance your professional journey
                    with expert-crafted content.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 px-4 py-2.5 text-sm font-medium text-violet-700 dark:text-violet-400 border border-violet-200/60 dark:border-violet-700/60 shadow-sm backdrop-blur-sm">
                    <FaAward className="w-4 h-4 mr-2" />
                    Explore & Register
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Section - Enhanced layout */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Available */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-800/90">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                        <FaAward className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Available
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
                      {availableCertifications?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Your Registrations */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-800/90">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <FaGraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Registered
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
                      {userCertifications?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Progress Rate */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-800/90">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                        <FaCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Progress
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
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
        </div>

        <Toaster
          richColors
          position="top-right"
          closeButton
          toastOptions={{
            duration: 4000,
            classNames: {
              toast:
                'group-[.toaster]:bg-white/95 group-[.toaster]:dark:bg-slate-800/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:border group-[.toaster]:border-slate-200/60 group-[.toaster]:dark:border-slate-700/60 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-slate-900/10 group-[.toaster]:dark:shadow-black/20 group-[.toaster]:rounded-xl',
              title:
                'group-[.toast]:text-slate-900 group-[.toast]:dark:text-slate-50 group-[.toast]:font-semibold',
              description: 'group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-300',
              actionButton:
                'group-[.toast]:bg-gradient-to-r group-[.toast]:from-violet-600 group-[.toast]:to-blue-600 group-[.toast]:hover:from-violet-700 group-[.toast]:hover:to-blue-700 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:shadow-md group-[.toast]:transition-all group-[.toast]:duration-200',
              cancelButton:
                'group-[.toast]:bg-slate-100 group-[.toast]:dark:bg-slate-700 group-[.toast]:text-slate-700 group-[.toast]:dark:text-slate-300 group-[.toast]:hover:bg-slate-200 group-[.toast]:dark:hover:bg-slate-600 group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:shadow-sm group-[.toast]:transition-all group-[.toast]:duration-200',
              closeButton:
                'group-[.toast]:bg-slate-100/80 group-[.toast]:dark:bg-slate-700/80 group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400 group-[.toast]:hover:bg-slate-200 group-[.toast]:dark:hover:bg-slate-600 group-[.toast]:backdrop-blur-sm group-[.toast]:rounded-lg group-[.toast]:transition-all group-[.toast]:duration-200',
              success:
                'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-emerald-50/95 group-[.toaster]:to-green-50/95 group-[.toaster]:dark:from-emerald-950/30 group-[.toaster]:dark:to-green-950/30 group-[.toaster]:border-emerald-200/60 group-[.toaster]:dark:border-emerald-700/60',
              error:
                'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50/95 group-[.toaster]:to-rose-50/95 group-[.toaster]:dark:from-red-950/30 group-[.toaster]:dark:to-rose-950/30 group-[.toaster]:border-red-200/60 group-[.toaster]:dark:border-red-700/60',
              warning:
                'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50/95 group-[.toaster]:to-yellow-50/95 group-[.toaster]:dark:from-amber-950/30 group-[.toaster]:dark:to-yellow-950/30 group-[.toaster]:border-amber-200/60 group-[.toaster]:dark:border-amber-700/60',
              info: 'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50/95 group-[.toaster]:to-cyan-50/95 group-[.toaster]:dark:from-blue-950/30 group-[.toaster]:dark:to-cyan-950/30 group-[.toaster]:border-blue-200/60 group-[.toaster]:dark:border-blue-700/60',
              loading:
                'group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-violet-50/95 group-[.toaster]:to-purple-50/95 group-[.toaster]:dark:from-violet-950/30 group-[.toaster]:dark:to-purple-950/30 group-[.toaster]:border-violet-200/60 group-[.toaster]:dark:border-violet-700/60',
            },
          }}
          expand={false}
          visibleToasts={4}
        />

        {/* Available Certifications Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Certification Catalog by Provider
            </h2>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-3xl p-8">
            <Suspense fallback={<CertificationCardSkeleton count={4} />}>
              <EnhancedFirmNavigation
                onRegister={handleOpenModal}
                registeringCertId={registeringCertId}
              />
            </Suspense>
          </div>
        </section>

        {/* Modal for Certification Details and Registration */}
        {isModalOpen && selectedCertForModal && (
          <div className="fixed inset-0 bg-slate-900/20 dark:bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20 border-b border-slate-100/60 dark:border-slate-700/60 p-8">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {selectedCertForModal.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-xl bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold border border-violet-200/60 dark:border-violet-700/60 backdrop-blur-sm">
                    ID: {selectedCertForModal.cert_id}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Detailed information about the &quot;{selectedCertForModal.name}&quot;
                    certification would go here. This could include prerequisites, topics covered,
                    exam format, etc.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-100/60 dark:border-slate-700/60">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleRegisterFromModal}
                    disabled={isRegistering && registeringCertId === selectedCertForModal.cert_id}
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
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
