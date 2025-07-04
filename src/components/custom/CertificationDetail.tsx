'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FaAward,
  FaUsers,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaClock,
  FaStar,
  FaCalendar,
} from 'react-icons/fa';
import Link from 'next/link';
import CertificationJsonLd from '@/src/components/seo/JsonLd';
import { linkifyText } from '@/src/lib/text-utils';

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
  description: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
}

interface CertificationDetailData {
  cert_id: number;
  name: string;
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
        console.error('Error fetching certification:', err);

        // If we have initial data and API call fails, use it as fallback
        if (initialData) {
          console.log('Using initial data as fallback due to API error');
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
        <div className="text-red-600 text-lg mb-4">Error loading certification</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-x-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Link href="/certifications">
            <Button variant="outline">Back to Certifications</Button>
          </Link>
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
    <div className="space-y-8">
      {/* SEO JSON-LD */}
      <CertificationJsonLd certification={certification} />

      {/* Main Certification Info */}
      <Card className="overflow-hidden pt-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pt-8">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {firm.name}
                </Badge>
                <Badge variant="outline">Certification ID: {certification.cert_id}</Badge>
              </div>
              <CardTitle className="text-3xl text-gray-900 dark:text-slate-100 mb-3">
                {certification.name}
              </CardTitle>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-blue-500" />
                  <span>{certification.enrollment_count} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-green-500" />
                  <span>Updated {formatDate(certification.updated_at)}</span>
                </div>
                {firm.website_url && (
                  <a
                    href={firm.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt />
                    <span>Official Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                About This Certification
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {linkifyText(certification.description)}
              </p>
            </div>

            {firm.description && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                  About {firm.name}
                </h3>
                <p className="text-gray-700 leading-relaxed">{linkifyText(firm.description)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <FaClock className="text-3xl text-blue-500 mb-4 mx-auto" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {certification.min_quiz_counts === certification.max_quiz_counts
                ? certification.min_quiz_counts
                : `${certification.min_quiz_counts}-${certification.max_quiz_counts}`}
            </div>
            <div className="text-gray-600">Questions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FaStar className="text-3xl text-yellow-500 mb-4 mx-auto" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {certification.enrollment_count}
            </div>
            <div className="text-gray-600">Students Enrolled</div>
          </CardContent>
        </Card>
      </div>

      {/* Related Certifications */}
      {certification.related_certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaGraduationCap className="text-blue-500" />
              Related {firm.name} Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certification.related_certifications.map((relatedCert) => (
                <Link
                  key={relatedCert.cert_id}
                  href={`/certifications/cert/${relatedCert.cert_id}`}
                  className="block"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedCert.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {linkifyText(relatedCert.description)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <Badge variant="outline">
                          {relatedCert.min_quiz_counts}-{relatedCert.max_quiz_counts} Questions
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <FaAward className="text-4xl text-blue-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Start Your Certification Journey?
            </h3>
            <p className="text-gray-700 mb-6">
              Join thousands of professionals who have advanced their careers with Certestic&apos;s
              AI-powered certification training. Get personalized study plans, practice questions,
              and detailed progress tracking.
            </p>
            <div className="space-x-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/certifications">
                <Button variant="outline" size="lg">
                  Browse More Certifications
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CertificationDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex gap-3">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-6">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse mb-4 mx-auto" />
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mb-2 mx-auto" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Related Certifications Skeleton */}
      <Card>
        <CardHeader>
          <div className="w-64 h-6 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="flex justify-between">
                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
