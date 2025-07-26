'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ActionButton } from './ActionButton';
import { useAllAvailableCertifications } from '@/swr/certifications';
import { FaClipboardList } from 'react-icons/fa';

const LazyAvailableCertificationsButton = () => {
  const router = useRouter();
  const { availableCertifications, isLoadingAvailableCertifications } =
    useAllAvailableCertifications();

  return (
    <ActionButton
      onClick={() => router.push('/main/certifications')}
      disabled={
        isLoadingAvailableCertifications ||
        (availableCertifications && availableCertifications.length === 0)
      }
      isLoading={isLoadingAvailableCertifications}
      loadingText="Loading..."
      variant="secondary"
      size="lg"
      icon={!isLoadingAvailableCertifications ? <FaClipboardList className="w-4 h-4" /> : undefined}
      className="w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base"
    >
      Register for Certification
    </ActionButton>
  );
};

export default LazyAvailableCertificationsButton;
