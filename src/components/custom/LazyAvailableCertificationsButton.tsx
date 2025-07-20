'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAllAvailableCertifications } from '@/swr/certifications';
import { FaClipboardList } from 'react-icons/fa';

const LazyAvailableCertificationsButton = () => {
  const router = useRouter();
  const { availableCertifications, isLoadingAvailableCertifications } =
    useAllAvailableCertifications();

  return (
    <Button
      size="lg"
      className="exam-action-button w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base bg-slate-500 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      onClick={() => router.push('/main/certifications')}
      disabled={
        isLoadingAvailableCertifications ||
        (availableCertifications && availableCertifications.length === 0)
      }
    >
      <FaClipboardList className="w-4 h-4 mr-2" />
      {isLoadingAvailableCertifications ? 'Loading...' : 'Register for Certification'}
    </Button>
  );
};

export default LazyAvailableCertificationsButton;
