'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast, Toaster } from 'sonner';
import {
  useAllAvailableCertifications,
  useRegisterUserForCertification,
  CertificationListItem,
  UserCertificationRegistrationInput,
} from '@/swr/certifications';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import Breadcrumb from '@/components/custom/Breadcrumb';
import { FaAward, FaGraduationCap, FaCheck } from 'react-icons/fa';

export default function CertificationsPage() {
  const { apiUserId } = useFirebaseAuth();

  const {
    userCertifications, // Keep for checking existing registrations
    mutateUserCertifications,
  } = useUserCertifications();

  const {
    availableCertifications,
    isLoadingAvailableCertifications,
    isAvailableCertificationsError,
  } = useAllAvailableCertifications();

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
      toast.error('User not authenticated. Please log in.');
      handleCloseModal();
      return;
    }
    if (userCertifications?.some((uc: any) => uc.cert_id === selectedCertForModal.cert_id)) {
      toast.info(`You are already registered for "${selectedCertForModal.name}".`);
      handleCloseModal();
      return;
    }

    setRegisteringCertId(selectedCertForModal.cert_id);
    try {
      const input: UserCertificationRegistrationInput = {
        certificationId: selectedCertForModal.cert_id,
      };
      await registerForCertification(input);
      toast.success(`Successfully registered for "${selectedCertForModal.name}"!`);
      mutateUserCertifications();
    } catch (err: any) {
      console.error('Failed to register for certification:', err);
      toast.error(err.message || 'Failed to register for certification. Please try again.');
    } finally {
      setRegisteringCertId(null);
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (registrationError) {
      toast.error(registrationError.message || 'Failed to register. Please try again.');
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
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Available Certifications
                </h1>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 shadow-sm">
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
                    <FaAward className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                    <FaCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
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
              Certification Catalog
            </h2>
          </div>
          {isLoadingAvailableCertifications ? (
            <div className="space-y-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`available-skeleton-${index}`}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-xl overflow-hidden"
                >
                  {/* Header skeleton */}
                  <div className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-1/4"></div>
                      </div>
                      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse w-24"></div>
                    </div>
                  </div>
                  {/* Content skeleton */}
                  <div className="p-6">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : availableCertifications && availableCertifications.length > 0 ? (
            <div className="space-y-6">
              {availableCertifications.map((cert: CertificationListItem, index) => {
                const isAlreadyRegistered = userCertifications?.some(
                  (uc: any) => uc.cert_id === cert.cert_id,
                );

                return (
                  <Card
                    key={`available-${index}`}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
                  >
                    <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-relaxed flex-1 mr-4">
                          <div className="space-y-3">
                            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-normal border border-blue-100 dark:border-blue-800/50">
                              Certification #{index + 1}
                            </div>
                            <div className="text-slate-900 dark:text-slate-100 font-semibold text-xl leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {cert.name || 'Untitled Certification'}
                            </div>
                          </div>
                        </CardTitle>
                        <div className="flex-shrink-0">
                          {isAlreadyRegistered ? (
                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 shadow-sm">
                              <FaCheck className="w-4 h-4 mr-2" /> Registered
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-lg bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50 shadow-sm">
                              <FaAward className="w-4 h-4 mr-2" /> Available
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                      <div className="flex flex-col space-y-4">
                        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                          <p className="text-slate-500 dark:text-slate-400">
                            ID: {cert.cert_id} • Use the button below to{' '}
                            {isAlreadyRegistered
                              ? 'view details'
                              : 'register for this certification'}
                          </p>
                        </div>

                        {!isAlreadyRegistered && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <Button
                              size="lg"
                              onClick={() => handleOpenModal(cert)}
                              className="w-full bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl py-4 font-medium transition-all duration-200 border border-purple-200 dark:border-purple-600 hover:border-purple-300 dark:hover:border-purple-500"
                            >
                              Register for This Certification
                              <svg
                                className="w-5 h-5 ml-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <FaAward className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    No Certifications Available
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    No certifications are currently available for registration. Please check back
                    later.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Modal for Certification Details and Registration */}
        {isModalOpen && selectedCertForModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {selectedCertForModal.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-normal border border-blue-100 dark:border-blue-800/50">
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
                    className="bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-600 hover:border-purple-300 dark:hover:border-purple-500"
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
