import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/custom/LoadingComponents';
import { useAllAvailableCertifications } from '@/swr/certifications';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { FaAward, FaGraduationCap, FaCheck } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!availableCertifications || availableCertifications.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaAward className="w-8 h-8 text-slate-400 dark:text-slate-500" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableCertifications.map((cert) => {
        const isRegistered = userCertifications?.some((uc: any) => uc.cert_id === cert.cert_id);
        const isCurrentlyRegistering = registeringCertId === cert.cert_id;
        const isCurrentlyNavigating = navigatingCertId === cert.cert_id;

        return (
          <Card
            key={cert.cert_id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
          >
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-relaxed flex-1 mr-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FaAward className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cert.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Exam Guide Available • {cert.min_quiz_counts}-{cert.max_quiz_counts} Questions
                    </p>
                  </div>
                </CardTitle>
                <div className="flex-shrink-0">
                  {isRegistered ? (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50">
                      <FaCheck className="w-3 h-3 mr-1" />
                      Registered
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50">
                      Available
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Certification Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Pass Score
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {cert.pass_score}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Questions
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {cert.min_quiz_counts}-{cert.max_quiz_counts}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => (isRegistered ? handleViewExams(cert.cert_id) : onRegister(cert))}
                  disabled={isCurrentlyRegistering || isRegistering || isCurrentlyNavigating}
                  className={`w-full rounded-lg py-3 font-medium transition-all duration-200 ${
                    isRegistered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCurrentlyNavigating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading Exams...</span>
                    </div>
                  ) : isCurrentlyRegistering ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </div>
                  ) : isRegistered ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FaGraduationCap className="w-4 h-4" />
                      <span>View Exams</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <FaAward className="w-4 h-4" />
                      <span>Register Now</span>
                    </div>
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
