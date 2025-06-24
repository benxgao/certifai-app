'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaSearch, FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { CertificationsCatalogJsonLd } from '@/src/components/seo/JsonLd';

interface Certification {
  cert_id: number;
  name: string;
  description: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  created_at: string;
}

interface Firm {
  id: number;
  code: string;
  name: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
  certification_count: number;
  certifications: Certification[];
}

export default function CertificationsOverview() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [filteredFirms, setFilteredFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFirm, setSelectedFirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

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

  const fetchCertifications = async () => {
    try {
      setLoading(true);

      // Fetch firms with certification counts
      const firmsResponse = await fetch('/api/firms?includeCount=true&pageSize=50');
      if (!firmsResponse.ok) {
        throw new Error('Failed to fetch firms');
      }
      const firmsResult = await firmsResponse.json();

      // Fetch all certifications with firm information
      const certsResponse = await fetch('/api/certifications?pageSize=100');
      if (!certsResponse.ok) {
        throw new Error('Failed to fetch certifications');
      }
      const certsResult = await certsResponse.json();

      if (firmsResult.data && certsResult.data) {
        // Group certifications by firm
        const firmsWithCerts = firmsResult.data.map((firm: any) => ({
          id: firm.firm_id,
          code: firm.code,
          name: firm.name,
          description: firm.description,
          website_url: firm.website_url,
          logo_url: firm.logo_url,
          certification_count: firm._count?.certifications || 0,
          certifications: certsResult.data.filter((cert: any) => cert.firm_id === firm.firm_id),
        }));

        setFirms(firmsWithCerts);
        setFilteredFirms(firmsWithCerts);
      } else {
        throw new Error('API returned incomplete data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const totalCertifications = firms.reduce((sum, firm) => sum + firm.certification_count, 0);

  if (loading) {
    return <CertificationsOverviewSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error loading certifications</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchCertifications}>Try Again</Button>
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
              {filteredFirms.reduce((sum, firm) => sum + firm.certification_count, 0)}
            </div>
            <div className="text-gray-600">Showing Results</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search certifications or firms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFirm === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFirm(null)}
            >
              All Firms
            </Button>
            {firms.slice(0, 5).map((firm) => (
              <Button
                key={firm.code}
                variant={selectedFirm === firm.code ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFirm(firm.code)}
              >
                {firm.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Firms and Certifications */}
      <div className="space-y-8">
        {filteredFirms.map((firm) => (
          <Card key={firm.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{firm.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaAward className="text-blue-500" />
                        <span>{firm.certification_count} Certifications</span>
                      </div>
                      {firm.website_url && (
                        <a
                          href={firm.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <FaExternalLinkAlt />
                          <span>Official Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {firm.certification_count}
                </Badge>
              </div>
              {firm.description && <p className="text-gray-700 mt-3">{firm.description}</p>}
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {firm.certifications.map((cert) => (
                  <Link
                    key={cert.cert_id}
                    href={`/certifications/cert/${cert.cert_id}`}
                    className="block"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {cert.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {cert.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>Pass Score: {cert.pass_score}%</span>
                          </div>
                          <Badge variant="outline">
                            {cert.min_quiz_counts}-{cert.max_quiz_counts} Questions
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFirms.length === 0 && (
        <div className="text-center py-12">
          <FaSearch className="text-gray-400 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No certifications found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
}

function CertificationsOverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Firms Skeleton */}
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <Card key={j}>
                  <CardContent className="p-4">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
