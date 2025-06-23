'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { FaAward, FaGraduationCap, FaBuilding, FaCertificate } from 'react-icons/fa';
import { useFirms } from '@/swr/firms';
import { useAllAvailableCertifications, CertificationListItem } from '@/swr/certifications';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { CardSkeleton } from '@/components/custom/LoadingComponents';

interface FirmTabsProps {
  onRegister: (cert: CertificationListItem) => void;
  registeringCertId: number | null;
}

const FirmTabs: React.FC<FirmTabsProps> = ({
  onRegister,
  registeringCertId,
}) => {
  const router = useRouter();
  const [navigatingCertId, setNavigatingCertId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Fetch firms and certifications data
  const { firms, isLoadingFirms, isFirmsError } = useFirms(true);
  const { availableCertifications, isLoadingAvailableCertifications } = useAllAvailableCertifications();
  const { userCertifications } = useUserCertifications();

  // Group certifications by firm
  const certificationsByFirm = useMemo(() => {
    if (!availableCertifications) return {};
    
    const grouped: { [key: string]: CertificationListItem[] } = {};
    
    availableCertifications.forEach((cert) => {
      const firmKey = cert.firm?.code || 'UNKNOWN';
      if (!grouped[firmKey]) {
        grouped[firmKey] = [];
      }
      grouped[firmKey].push(cert);
    });
    
    return grouped;
  }, [availableCertifications]);

  // Get firm with most certifications for default tab
  const defaultFirm = useMemo(() => {
    if (!firms || firms.length === 0) return null;
    return firms.reduce((prev, current) => 
      (current._count?.certifications || 0) > (prev._count?.certifications || 0) ? current : prev
    );
  }, [firms]);

  // Set default tab to the firm with most certifications
  React.useEffect(() => {
    if (defaultFirm && activeTab === 'all') {
      setActiveTab(defaultFirm.code);
    }
  }, [defaultFirm, activeTab]);

  const handleViewExams = (certId: number) => {
    setNavigatingCertId(certId);
    router.push(`/main/certifications/${certId}/exams`);
  };

  const renderCertificationCard = (cert: CertificationListItem) => {
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
              {cert.firm && (
                <div className="flex items-center space-x-2 mb-3">
                  <FaBuilding className="w-3 h-3 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{cert.firm.name}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 ml-3">
              <Badge
                variant={isRegistered ? "default" : "secondary"}
                className={`${
                  isRegistered
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
                }`}
              >
                {isRegistered ? 'Registered' : 'Available'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 dark:text-slate-500">📝</span>
              <span className="text-slate-600 dark:text-slate-400">
                {cert.min_quiz_counts}-{cert.max_quiz_counts} Questions
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 dark:text-slate-500">🎯</span>
              <span className="text-slate-600 dark:text-slate-400">
                {cert.pass_score}% Pass Score
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 pt-0 flex flex-col justify-end">
          <div className="space-y-3">
            {isRegistered ? (
              <Button
                size="lg"
                onClick={() => handleViewExams(cert.cert_id)}
                disabled={isCurrentlyNavigating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCurrentlyNavigating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading Exams...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaGraduationCap className="w-4 h-4" />
                    <span>View Exams</span>
                  </div>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => onRegister(cert)}
                disabled={isCurrentlyRegistering}
                variant="outline"
                className="w-full border-violet-200 dark:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
              >
                {isCurrentlyRegistering ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaAward className="w-4 h-4" />
                    <span>Register</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCertificationsGrid = (certifications: CertificationListItem[]) => {
    if (!certifications || certifications.length === 0) {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <FaCertificate className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No Certifications Available
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            This provider doesn&apos;t have any certifications available yet.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map(renderCertificationCard)}
      </div>
    );
  };

  if (isLoadingFirms || isLoadingAvailableCertifications) {
    return (
      <div className="space-y-6">
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isFirmsError) {
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
            Error loading certification providers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-auto overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger 
            value="all" 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
          >
            <FaAward className="w-4 h-4" />
            <span>All ({availableCertifications?.length || 0})</span>
          </TabsTrigger>
          
          {firms?.filter(firm => (firm._count?.certifications || 0) > 0).map((firm) => (
            <TabsTrigger 
              key={firm.code} 
              value={firm.code}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 whitespace-nowrap"
            >
              <FaBuilding className="w-4 h-4" />
              <span>{firm.code} ({firm._count?.certifications || 0})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderCertificationsGrid(availableCertifications || [])}
        </TabsContent>

        {firms?.filter(firm => (firm._count?.certifications || 0) > 0).map((firm) => (
          <TabsContent key={firm.code} value={firm.code} className="mt-6">
            <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {firm.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {firm.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-2">
                      <FaCertificate className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {firm._count?.certifications || 0} Certifications
                      </span>
                    </span>
                    {firm.website_url && (
                      <a
                        href={firm.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {renderCertificationsGrid(certificationsByFirm[firm.code] || [])}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FirmTabs;
