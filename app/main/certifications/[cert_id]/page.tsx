'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useAuthSWR } from '@/src/swr/useAuthSWR';
import { ApiResponse } from '@/src/types/api';

interface CertificationData {
  cert_id: number;
  name: string;
  description?: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  firm?: {
    firm_id: number;
    name: string;
    code: string;
  };
}

export default function CertificationPage() {
  const params = useParams();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;

  // Fetch certification data to validate if it exists
  const { data, error, isLoading } = useAuthSWR<ApiResponse<CertificationData>, Error>(
    certId ? `/api/public/certifications/${certId}` : null,
  );

  // Check if this is a 404 error (certification not found) and redirect to not-found page
  const is404Error = (error as any)?.status === 404;

  useEffect(() => {
    if (is404Error) {
      notFound(); // Redirect to the global not-found page
    }
  }, [is404Error]);

  // Handle invalid cert_id parameter
  if (certId === null || isNaN(certId)) {
    notFound();
  }

  // Handle other types of errors
  if (error && !is404Error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Error Loading Certification
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {error.message || 'Failed to load certification data.'}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-600 border-t-transparent mx-auto"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300">Loading certification...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have valid certification data, redirect to the exams page
  if (data?.data) {
    // Redirect to the exams page since that's the main functionality for certifications
    window.location.href = `/main/certifications/${certId}/exams`;
    return null;
  }

  // Fallback to not found
  return null;
}
