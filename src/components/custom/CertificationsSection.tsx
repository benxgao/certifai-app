import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { UserRegisteredCertification } from '@/swr/certifications';
import { FaGraduationCap, FaCertificate, FaTrophy } from 'react-icons/fa';
import { UserCertificationCardSkeleton } from '@/src/components/ui/card-skeletons';

const CertificationsSection = () => {
  const router = useRouter();
  const { userCertifications, isLoadingUserCertifications, isUserCertificationsError } =
    useUserCertifications();

  // Show skeleton only while certifications are loading
  // Profile loading can continue in background
  if (isLoadingUserCertifications) {
    return <UserCertificationCardSkeleton count={3} />;
  }

  if (isUserCertificationsError) {
    return (
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
          <p className="text-red-800 dark:text-red-100 font-medium">
            Error loading your registered certifications
          </p>
        </div>
      </div>
    );
  }

  if (!userCertifications || userCertifications.length === 0) {
    return (
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
              You haven&apos;t registered for any certifications yet. Explore our catalog to start
              your learning journey.
            </p>
          </div>
          <Button onClick={() => router.push('/main/certifications')}>
            Explore Certifications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userCertifications.map((cert: UserRegisteredCertification) => (
        <Card
          key={`user-${cert.cert_id}`}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
        >
          <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-4">
            <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {cert.certification.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Certification Details - Horizontal layout for better space usage */}
              <div className="flex flex-wrap gap-4 flex-1">
                {/* Certification ID */}
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700/50">
                  <div className="w-6 h-6 bg-violet-50 dark:bg-violet-900/30 rounded-md flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-blue-600 dark:text-blue-400"
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
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      ID
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      #{cert.cert_id}
                    </p>
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700/50">
                  <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-md flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
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
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Started
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(cert.assigned_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700/50">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center
                      ${
                        cert.status === 'active'
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : cert.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-900/30'
                          : 'bg-slate-100 dark:bg-slate-700/50'
                      }`}
                  >
                    {cert.status === 'active' && (
                      <FaGraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    )}
                    {cert.status === 'completed' && (
                      <FaTrophy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Status
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {cert.status === 'active'
                        ? 'Active'
                        : cert.status === 'completed'
                        ? 'Complete'
                        : cert.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => router.push(`/main/certifications/${cert.cert_id}/exams`)}
                  className="font-medium"
                >
                  Continue
                  <svg
                    className="w-4 h-4 ml-2"
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
  );
};

export default CertificationsSection;
