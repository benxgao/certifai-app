import { Metadata } from 'next';
import { Suspense } from 'react';
import CertificationsOverviewClient from '@/src/components/custom/CertificationsOverviewClient';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { fetchCertificationsData } from '@/src/lib/server-actions/certifications';

export const metadata: Metadata = {
  title: 'All IT Certifications - Simulate Exams by AI & Prepare by Self Exams | Certestic',
  description:
    'Browse all available IT certifications organized by leading technology companies. Simulate exams by AI and prepare for IT certification by self exams with AWS, Microsoft, Google, Cisco, and more certification programs.',
  keywords:
    'IT certifications, simulate exams by AI, prepare for IT certification by self exams, AWS certifications, Microsoft certifications, Google Cloud certifications, Cisco certifications, certification catalog, IT training programs, technology certifications, self exam preparation',
  openGraph: {
    title: 'All IT Certifications - Simulate Exams by AI & Prepare by Self Exams | Certestic',
    description:
      'Browse all available IT certifications organized by leading technology companies. Simulate exams by AI and prepare for IT certification by self exams with AWS, Microsoft, Google, Cisco, and more certification programs.',
    type: 'website',
    url: 'https://certestic.com/certifications',
  },
  twitter: {
    title: 'All IT Certifications - Simulate Exams by AI & Prepare by Self Exams | Certestic',
    description:
      'Browse all available IT certifications organized by leading technology companies. Simulate exams by AI and prepare for IT certification by self exams with AWS, Microsoft, Google, Cisco, and more certification programs.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/certifications',
  },
};

export default async function CertificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
  ]; // Fetch certification data server-side
  const { firms, error } = await fetchCertificationsData();

  // Get firm filter from search params
  const resolvedSearchParams = await searchParams;
  const firmFilter =
    typeof resolvedSearchParams.firm === 'string' ? resolvedSearchParams.firm : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
      {/* Header with Navigation */}
      <LandingHeader />

      {/* Hero Section with decorative background */}
      <section className="relative overflow-hidden" role="banner">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute top-20 right-2 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-2 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8 sm:mb-12 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-3 py-1 mb-4 sm:mb-6">
              <div
                className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"
                aria-hidden="true"
              ></div>
              <span className="text-xs sm:text-sm font-medium text-violet-700 dark:text-violet-300">
                AI-Powered Certification Training
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                IT Certifications Catalog
              </span>
              <br />
              Simulate Exams by AI
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed font-light">
              Explore certification programs from leading technology companies and prepare for IT
              certification by self exams. Each certification is designed to validate your skills
              and advance your career with AI-powered exam simulation technology.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-8 sm:py-12 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/5 dark:via-transparent dark:to-blue-900/5"></div>
        <div className="absolute top-10 sm:top-20 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-violet-200/10 dark:bg-violet-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<CertificationsOverviewSkeleton />}>
            <CertificationsOverviewClient
              initialFirms={firms}
              initialError={error}
              defaultFirmFilter={firmFilter}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function CertificationsOverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-slate-900/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-2" />
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Firm cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-slate-900/20 border border-slate-200/60 dark:border-slate-700/60 p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
