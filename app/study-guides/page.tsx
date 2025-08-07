'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { BookOpen, ArrowLeft, Sparkles, Target, TrendingUp, CheckCircle } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

/**
 * Study Guides page - Coming Soon feature page
 * This feature is planned for Q3 2025 as indicated in the roadmap
 */
export default function StudyGuidesPage() {
  return (
    <>
      <LandingHeader />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
          <div className="absolute top-10 right-4 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-4 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Back button */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>

              {/* Main heading */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-violet-100 dark:bg-violet-900/30 rounded-full px-6 py-3 mb-6">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                    Coming Q3 2025
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    AI Study Guides
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
                  Personalized study paths powered by AI that adapt to your knowledge gaps and help
                  you learn more effectively for your IT certifications.
                </p>
              </div>

              {/* Feature preview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">AI-Powered Adaptation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Smart algorithms that identify your weak areas and create personalized study
                      paths
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Focused Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Spend time only on topics you need to master, making your study time more
                      efficient
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Real-time progress tracking with detailed analytics and improvement
                      recommendations
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What to expect section */}
        <section className="py-16 bg-white/50 dark:bg-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-12">
                What to Expect
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Adaptive Learning Paths
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        AI analyzes your performance and creates custom study sequences
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Interactive Content
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Engaging study materials with multimedia and hands-on exercises
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Smart Recommendations
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Personalized suggestions for additional practice and resources
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Knowledge Gap Analysis
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Identify specific areas that need more attention
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Certification-Specific Guides
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Tailored content for AWS, Azure, GCP, and other certifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Mobile-Friendly
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Study anywhere with responsive design and offline capabilities
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Don&apos;t Wait - Start Learning Now!
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                While AI Study Guides are in development, you can start using our current AI-powered
                practice exams to advance your certification journey today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                  >
                    Start Free Beta Now
                  </Button>
                </Link>

                <Link href="/coming-soon">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    View All Coming Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
