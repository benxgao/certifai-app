'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { FaSearch, FaList, FaTh } from 'react-icons/fa';
import { useAllAuthenticatedFirms } from '@/swr/firms';
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

  // Fetch firms and certifications data - using hooks that load ALL data recursively
  const { firms, isLoadingFirms, isFirmsError } = useAllAuthenticatedFirms(true); // Load all firms with cert counts
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
          'group bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 rounded-2xl overflow-hidden flex flex-col h-full',
          isCompact && 'p-3',
        )}
      >
        <CardHeader
          className={cn(
            'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-shrink-0',
            isCompact ? 'p-3' : 'p-6',
          )}
        >
          <div className="mb-4">
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
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
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
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
              >
                {isCurrentlyRegistering ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg h-fit max-h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100/60 dark:border-slate-700/60 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Providers
                </h3>
                <div className="flex items-center space-x-1">
                  <Badge
                    variant="outline"
                    className="text-xs px-3 py-1 bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200/60 dark:border-violet-700/60 rounded-xl"
                  >
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
                          'group p-3 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-sm',
                          isSelected
                            ? 'bg-gradient-to-r from-violet-100/80 to-blue-100/80 dark:from-violet-900/30 dark:to-blue-900/30 border-violet-200/60 dark:border-violet-700/60 text-violet-700 dark:text-violet-300 shadow-md'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 hover:shadow-sm',
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
                                'text-xs px-2 py-1 rounded-lg',
                                isSelected
                                  ? 'bg-violet-200/80 text-violet-800 dark:bg-violet-800/30 dark:text-violet-200'
                                  : 'bg-slate-100/80 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
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
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-12 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
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
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-lg">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
              Certification Catalog
            </h1>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search certifications or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300 rounded-xl shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-700/50 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/60 dark:border-slate-600/60">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300',
                viewMode === 'tree'
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 shadow-md text-white border-0'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50',
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
                'flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300',
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 shadow-md text-white border-0'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50',
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
                'flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300',
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 shadow-md text-white border-0'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50',
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
        <div className="bg-gradient-to-r from-blue-100/80 to-violet-100/80 dark:from-blue-900/20 dark:to-violet-900/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/60 rounded-2xl p-6 shadow-sm">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            Found {totalCertifications} certification{totalCertifications !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Content based on view mode */}
      {totalCertifications === 0 ? (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-slate-100 to-violet-100 dark:from-slate-700/50 dark:to-violet-900/30 rounded-full flex items-center justify-center mb-6 shadow-md">
            <span className="text-3xl font-bold text-slate-400 dark:text-slate-500">?</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            {searchQuery ? 'No matching certifications found' : 'No certifications available'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {searchQuery
              ? 'Try adjusting your search terms or browse all certifications.'
              : 'Check back later for new certification opportunities.'}
          </p>
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery('')}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
            >
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
