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
import { linkifyText } from '@/src/lib/text-utils';

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
        const response = await fetch(`/api/public/certifications/${certId}`);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 via-red-200 to-red-300 dark:from-red-900/40 dark:via-red-800/40 dark:to-red-700/40 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {error || 'Certification not found'}
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We couldn&apos;t find the certification you&apos;re looking for. Let&apos;s get you
              back on track.
            </p>
            <Link href="/certifications">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 border-2 border-slate-300 hover:border-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Browse All Certifications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CertificationJsonLd certification={certification} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 sm:space-y-6 px-4 sm:px-0">
            <div className="flex items-center justify-center gap-3 mb-4">
              {certification.firm.logo_url && (
                <Image
                  src={certification.firm.logo_url}
                  alt={`${certification.firm.name} logo`}
                  width={48}
                  height={48}
                  className="h-10 sm:h-12 w-auto"
                />
              )}
              <Badge
                variant="secondary"
                className="text-base sm:text-lg px-4 py-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300"
              >
                {certification.firm.name}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-2">
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Master the {certification.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-light px-2">
              Advance your career with comprehensive training for the {certification.name}. Start
              your certification journey today with AI-powered learning that adapts to your needs.
              certification journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link href={`/certifications/${firmCode}/${certId}`}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  <FaGraduationCap className="mr-2" />
                  Start Learning Now
                </Button>
              </Link>
              <Link href={`/certifications/${firmCode}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  <FaBook className="mr-2" />
                  View All {certification.firm.name} Certs
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            <Card className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-700/40 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <FaBullseye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Comprehensive Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete exam preparation covering all topics to ensure you&apos;re fully prepared
                  for certification success.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-green-300/60 dark:hover:border-green-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <FaChartLine className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  High Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Achieve success with our proven study methodology and comprehensive training
                  materials.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-purple-300/60 dark:hover:border-purple-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-900/40 dark:via-purple-800/40 dark:to-purple-700/40 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <FaUsers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Track Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Monitor your learning progress and get detailed insights throughout your
                  certification journey.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">
                Why Choose This Training?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <FaStar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Expert Content</p>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {certification.pass_score}%
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Pass Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardHeader className="p-8 sm:p-12 pb-6">
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                What You&apos;ll Learn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 pt-0">
              <div className="prose max-w-none">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8">
                  {linkifyText(certification.description)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Comprehensive exam preparation
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Real-world application examples
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Expert tips and strategies
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Industry best practices
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Certifications */}
          {certification.related_certifications &&
            certification.related_certifications.length > 0 && (
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
                <CardHeader className="p-8 sm:p-12 pb-6">
                  <CardTitle className="text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
                    Related Certifications
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mt-4">
                    Expand your expertise with these related {certification.firm.name}{' '}
                    certifications
                  </p>
                </CardHeader>
                <CardContent className="p-8 sm:p-12 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certification.related_certifications.map((related) => (
                      <Card
                        key={related.cert_id}
                        className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl"
                      >
                        <CardContent className="p-6">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {related.name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                            {related.description}
                          </p>
                          <Link
                            href={`/certifications/${firmCode}/${related.cert_id}`}
                            className="block"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:border-violet-300 dark:group-hover:border-violet-600 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-all rounded-lg"
                            >
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
          <Card className="bg-gradient-to-r from-violet-600 to-blue-600 text-white mx-4 sm:mx-0 rounded-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>

              <div className="relative max-w-4xl mx-auto">
                <FaGraduationCap className="text-6xl mb-6 mx-auto opacity-90" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                  Ready to Get Certified?
                </h2>
                <p className="text-xl sm:text-2xl mb-8 sm:mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto">
                  Start your journey to {certification.name} certification today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <Link href={`/certifications/${firmCode}/${certId}`}>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-violet-600 hover:bg-slate-50"
                    >
                      <FaGraduationCap className="mr-2" />
                      Begin Training
                    </Button>
                  </Link>
                  {certification.firm.website_url && (
                    <a
                      href={certification.firm.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white hover:text-violet-600 transition-all duration-200"
                      >
                        <FaExternalLinkAlt className="mr-2" />
                        Official {certification.firm.name} Site
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function MarketingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
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
          <div className="w-3/4 h-12 sm:h-16 bg-gradient-to-r from-violet-200 to-blue-200 dark:from-violet-800 dark:to-blue-800 rounded-2xl animate-pulse mx-auto" />
          <div className="w-2/3 h-6 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse mx-auto" />
          <div className="flex justify-center gap-4">
            <div className="w-32 h-12 bg-violet-200 dark:bg-violet-800 rounded-xl animate-pulse" />
            <div className="w-32 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Features Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8"
            >
              <div className="w-16 h-16 bg-violet-200 dark:bg-violet-800 rounded-3xl animate-pulse mb-6" />
              <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section Skeleton */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-10 bg-violet-200 dark:bg-violet-800 rounded animate-pulse mx-auto mb-2" />
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
