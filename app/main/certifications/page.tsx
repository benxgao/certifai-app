'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'sonner';
import {
  useAllAvailableCertifications,
  useUserRegisteredCertifications,
  useRegisterUserForCertification,
  CertificationListItem,
  UserCertificationRegistrationInput,
} from '@/swr/certifications';
import AppHeader from '@/components/custom/appheader';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

export default function CertificationsPage() {
  const { apiUserId } = useFirebaseAuth();

  const {
    userCertifications,
    isLoadingUserCertifications,
    isUserCertificationsError,
    mutateUserCertifications,
  } = useUserRegisteredCertifications(apiUserId);

  const {
    availableCertifications,
    isLoadingAvailableCertifications,
    isAvailableCertificationsError,
  } = useAllAvailableCertifications();

  const { registerForCertification, isRegistering, registrationError } =
    useRegisterUserForCertification(apiUserId);

  const [registeringCertId, setRegisteringCertId] = useState<string | null>(null);
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
    if (userCertifications?.some((uc: any) => uc.id === selectedCertForModal.id)) {
      toast.info(`You are already registered for "${selectedCertForModal.name}".`);
      handleCloseModal();
      return;
    }

    setRegisteringCertId(selectedCertForModal.id);
    try {
      const input: UserCertificationRegistrationInput = {
        certificationId: selectedCertForModal.id,
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

  useEffect(() => {
    if (userCertifications) {
      console.log(`userCertifications: ${JSON.stringify(userCertifications, null, 2)}`);
    }
  }, [userCertifications]);

  if (isUserCertificationsError || isAvailableCertificationsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AppHeader title="Certifications" />
        <p className="text-red-500">
          {isUserCertificationsError?.message ||
            isAvailableCertificationsError?.message ||
            'Error loading certification data.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <AppHeader title="Manage Your Certifications" />
      <Toaster richColors />

      {/* Section for User's Registered Certifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Your Registered Certifications</h2>
        {isLoadingUserCertifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={`user-skeleton-${index}`} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userCertifications && userCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCertifications.map((cert: CertificationListItem) => (
              <Card
                key={`user-${cert.id}`}
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {cert.id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <p className="text-lg text-muted-foreground">
              You haven&apos;t registered for any certifications yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Explore available certifications below and click to register.
            </p>
          </div>
        )}
      </section>

      {/* Section for Available Certifications to Register For */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Certifications</h2>
        {isLoadingAvailableCertifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`available-skeleton-${index}`} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : availableCertifications && availableCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCertifications.map((cert: CertificationListItem, index) => (
              <Card
                key={`available-${index}`}
                className="shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                onClick={() => handleOpenModal(cert)}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {cert.id}</p>
                  {/* Button removed from here */}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <p className="text-lg text-muted-foreground">
              No certifications are currently available for registration.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
          </div>
        )}
      </section>

      {/* Modal for Certification Details and Registration */}
      {isModalOpen && selectedCertForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedCertForModal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">ID: {selectedCertForModal.id}</p>
              <p className="mb-6">
                Detailed information about the &quot;{selectedCertForModal.name}&quot; certification
                would go here. This could include prerequisites, topics covered, exam format, etc.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button
                  onClick={handleRegisterFromModal}
                  disabled={isRegistering && registeringCertId === selectedCertForModal.id}
                >
                  {isRegistering && registeringCertId === selectedCertForModal.id
                    ? 'Registering...'
                    : 'Register for this Certification'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
