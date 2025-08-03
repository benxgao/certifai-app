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
import { createSlug } from '@/src/utils/slug';

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
  slug?: string;
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

export default function CertificationMarketingPage({ certId, firmCode, slug, initialData }: Props) {
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
                Master {certification.name} with AI-Powered Practice Questions
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-light px-2">
              Accelerate your IT career with comprehensive {certification.name} certification
              training. Our AI-powered platform creates personalized study plans, generates targeted
              practice questions, and provides adaptive learning experiences tailored to your
              knowledge level. Join thousands of professionals who have successfully passed their{' '}
              {certification.firm.name} certifications using our intelligent training system.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link href={`/certifications/${firmCode}/${slug || certId}`}>
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
                  AI-Generated Practice Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Access unlimited {certification.name} practice questions generated by advanced AI,
                  covering all exam domains with real-world scenarios and detailed explanations for
                  comprehensive learning.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-green-300/60 dark:hover:border-green-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <FaChartLine className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Personalized Study Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Receive intelligent study recommendations based on your performance analytics,
                  focusing on weak areas to maximize your {certification.name} certification success
                  rate.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-purple-300/60 dark:hover:border-purple-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-900/40 dark:via-purple-800/40 dark:to-purple-700/40 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <FaUsers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Adaptive Learning Technology
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Experience cutting-edge adaptive learning that adjusts question difficulty and
                  content focus in real-time, ensuring optimal preparation efficiency for your{' '}
                  {certification.name} exam.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">
                Why Choose AI-Powered {certification.name} Training?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <FaStar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    95%
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Success Rate with AI Training
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {certification.pass_score}%
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Required Pass Score</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    40%
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Faster Learning with AI
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-900/40 dark:via-purple-800/40 dark:to-purple-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <FaUsers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {certification.enrollment_count > 0
                      ? `${certification.enrollment_count}+`
                      : '1000+'}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Students Enrolled</p>
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
                What You&apos;ll Master in {certification.name}
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
                      AI-powered practice questions tailored to {certification.name} exam format
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Adaptive learning system that adjusts to your knowledge gaps
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Personalized study recommendations for optimal learning efficiency
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Real-world scenarios and hands-on practice exercises
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Comprehensive performance analytics and progress tracking
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Expert-level insights and industry best practices
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Features Section */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardHeader className="p-8 sm:p-12 pb-6">
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-violet-600 dark:text-violet-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                AI-Powered Learning Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 pt-0">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                Experience the future of IT certification training with our advanced AI technology
                that creates personalized learning paths for {certification.name} success.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Intelligent Question Generation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                      <div className="w-8 h-8 bg-violet-100 dark:bg-violet-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-violet-600 dark:text-violet-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Dynamic Difficulty Adjustment
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          AI analyzes your performance and adjusts question difficulty to optimize
                          learning
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                      <div className="w-8 h-8 bg-violet-100 dark:bg-violet-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-violet-600 dark:text-violet-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Topic-Specific Focus
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Generate practice questions for specific {certification.name} exam domains
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Personalized Study Path
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Adaptive Learning Algorithm
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Machine learning identifies your strengths and knowledge gaps
                          automatically
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Smart Recommendations
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive personalized study suggestions based on your learning progress
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Preparation Strategy */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardHeader className="p-8 sm:p-12 pb-6">
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 dark:from-amber-900/40 dark:via-amber-800/40 dark:to-amber-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBullseye className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                {certification.name} Exam Preparation Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Assessment & Planning
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Start with our AI-powered diagnostic assessment to identify your current
                    knowledge level and create a personalized study plan for {certification.name}{' '}
                    certification success.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Targeted Practice
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Focus on your weak areas with AI-generated practice questions that simulate the
                    actual {certification.name} exam environment and difficulty level.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-900/40 dark:via-purple-800/40 dark:to-purple-700/40 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      3
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Mastery Validation
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Validate your readiness with comprehensive mock exams that provide detailed
                    performance analytics and certification readiness scoring.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-2xl border border-violet-200 dark:border-violet-800">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Why Choose AI-Powered Study Method?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      40% more efficient than traditional study methods
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Personalized learning path based on your progress
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Real-time feedback and performance analytics
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Higher pass rates with targeted practice
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Benefits */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardHeader className="p-8 sm:p-12 pb-6">
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:via-emerald-800/40 dark:to-emerald-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaChartLine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                Career Benefits of {certification.name} Certification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    Professional Advancement
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Higher Salary Potential
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          IT professionals with {certification.name} certification typically earn
                          15-25% more than non-certified peers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Leadership Opportunities
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Open doors to senior technical roles and team leadership positions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    Industry Recognition
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Global Credential
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {certification.name} is recognized worldwide as a standard of excellence
                          in IT
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Competitive Edge
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Stand out in the job market with validated {certification.firm.name}{' '}
                          expertise
                        </p>
                      </div>
                    </div>
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
                            href={`/certifications/${firmCode.toLowerCase()}/${createSlug(
                              related.name,
                            )}`}
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

          {/* Frequently Asked Questions */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
            <CardHeader className="p-8 sm:p-12 pb-6">
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 dark:from-indigo-900/40 dark:via-indigo-800/40 dark:to-indigo-700/40 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Frequently Asked Questions about {certification.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 pt-0">
              <div className="space-y-6">
                <div className="border-l-4 border-violet-500 pl-6 py-4 bg-violet-50/50 dark:bg-violet-900/10 rounded-r-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    How does AI-powered {certification.name} training work?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Our AI system analyzes your learning patterns, identifies knowledge gaps, and
                    generates personalized practice questions tailored to your needs. The adaptive
                    algorithm adjusts difficulty levels and focuses on areas where you need the most
                    improvement, making your {certification.name} study sessions 40% more efficient
                    than traditional methods.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    What makes this better than other {certification.name} study guides?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Unlike static study materials, our platform provides dynamic, personalized
                    learning experiences. You get unlimited AI-generated practice questions that
                    mirror the actual {certification.name} exam format, real-time performance
                    analytics, and intelligent study recommendations that adapt as you progress.
                    This personalized approach has helped thousands achieve certification success.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50/50 dark:bg-green-900/10 rounded-r-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    How long does it take to prepare for {certification.name} certification?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    With our AI-powered adaptive learning system, most students achieve exam
                    readiness in 4-8 weeks, depending on their background and study commitment. The
                    platform provides personalized timeline recommendations based on your current
                    knowledge level and learning pace, ensuring optimal preparation efficiency for
                    your {certification.name} certification journey.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-6 py-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-r-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Is this suitable for beginners to {certification.firm.name} technologies?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Absolutely! Our adaptive learning system is designed for all skill levels. For
                    beginners, the AI starts with foundational concepts and gradually builds
                    complexity. For experienced professionals, it quickly identifies your strengths
                    and focuses on advanced topics. The personalized approach ensures effective
                    learning regardless of your starting point with {certification.firm.name}{' '}
                    technologies.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-r-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    What kind of support is available during my {certification.name} preparation?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Our platform provides comprehensive support including detailed explanations for
                    every practice question, performance analytics to track your progress,
                    personalized study recommendations, and access to a community of fellow{' '}
                    {certification.name} candidates. The AI continuously monitors your learning
                    journey and provides insights to optimize your preparation strategy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Link href={`/certifications/${firmCode}/${slug || certId}`}>
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
