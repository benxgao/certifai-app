import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { UserRegisteredCertification } from '@/swr/certifications';
import { FaCertificate, FaClipboardList } from 'react-icons/fa';
import { UserCertificationCardSkeleton } from '@/src/components/ui/card-skeletons';
import { useExamCountForCertification } from '@/src/hooks/useExamCounts';

const CertificationCard = ({ cert }: { cert: UserRegisteredCertification }) => {
  const router = useRouter();
  const examCount = useExamCountForCertification(cert.cert_id);

  return (
    <Card
      key={`user-${cert.cert_id}`}
      className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden group"
    >
      <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {cert.certification.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Certification Details - Grid layout for better visual hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Exams */}
            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Exams
                </p>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  {examCount}
                </p>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="min-w-0 flex-1">
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Started
                </p>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  {new Date(cert.assigned_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-pink-600 dark:text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Status
                </p>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  {cert.status === 'active'
                    ? 'Active'
                    : cert.status === 'completed'
                    ? 'Complete'
                    : cert.status}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button - Separate row, aligned to the right */}
          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              onClick={() => router.push(`/main/certifications/${cert.cert_id}/exams`)}
              className="font-medium px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue Learning
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

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
    <div className="space-y-6">
      {userCertifications.map((cert: UserRegisteredCertification) => (
        <CertificationCard key={`user-${cert.cert_id}`} cert={cert} />
      ))}
    </div>
  );
};

export default CertificationsSection;
