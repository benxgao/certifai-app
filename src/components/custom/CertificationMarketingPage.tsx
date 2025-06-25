'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FaUsers,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaChartLine,
  FaStar,
  FaCheckCircle,
  FaBook,
  FaBullseye,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import CertificationJsonLd from '@/src/components/seo/JsonLd';

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
  firmCode: string;
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

export default function CertificationMarketingPage({ certId, firmCode, initialData }: Props) {
  const [certification, setCertification] = useState<CertificationDetailData | null>(null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have initial data, convert it to the expected format
    if (initialData) {
      const convertedData: CertificationDetailData = {
        cert_id: initialData.cert_id,
        name: initialData.name,
        description: initialData.description,
        min_quiz_counts: initialData.min_quiz_counts,
        max_quiz_counts: initialData.max_quiz_counts,
        pass_score: initialData.pass_score,
        created_at: initialData.created_at,
        updated_at: initialData.created_at, // Use created_at as fallback
        firm: {
          id: initialData.firm_id,
          name: 'Loading...', // Will be filled by the API call if needed
          code: firmCode.toUpperCase(),
          description: '',
          website_url: null,
          logo_url: null,
        },
        enrollment_count: 0,
        related_certifications: [],
      };
      setCertification(convertedData);
      setLoading(false);
      return;
    }

    const fetchCertification = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the server-side API endpoint that handles JWT authentication
        const response = await fetch(`/api/certifications/${certId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Certification not found');
          }
          throw new Error('Failed to fetch certification details');
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setCertification(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching certification:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (certId) {
      fetchCertification();
    }
  }, [certId, firmCode, initialData]);

  if (loading) {
    return <MarketingPageSkeleton />;
  }

  if (error || !certification) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Certification not found'}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find the certification you&apos;re looking for.
        </p>
        <Link href="/certifications">
          <Button>Browse All Certifications</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <CertificationJsonLd certification={certification} />

      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            {certification.firm.logo_url && (
              <Image
                src={certification.firm.logo_url}
                alt={`${certification.firm.name} logo`}
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            )}
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {certification.firm.name}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Master the {certification.name}
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advance your career with comprehensive training for the {certification.name}. Join{' '}
            {certification.enrollment_count.toLocaleString()}+ professionals who have already
            started their journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/certifications/${firmCode}/${certId}`}>
              <Button size="lg" className="px-8 py-3 text-lg">
                <FaGraduationCap className="mr-2" />
                Start Learning Now
              </Button>
            </Link>
            <Link href={`/certifications/${firmCode}`}>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                <FaBook className="mr-2" />
                View All {certification.firm.name} Certs
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FaBullseye className="text-4xl text-blue-600 mx-auto mb-4" />
              <CardTitle>Comprehensive Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {certification.min_quiz_counts} to {certification.max_quiz_counts} practice
                questions covering all exam topics to ensure you&apos;re fully prepared.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FaChartLine className="text-4xl text-green-600 mx-auto mb-4" />
              <CardTitle>High Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Achieve success with our proven study methodology and expert-crafted practice exams.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FaUsers className="text-4xl text-purple-600 mx-auto mb-4" />
              <CardTitle>Join the Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Connect with {certification.enrollment_count.toLocaleString()}+ learners and get
                support throughout your certification journey.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Training?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {certification.enrollment_count.toLocaleString()}+
                </div>
                <p className="text-gray-600">Students Enrolled</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {certification.max_quiz_counts}
                </div>
                <p className="text-gray-600">Practice Questions</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  <FaStar className="inline" />
                </div>
                <p className="text-gray-600">Expert Content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Learn */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              What You&apos;ll Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{certification.description}</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Comprehensive exam preparation</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Real-world application examples</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Practice tests and quizzes</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Expert tips and strategies</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Certifications */}
        {certification.related_certifications &&
          certification.related_certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Related Certifications</CardTitle>
                <p className="text-gray-600">
                  Expand your expertise with these related {certification.firm.name} certifications
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certification.related_certifications.map((related) => (
                    <Card key={related.cert_id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{related.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {related.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>
                            {related.min_quiz_counts}-{related.max_quiz_counts} questions
                          </span>
                        </div>
                        <Link
                          href={`/certifications/${firmCode}/${related.cert_id}`}
                          className="mt-3 block"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            Learn More
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Certified?</h2>
            <p className="text-xl mb-6 opacity-90">
              Start your journey to {certification.name} certification today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/certifications/${firmCode}/${certId}`}>
                <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                  <FaGraduationCap className="mr-2" />
                  Begin Training
                </Button>
              </Link>
              {certification.firm.website_url && (
                <a href={certification.firm.website_url} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Official {certification.firm.name} Site
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function MarketingPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Section Skeleton */}
      <div className="text-center space-y-6">
        <div className="w-3/4 h-12 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="w-2/3 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="flex justify-center gap-4">
          <div className="w-32 h-12 bg-blue-200 rounded animate-pulse" />
          <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-200 rounded animate-pulse mb-4" />
            <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section Skeleton */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-10 bg-blue-200 rounded animate-pulse mx-auto mb-2" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
