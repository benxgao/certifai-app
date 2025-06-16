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
import SkeletonCard from '@/components/custom/SkeletonCard';
import { useUserCertifications } from '@/context/UserCertificationsContext';

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
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Your Certifications</h1>
        </div>

        <Toaster richColors />

        {/*
      userCertifications: [
        {
          "user_id": "7143dfb3-86a6-43ae-b970-b388f381a31a",
          "cert_id": 2,
          "status": "IN_PROGRESS",
          "assignedAt": "2025-05-23T04:30:31.650Z",
          "updatedAt": "2025-05-23T04:30:31.650Z",
          "certification": {
            "cert_id": 2,
            "cert_category_id": 2,
            "name": "Google Cloud Professional Cloud Developer",
            "exam_guide_url": "https://cloud.google.com/learn/certification/guides/cloud-developer",
            "min_quiz_counts": 15,
            "max_quiz_counts": 60,
            "pass_score": 80
          }
        }
      ]
      */}
        {/* <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Your Registered Certifications</h2>
        {isLoadingUserCertifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={`user-skeleton-${index}`} />
            ))}
          </div>
        ) : userCertifications && userCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCertifications.map((cert: UserRegisteredCertification) => (
              <Card
                key={`user-${cert.cert_id}`}
                className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleNavigateToExams(cert.cert_id)} // Add onClick handler
              >
                <CardHeader>
                  <CardTitle className="text-xl">{cert.certification.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {cert.cert_id}</p>
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
      </section> */}

        {/* Section for Available Certifications to Register For */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Available Certifications</h2>
          {isLoadingAvailableCertifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`available-skeleton-${index}`} />
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
                    <CardTitle className="text-xl">{cert.name || ''}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">ID: {cert.cert_id}</p>
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
                <p className="text-sm text-muted-foreground mb-2">
                  ID: {selectedCertForModal.cert_id}
                </p>
                <p className="mb-6">
                  Detailed information about the &quot;{selectedCertForModal.name}&quot;
                  certification would go here. This could include prerequisites, topics covered,
                  exam format, etc.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button
                    onClick={handleRegisterFromModal}
                    disabled={isRegistering && registeringCertId === selectedCertForModal.cert_id}
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
