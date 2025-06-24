import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/custom/LoadingComponents';
import { useAllAvailableCertifications } from '@/swr/certifications';
import { useUserCertifications } from '@/context/UserCertificationsContext';

interface CertificationGridProps {
  onRegister: (cert: any) => void;
  isRegistering: boolean;
  registeringCertId: number | null;
}

const CertificationGrid: React.FC<CertificationGridProps> = ({
  onRegister,
  isRegistering,
  registeringCertId,
}) => {
  const router = useRouter();
  const [navigatingCertId, setNavigatingCertId] = useState<number | null>(null);
  const { availableCertifications, isLoadingAvailableCertifications } =
    useAllAvailableCertifications();
  const { userCertifications } = useUserCertifications();

  const handleViewExams = (certId: number) => {
    setNavigatingCertId(certId);
    // Immediate redirect with optimistic loading
    router.push(`/main/certifications/${certId}/exams`);
  };

  if (isLoadingAvailableCertifications) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!availableCertifications || availableCertifications.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30"></div>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No Certifications Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Check back later for new certification opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availableCertifications.map((cert) => {
        const isRegistered = userCertifications?.some((uc: any) => uc.cert_id === cert.cert_id);
        const isCurrentlyRegistering = registeringCertId === cert.cert_id;
        const isCurrentlyNavigating = navigatingCertId === cert.cert_id;

        return (
          <Card
            key={cert.cert_id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden group flex flex-col h-full"
          >
            <CardHeader className="bg-white dark:bg-slate-800 flex-shrink-0 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2 leading-tight mb-3">
                    {cert.name}
                  </h3>
                </div>
                {/* Status Badge */}
                <div className="flex-shrink-0 ml-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isRegistered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
                    }`}
                  >
                    {isRegistered ? 'Registered' : 'Available'}
                  </span>
                </div>
              </div>

              {/* Certification Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 dark:text-slate-500">📝</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {cert.min_quiz_counts}-{cert.max_quiz_counts} Questions
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 dark:text-slate-500">⏱️</span>
                  <span className="text-slate-600 dark:text-slate-400">~60 minutes</span>
                </div>
                {cert.exam_guide_url && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 dark:text-slate-500">📚</span>
                    <a
                      href={cert.exam_guide_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors font-medium"
                    >
                      Study Guide
                    </a>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4 flex flex-col flex-grow">
              <div className="flex flex-col h-full justify-end">
                {/* Action Button */}
                <Button
                  onClick={() => (isRegistered ? handleViewExams(cert.cert_id) : onRegister(cert))}
                  disabled={isCurrentlyRegistering || isRegistering || isCurrentlyNavigating}
                  className={`w-full rounded-xl py-3 font-semibold transition-all duration-200 flex-shrink-0 ${
                    isRegistered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/20'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-200 dark:hover:shadow-primary-900/20'
                  }`}
                >
                  {isCurrentlyNavigating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Loading...</span>
                    </div>
                  ) : isCurrentlyRegistering ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Registering...</span>
                    </div>
                  ) : isRegistered ? (
                    <span>View Exams</span>
                  ) : (
                    <span>Register Now</span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CertificationGrid;
