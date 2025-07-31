import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from './ActionButton';
import EnhancedCertificationCard from './CertificationCard';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { UserRegisteredCertification } from '@/swr/certifications';
import { FaCertificate } from 'react-icons/fa';
import { UserCertificationCardSkeleton } from '@/src/components/ui/card-skeletons';
import { AlertMessage } from './AlertMessage';

const CertificationsSection = () => {
  const router = useRouter();
  const [deletingCerts, setDeletingCerts] = useState<Set<number>>(new Set());
  const { userCertifications, isLoadingUserCertifications, isUserCertificationsError } =
    useUserCertifications();

  // Handle certification deletion (mock implementation)
  const handleDeleteCertification = async (certId: number) => {
    setDeletingCerts((prev) => new Set(prev).add(certId));

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // In real implementation, call the API to delete the certification

      // Remove from deleting set after completion
      setDeletingCerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(certId);
        return newSet;
      });
    } catch (error) {
      // Handle error and remove from deleting set
      setDeletingCerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(certId);
        return newSet;
      });
    }
  };

  // Show skeleton only while certifications are loading
  if (isLoadingUserCertifications) {
    return <UserCertificationCardSkeleton count={3} />;
  }

  if (isUserCertificationsError) {
    return (
      <div className="space-y-4">
        <AlertMessage message="Error loading your registered certifications" variant="error" />
      </div>
    );
  }

  if (!userCertifications || userCertifications.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden p-12">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <FaCertificate className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
              No Certifications Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              You haven&apos;t registered for any certifications yet. Explore the catalog to start
              your learning journey.
            </p>
          </div>
          <ActionButton
            onClick={() => router.push('/main/certifications')}
            variant="primary"
            size="lg"
          >
            Explore Certifications
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userCertifications.map((cert: UserRegisteredCertification) => (
        <EnhancedCertificationCard
          key={`user-${cert.cert_id}`}
          cert={cert}
          onDelete={handleDeleteCertification}
          isDeleting={deletingCerts.has(cert.cert_id)}
        />
      ))}
    </div>
  );
};

export default CertificationsSection;
