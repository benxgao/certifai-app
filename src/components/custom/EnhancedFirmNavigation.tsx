'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { FaSearch, FaList, FaTh } from 'react-icons/fa';
import { useFirms } from '@/swr/firms';
import { useAllAvailableCertifications, CertificationListItem } from '@/swr/certifications';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { CardSkeleton } from '@/components/custom/LoadingComponents';
import { Input } from '@/components/ui/input';
import { cn } from '@/src/lib/utils';

interface EnhancedFirmNavigationProps {
  onRegister: (cert: CertificationListItem) => void;
  registeringCertId: number | null;
}

type ViewMode = 'tree' | 'grid' | 'list';

const EnhancedFirmNavigation: React.FC<EnhancedFirmNavigationProps> = ({
  onRegister,
  registeringCertId,
}) => {
  const router = useRouter();
  const [navigatingCertId, setNavigatingCertId] = useState<number | null>(null);
  const [selectedFirm, setSelectedFirm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('tree');

  // Fetch firms and certifications data
  const { firms, isLoadingFirms, isFirmsError } = useFirms(true);
  const { availableCertifications, isLoadingAvailableCertifications } =
    useAllAvailableCertifications();
  const { userCertifications } = useUserCertifications();

  // Group certifications by firm with search filtering
  const { certificationsByFirm, filteredFirms, totalCertifications } = useMemo(() => {
    if (!availableCertifications || !firms)
      return {
        certificationsByFirm: {},
        filteredFirms: [],
        totalCertifications: 0,
      };

    const grouped: { [key: string]: CertificationListItem[] } = {};

    // Filter certifications by search query
    const filtered = availableCertifications.filter(
      (cert) =>
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.firm?.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    filtered.forEach((cert) => {
      const firmKey = cert.firm?.code || 'UNKNOWN';
      if (!grouped[firmKey]) {
        grouped[firmKey] = [];
      }
      grouped[firmKey].push(cert);
    });

    // Filter firms that have certifications matching search
    const firmsWithCerts = firms.filter((firm) => grouped[firm.code]?.length > 0);

    return {
      certificationsByFirm: grouped,
      filteredFirms: firmsWithCerts,
      totalCertifications: filtered.length,
    };
  }, [availableCertifications, firms, searchQuery]);

  // Set default selection to first firm when firms are loaded
  React.useEffect(() => {
    if (filteredFirms.length > 0 && !selectedFirm) {
      setSelectedFirm(filteredFirms[0].code);
    }
  }, [filteredFirms, selectedFirm]);

  const handleViewExams = (certId: number) => {
    setNavigatingCertId(certId);
    router.push(`/main/certifications/${certId}/exams`);
  };

  const renderCertificationCard = (cert: CertificationListItem, isCompact = false) => {
    const isRegistered = userCertifications?.some((uc: any) => uc.cert_id === cert.cert_id);
    const isCurrentlyRegistering = registeringCertId === cert.cert_id;
    const isCurrentlyNavigating = navigatingCertId === cert.cert_id;

    return (
      <Card
        key={cert.cert_id}
        className={cn(
          'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden group flex flex-col h-full',
          isCompact && 'p-3',
        )}
      >
        <CardHeader
          className={cn('bg-white dark:bg-slate-800 flex-shrink-0', isCompact ? 'p-3' : 'p-6')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2 leading-tight mb-3',
                  isCompact ? 'text-base' : 'text-xl',
                )}
              >
                {cert.name}
              </h3>
              {cert.firm && !isCompact && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {cert.firm.name}
                  </span>
                </div>
              )}
            </div>
            {isRegistered && (
              <div className="flex-shrink-0 ml-3">
                <Badge
                  variant="default"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                  Registered
                </Badge>
              </div>
            )}
          </div>

          {!isCompact && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 dark:text-slate-400">
                  {cert.min_quiz_counts}-{cert.max_quiz_counts} Questions
                </span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent
          className={cn('flex-1 flex flex-col justify-end', isCompact ? 'p-3 pt-0' : 'p-6 pt-0')}
        >
          <div className="space-y-3">
            {isRegistered ? (
              <Button
                size={isCompact ? 'sm' : 'lg'}
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
                    <span>View Exams</span>
                  </div>
                )}
              </Button>
            ) : (
              <Button
                size={isCompact ? 'sm' : 'lg'}
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

  const renderTreeView = () => (
    <div className="space-y-6">
      {/* Compact Tree Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Compact Firm Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit max-h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Providers
                </h3>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {filteredFirms.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 flex-1 overflow-hidden">
              <div className="space-y-1 overflow-y-auto max-h-[500px] pr-2 -mr-2">
                {/* Firms List */}
                {filteredFirms.map((firm) => {
                  const certCount = certificationsByFirm[firm.code]?.length || 0;
                  const isSelected = selectedFirm === firm.code;

                  return (
                    <div key={firm.code}>
                      <div
                        className={cn(
                          'group p-2 rounded-lg cursor-pointer transition-all duration-200 border',
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700',
                        )}
                        onClick={() => setSelectedFirm(firm.code)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <span className="text-sm font-medium truncate" title={firm.name}>
                              {firm.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-xs',
                                isSelected
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                              )}
                            >
                              {certCount}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Selected Content */}
        <div className="lg:col-span-2">
          {selectedFirm && filteredFirms.find((f) => f.code === selectedFirm) ? (
            <div>
              {/* Selected Firm Header */}
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {filteredFirms.find((f) => f.code === selectedFirm)?.name}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {filteredFirms.find((f) => f.code === selectedFirm)?.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {certificationsByFirm[selectedFirm]?.length || 0} Certification
                          {(certificationsByFirm[selectedFirm]?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </span>
                      {filteredFirms.find((f) => f.code === selectedFirm)?.website_url && (
                        <a
                          href={
                            filteredFirms.find((f) => f.code === selectedFirm)?.website_url ||
                            undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                        >
                          <span>Visit</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {certificationsByFirm[selectedFirm]?.map((cert) =>
                  renderCertificationCard(cert, true),
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Select a Provider
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Choose a certification provider from the list to view their available
                certifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Certification Grid View
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Browse {totalCertifications} certification{totalCertifications !== 1 ? 's' : ''} in an
          organized grid layout
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {availableCertifications
          ?.filter(
            (cert) =>
              cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cert.firm?.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((cert) => renderCertificationCard(cert))}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Certification List View
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Browse {totalCertifications} certification{totalCertifications !== 1 ? 's' : ''} in a
          compact list format
        </p>
      </div>
      <div className="space-y-4">
        {availableCertifications
          ?.filter(
            (cert) =>
              cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cert.firm?.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((cert) => renderCertificationCard(cert, true))}
      </div>
    </div>
  );

  if (isLoadingFirms || isLoadingAvailableCertifications) {
    return (
      <div className="space-y-6">
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
            />
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
    <div className="space-y-8">
      {/* Enhanced Header with Search and View Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-lg">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Certification Catalog
            </h1>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search certifications or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                viewMode === 'tree'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
              )}
            >
              <FaList className="w-4 h-4" />
              <span className="font-medium">Tree</span>
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
              )}
            >
              <FaTh className="w-4 h-4" />
              <span className="font-medium">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
              )}
            >
              <FaList className="w-4 h-4" />
              <span className="font-medium">List</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {searchQuery && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            Found {totalCertifications} certification{totalCertifications !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Content based on view mode */}
      {totalCertifications === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">?</span>
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {searchQuery ? 'No matching certifications found' : 'No certifications available'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery
              ? 'Try adjusting your search terms or browse all certifications.'
              : 'Check back later for new certification opportunities.'}
          </p>
          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'tree' && renderTreeView()}
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'list' && renderListView()}
        </>
      )}
    </div>
  );
};

export default EnhancedFirmNavigation;
