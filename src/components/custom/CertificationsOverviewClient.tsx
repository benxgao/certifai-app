'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaSearch, FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { CertificationsCatalogJsonLd } from '@/src/components/seo/JsonLd';
import { createSlug } from '@/src/utils/slug';
import { AlertMessage } from './AlertMessage';
import { FirmWithCertifications } from '@/src/lib/server-actions/certifications';
import { linkifyText } from '@/src/lib/text-utils';

interface CertificationsOverviewClientProps {
  initialFirms: FirmWithCertifications[];
  initialError?: string;
  defaultFirmFilter?: string;
}

export default function CertificationsOverviewClient({
  initialFirms,
  initialError,
  defaultFirmFilter,
}: CertificationsOverviewClientProps) {
  // Debug logging
  console.log('CertificationsOverviewClient initialized with:', {
    firmsCount: initialFirms.length,
    totalCerts: initialFirms.reduce((sum, f) => sum + f.certifications.length, 0),
    firmsWithCerts: initialFirms.filter((f) => f.certifications.length > 0).length,
    firmsDetail: initialFirms.map((f) => ({ name: f.name, certCount: f.certifications.length })),
    error: initialError,
  });

  const [firms] = useState<FirmWithCertifications[]>(initialFirms);
  const [filteredFirms, setFilteredFirms] = useState<FirmWithCertifications[]>(initialFirms);
  const [error] = useState<string | null>(initialError || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFirm, setSelectedFirm] = useState<string | null>(defaultFirmFilter || null);

  useEffect(() => {
    const filterFirms = () => {
      let filtered = firms;

      if (selectedFirm) {
        filtered = filtered.filter((firm) => firm.code === selectedFirm);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (firm) =>
            firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            firm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            firm.certifications.some(
              (cert) =>
                cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cert.description &&
                  cert.description.toLowerCase().includes(searchTerm.toLowerCase())),
            ),
        );
      }

      setFilteredFirms(filtered);
    };

    filterFirms();
  }, [firms, searchTerm, selectedFirm]);

  const totalCertifications = firms.reduce((sum, firm) => sum + firm.certification_count, 0);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <AlertMessage
            message={`Error loading certifications${error ? `: ${error}` : ''}`}
            variant="error"
          />
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SEO JSON-LD */}
      <CertificationsCatalogJsonLd
        totalCertifications={totalCertifications}
        totalFirms={firms.length}
      />

      {/* Stats and Search */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-slate-900/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-1">
              {firms.length}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Technology Firms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
              {totalCertifications}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Total Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-1">
              {Math.round(totalCertifications / firms.length)}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Avg per Firm</div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search certifications or firms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
            />
          </div>
          <select
            value={selectedFirm || ''}
            onChange={(e) => setSelectedFirm(e.target.value || null)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
          >
            <option value="">All Firms</option>
            {firms.map((firm) => (
              <option key={firm.id} value={firm.code}>
                {firm.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || selectedFirm) && (
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-violet-200/60 dark:border-violet-800/50">
          <p className="text-violet-800 dark:text-violet-200">
            Showing {filteredFirms.length} firm{filteredFirms.length !== 1 ? 's' : ''} with{' '}
            {filteredFirms.reduce((sum, firm) => sum + firm.certification_count, 0)} certification
            {filteredFirms.reduce((sum, firm) => sum + firm.certification_count, 0) !== 1
              ? 's'
              : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedFirm && ` from ${firms.find((f) => f.code === selectedFirm)?.name}`}
          </p>
          {(searchTerm || selectedFirm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedFirm(null);
              }}
              className="mt-2 text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Certifications by Firm */}
      <div className="space-y-6">
        {filteredFirms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 dark:text-slate-400 text-lg mb-2">
              No certifications found
            </div>
            <p className="text-slate-400 dark:text-slate-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredFirms.map((firm) => (
            <Card
              key={firm.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg dark:shadow-slate-900/20 hover:shadow-xl dark:hover:shadow-slate-900/30 transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-violet-300/60 dark:hover:border-violet-600/60 rounded-2xl"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                        {firm.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="text-sm bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50"
                      >
                        {firm.certification_count} certification
                        {firm.certification_count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      {linkifyText(firm.description)}
                    </p>
                    {firm.website_url && (
                      <a
                        href={firm.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 text-sm transition-colors duration-200"
                      >
                        Visit Website <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!Array.isArray(firm.certifications) || firm.certifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400 italic mb-2">
                      No certifications available yet
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Expected: {firm.certification_count} certification
                      {firm.certification_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {firm.certifications.map((cert) => (
                      <Link
                        key={cert.cert_id}
                        href={`/certifications/${firm.code}/${createSlug(cert.name)}`}
                        className="group"
                      >
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-violet-300 dark:hover:border-violet-600 hover:bg-gradient-to-br hover:from-violet-50/50 hover:to-blue-50/50 dark:hover:from-violet-900/20 dark:hover:to-blue-900/20 transition-all duration-300 cursor-pointer hover:shadow-md dark:hover:shadow-slate-900/20">
                          <div className="flex items-start gap-2 mb-2">
                            <FaAward className="text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
                            <h4 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-violet-800 dark:group-hover:text-violet-300 line-clamp-2 transition-colors duration-200">
                              {cert.name}
                            </h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                            {cert.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {cert.min_quiz_counts}-{cert.max_quiz_counts} questions
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
