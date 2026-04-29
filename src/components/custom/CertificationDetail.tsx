'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaAward, FaUsers, FaGraduationCap, FaExternalLinkAlt, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';
import CertificationJsonLd from '@/src/components/seo/JsonLd';
import { linkifyText } from '@/src/lib/text-utils';
import { AlertMessage } from './AlertMessage';
import { createSlug } from '@/src/utils/slug';

// Simple date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface Firm {
  id: number;
  code: string;
  name: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
}

interface RelatedCertification {
  cert_id: number;
  name: string;
  slug?: string;
  description: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
}

interface CertificationDetailData {
  cert_id: number;
  name: string;
  slug?: string;
  description: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  created_at: string;
  updated_at: string;
  firm: Firm;
  enrollment_count: number;
  related_certifications: RelatedCertification[];
}

interface ApiResponse {
  success: boolean;
  data: CertificationDetailData;
  meta: {
    related_count: number;
    timestamp: string;
  };
}

interface Props {
  certId: string;
  initialData?: {
    cert_id: number;
    name: string;
    description: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
    created_at: string;
    firm_id: number;
  } | null;
}

export default function CertificationDetail({ certId, initialData }: Props) {
  const [certification, setCertification] = useState<CertificationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the public API endpoint that handles JWT authentication (no Firebase auth required)
        const response = await fetch(`/api/public/certifications/${certId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Certification not found');
          }
          throw new Error(`Failed to fetch certification details (${response.status})`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setCertification(result.data);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        // If we have initial data and API call fails, use it as fallback
        if (initialData) {
          const convertedData: CertificationDetailData = {
            cert_id: initialData.cert_id,
            name: initialData.name,
            description: initialData.description,
            min_quiz_counts: initialData.min_quiz_counts,
            max_quiz_counts: initialData.max_quiz_counts,
            pass_score: initialData.pass_score,
            created_at: initialData.created_at,
            updated_at: initialData.created_at,
            firm: {
              id: initialData.firm_id,
              name: 'Unknown Firm',
              code: '',
              description: '',
              website_url: null,
              logo_url: null,
            },
            enrollment_count: 0,
            related_certifications: [],
          };
          setCertification(convertedData);
        } else {
          setError(
            err instanceof Error ? err.message : 'An error occurred while loading certification',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [certId, initialData]);

  if (loading) {
    return <CertificationDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <AlertMessage
            message={`Error loading certification${error ? `: ${error}` : ''}`}
            variant="error"
          />
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Link href="/certifications">
              <Button variant="outline">Back to Certifications</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!certification) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-lg mb-4">Certification not found</div>
        <Link href="/certifications">
          <Button>Back to Certifications</Button>
        </Link>
      </div>
    );
  }

  const { firm } = certification;

  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* SEO JSON-LD */}
        <CertificationJsonLd certification={certification} />
        {/* Hero Section */}
        <section className="certification-hero relative py-8 sm:py-12 mb-6 sm:mb-16 lg:mb-12 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex items-center justify-center gap-3">
              <Badge
                variant="secondary"
                className="text-sm sm:text-base px-4 py-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 font-medium"
              >
                {firm.name}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                {certification.name}
              </span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-green-500" />
                <span>Updated {formatDate(certification.updated_at)}</span>
              </div>
              {firm.description && (
                <a
                  href={firm.description}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <FaExternalLinkAlt />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* About Certification Section */}
        <section className="about-section relative py-8 sm:py-12 mb-12 sm:mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8 sm:p-12">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaAward className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        About This Certification
                      </h2>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        {linkifyText(certification.description)}
                      </p>
                    </div>
                  </div>

                  {firm.description && (
                    <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                          About {firm.name}
                        </h3>
                      </div>
                      <div className="prose max-w-none">
                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                          {linkifyText(firm.description)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Certifications Section */}
        {certification.related_certifications.length > 0 && (
          <section className="related-section relative py-8 sm:py-12 mb-12 sm:mb-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                  Related {firm.name} Certifications
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                  Expand your expertise with these related certifications from {firm.name}
                </p>
              </div>

              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 sm:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {certification.related_certifications.map((relatedCert) => (
                      <Link
                        key={relatedCert.cert_id}
                        href={
                          certification.firm?.code
                            ? `/certifications/${certification.firm.code.toLowerCase()}/${createSlug(
                                relatedCert.name,
                              )}`
                            : `/certifications/cert/${relatedCert.cert_id}`
                        }
                        className="block group"
                      >
                        <Card className="h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
                          <CardContent className="p-6">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                              {relatedCert.name}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                              {relatedCert.description}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:border-violet-300 dark:group-hover:border-violet-600 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-all"
                            >
                              Learn More
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

function CertificationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
        {/* Hero Section Skeleton */}
        <div className="text-center space-y-6 px-4 sm:px-0">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-8 bg-violet-200 dark:bg-violet-800 rounded-full animate-pulse" />
          </div>
          <div className="w-3/4 h-12 sm:h-16 bg-linear-to-r from-violet-200 to-blue-200 dark:from-violet-800 dark:to-blue-800 rounded-2xl animate-pulse mx-auto" />
          <div className="w-2/3 h-6 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse mx-auto" />

          {/* Stats skeleton */}
          <div className="flex justify-center gap-8 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-10 bg-violet-200 dark:bg-violet-800 rounded-lg animate-pulse mb-2" />
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card Skeleton */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 sm:p-12 mx-4 sm:mx-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-200 dark:bg-violet-800 rounded-2xl animate-pulse" />
              <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-5/6 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-4/5 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-violet-200 dark:bg-violet-800 rounded-3xl animate-pulse mx-auto mb-6" />
              <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-4" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Related Certifications Skeleton */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-2xl animate-pulse" />
              <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
                >
                  <div className="w-full h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="bg-linear-to-r from-violet-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-center mx-4 sm:mx-0">
          <div className="w-16 h-16 bg-white/20 rounded-2xl animate-pulse mx-auto mb-6" />
          <div className="w-96 h-12 bg-white/20 rounded-2xl animate-pulse mx-auto mb-6" />
          <div className="w-2/3 h-6 bg-white/20 rounded-xl animate-pulse mx-auto mb-8" />
          <div className="flex justify-center gap-4">
            <div className="w-40 h-12 bg-white/20 rounded-xl animate-pulse" />
            <div className="w-48 h-12 bg-white/20 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
