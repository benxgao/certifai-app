'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaSearch, FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { CertificationsCatalogJsonLd } from '@/src/components/seo/JsonLd';
import { FirmWithCertifications } from '@/src/lib/server-actions/certifications';

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
                cert.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <div className="text-red-600 text-lg mb-4">Error loading certifications</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{firms.length}</div>
            <div className="text-gray-600">Technology Firms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{totalCertifications}</div>
            <div className="text-gray-600">Total Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {Math.round(totalCertifications / firms.length)}
            </div>
            <div className="text-gray-600">Avg per Firm</div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search certifications or firms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedFirm || ''}
            onChange={(e) => setSelectedFirm(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-blue-800">
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
              className="mt-2 text-blue-600 hover:text-blue-800"
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
            <div className="text-gray-500 text-lg mb-2">No certifications found</div>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredFirms.map((firm) => (
            <Card key={firm.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl text-gray-900">{firm.name}</CardTitle>
                      <Badge variant="secondary" className="text-sm">
                        {firm.certification_count} certification
                        {firm.certification_count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{firm.description}</p>
                    {firm.website_url && (
                      <a
                        href={firm.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Visit Website <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {firm.certifications.length === 0 ? (
                  <p className="text-gray-500 italic">No certifications available yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {firm.certifications.map((cert) => (
                      <Link
                        key={cert.cert_id}
                        href={`/certifications/${firm.code}/${cert.cert_id}`}
                        className="group"
                      >
                        <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-2 mb-2">
                            <FaAward className="text-blue-600 mt-1 flex-shrink-0" />
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-800 line-clamp-2">
                              {cert.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {cert.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Pass: {cert.pass_score}%</span>
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
