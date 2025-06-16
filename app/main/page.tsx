'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import {
  UserRegisteredCertification,
  UserCertificationRegistrationInput,
} from '@/swr/certifications';
import { FaGraduationCap, FaCertificate, FaTrophy, FaCheck } from 'react-icons/fa';
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

  // SWR mutation hook for registering a certification
  const { trigger: registerCertification, isMutating: isRegistering } = useSWRMutation(
    '/api/certifications/register',
    registerUserForCertification,
  );

  const { userCertifications, isLoadingUserCertifications, isUserCertificationsError } =
    useUserCertifications();

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
                                      <FaCheck className="w-3 h-3" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Certifications */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FaCertificate className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Certifications
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {userCertifications?.length || 0}
                  </p>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FaGraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      In Progress
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {userCertifications?.filter((cert) => cert.status === 'active')?.length || 0}
                  </p>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <FaTrophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Completed
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {userCertifications?.filter((cert) => cert.status === 'completed')?.length || 0}
                  </p>
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4 text-amber-600 dark:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Progress
                    </p>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                    {userCertifications?.length
                      ? `${Math.round(
                          (userCertifications.filter((cert) => cert.status === 'completed').length /
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

          {isLoadingUserCertifications ? (
            <div className="space-y-6">
              {' '}
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`user-skeleton-${index}`}
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
                      {/* Three-column metrics skeleton */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Certification ID skeleton */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-24"></div>
                              <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-12"></div>
                            </div>
                          </div>
                        </div>

                        {/* Start Date skeleton */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-16"></div>
                              <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-20"></div>
                            </div>
                          </div>
                        </div>

                        {/* Status skeleton */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-20"></div>
                              <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded animate-pulse w-16"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action button skeleton */}
                      <div className="flex justify-center mt-2">
                        <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-xl animate-pulse w-64"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : userCertifications && userCertifications.length > 0 ? (
            <div className="space-y-6">
              {userCertifications.map((cert: UserRegisteredCertification, index: number) => (
                <Card
                  key={`user-${cert.cert_id}`}
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
                            {cert.certification.name}
                          </div>
                        </div>
                      </CardTitle>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium border shadow-sm ${
                            cert.status === 'active'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50'
                              : cert.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'
                              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/50'
                          }`}
                        >
                          {cert.status === 'active' && <FaGraduationCap className="w-4 h-4 mr-2" />}
                          {cert.status === 'completed' && <FaTrophy className="w-4 h-4 mr-2" />}
                          {cert.status === 'active'
                            ? 'In Progress'
                            : cert.status === 'completed'
                            ? 'Completed'
                            : cert.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-4">
                    <div className="flex flex-col space-y-5">
                      {/* Certification Details - Three columns for key info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Certification ID */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Certification ID
                              </p>
                              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                #{cert.cert_id}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Start Date */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h.01M16 15h.01M8 19h.01M16 19h.01"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Started On
                              </p>
                              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {new Date(cert.assigned_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center
                                ${
                                  cert.status === 'active'
                                    ? 'bg-blue-50 dark:bg-blue-900/30'
                                    : cert.status === 'completed'
                                    ? 'bg-emerald-50 dark:bg-emerald-900/30'
                                    : 'bg-slate-100 dark:bg-slate-700/50'
                                }`}
                            >
                              {cert.status === 'active' && (
                                <FaGraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                              {cert.status === 'completed' && (
                                <FaTrophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                              {!['active', 'completed'].includes(cert.status) && (
                                <svg
                                  className="w-4 h-4 text-slate-500 dark:text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Current Status
                              </p>
                              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {cert.status === 'active'
                                  ? 'In Progress'
                                  : cert.status === 'completed'
                                  ? 'Completed'
                                  : cert.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <Button
                          size="lg"
                          onClick={() => router.push(`/main/certifications/${cert.cert_id}/exams`)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Continue Your Certification Journey
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <FaCertificate className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    No Certifications Yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    You haven&apos;t registered for any certifications yet. Explore our catalog to
                    start your learning journey.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/main/certifications')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Explore Certifications
                </Button>
              </div>
            </div>
          )}

          {isUserCertificationsError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-800 dark:text-red-200 font-medium">
                  Error loading your registered certifications
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MainPage;
