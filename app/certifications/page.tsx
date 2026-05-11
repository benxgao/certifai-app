import { Suspense } from 'react';
import Link from 'next/link';
import CertificationsOverviewClient from '@/src/components/custom/CertificationsOverviewClient';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  MarketingBadge,
  MarketingCard,
  MarketingHeading,
  MarketingPageShell,
  MarketingSection,
} from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';

import { fetchCertificationsData } from '@/src/lib/server-actions/certifications';

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
    <MarketingPageShell className="certifications-page">
      {/* Header with Navigation */}
      <LandingHeader />

      {/* Hero Section with decorative background */}
      <MarketingSection className="certifications-hero py-8 sm:py-12 lg:py-16">
        <div className="relative">
          <Breadcrumb items={breadcrumbItems} className="mb-8 sm:mb-12" />

          <div className="certifications-hero-content text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <MarketingBadge>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span>100+ Certifications Available</span>
            </MarketingBadge>

            <MarketingHeading level="hero" as="h1" className="certifications-hero-title">
              <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                IT Certifications Catalog
              </span>
            </MarketingHeading>

            <p className="certifications-hero-description text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Explore certification programs from leading technology companies. Create personalized practice exams with AI-powered simulation and advance your career.
            </p>
          </div>
        </div>
      </MarketingSection>

      {/* Category Navigation Section */}
      <MarketingSection className="certifications-category-section bg-white/60 dark:bg-slate-800/60">
        <div>
          <div className="certifications-category-header text-center mb-16">
            <MarketingHeading level="section" as="h2" className="certifications-category-title mb-4">
              Browse by Category
            </MarketingHeading>
            <p className="certifications-category-description text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Explore certifications organized by technology focus areas and career paths
            </p>
          </div>

          <div className="certifications-category-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Cloud Computing */}
            <Link href="/certifications/categories/cloud">
              <MarketingCard variant="interactive" className="category-card category-card-cloud group rounded-2xl">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <h3 className="category-card-title text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight line-clamp-3 leading-tight min-h-18 flex items-start">
                    Cloud Computing
                  </h3>
                  <p className="category-card-description text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-auto mb-6">
                    AWS, Azure, GCP certifications for cloud architects and engineers
                  </p>
                  <button className="category-card-button mt-auto rounded-lg px-6 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-700/40 hover:bg-slate-200 dark:hover:bg-slate-600/60 transition-colors duration-200">
                    Explore
                  </button>
                </CardContent>
              </MarketingCard>
            </Link>

            {/* Cybersecurity */}
            <Link href="/certifications/categories/security">
              <MarketingCard variant="interactive" className="category-card category-card-security group rounded-2xl">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <h3 className="category-card-title text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight line-clamp-3 leading-tight min-h-18 flex items-start">
                    Cybersecurity
                  </h3>
                  <p className="category-card-description text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-auto mb-6">
                    Security+, CISSP, CEH certifications for security professionals
                  </p>
                  <button className="category-card-button mt-auto rounded-lg px-6 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-700/40 hover:bg-slate-200 dark:hover:bg-slate-600/60 transition-colors duration-200">
                    Explore
                  </button>
                </CardContent>
              </MarketingCard>
            </Link>

            {/* Networking */}
            <Link href="/certifications/categories/networking">
              <MarketingCard variant="interactive" className="category-card category-card-networking group rounded-2xl">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <h3 className="category-card-title text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight line-clamp-3 leading-tight min-h-18 flex items-start">
                    Networking
                  </h3>
                  <p className="category-card-description text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-auto mb-6">
                    CCNA, Network+, CCNP certifications for network engineers
                  </p>
                  <button className="category-card-button mt-auto rounded-lg px-6 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-700/40 hover:bg-slate-200 dark:hover:bg-slate-600/60 transition-colors duration-200">
                    Explore
                  </button>
                </CardContent>
              </MarketingCard>
            </Link>
          </div>
        </div>
      </MarketingSection>

      {/* Content Section */}
      <MarketingSection className="certifications-content-section bg-slate-50/50 dark:bg-slate-800/30">
        <div className="relative">
          <Suspense fallback={<CertificationsOverviewSkeleton />}>
            <CertificationsOverviewClient
              initialFirms={firms}
              initialError={error}
              defaultFirmFilter={firmFilter}
            />
          </Suspense>
        </div>
      </MarketingSection>
    </MarketingPageShell>
  );
}

function CertificationsOverviewSkeleton() {
  return (
    <div className="certifications-skeleton space-y-8">
      {/* Stats skeleton */}
      <div className={`skeleton-stats-card ${marketingTheme.surface.card} rounded-2xl p-8`}>
        <div className="skeleton-stats-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-stat-item text-center">
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-3" />
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
        <div className="skeleton-search-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Firm cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`skeleton-firm-card ${marketingTheme.surface.card} rounded-2xl p-8`}
        >
          <div className="skeleton-firm-header flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="skeleton-firm-info space-y-3">
              <div className="w-48 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="skeleton-cert-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="skeleton-cert-card p-6 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
                <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
