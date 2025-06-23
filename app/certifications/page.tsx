import { Metadata } from 'next';
import { Suspense } from 'react';
import CertificationsOverviewClient from '@/src/components/custom/CertificationsOverviewClient';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { fetchCertificationsData } from '@/src/lib/server-actions/certifications';

export const metadata: Metadata = {
  title: 'All IT Certifications by Leading Firms | CertifAI',
  description:
    'Browse all available IT certifications organized by leading technology companies. Find AWS, Microsoft, Google, Cisco, and more certification programs with AI-powered training.',
  keywords:
    'IT certifications, AWS certifications, Microsoft certifications, Google Cloud certifications, Cisco certifications, certification catalog, IT training programs, technology certifications',
  openGraph: {
    title: 'All IT Certifications by Leading Firms | CertifAI',
    description:
      'Browse all available IT certifications organized by leading technology companies. Find AWS, Microsoft, Google, Cisco, and more certification programs with AI-powered training.',
    type: 'website',
    url: 'https://certifai.app/certifications',
  },
  twitter: {
    title: 'All IT Certifications by Leading Firms | CertifAI',
    description:
      'Browse all available IT certifications organized by leading technology companies. Find AWS, Microsoft, Google, Cisco, and more certification programs with AI-powered training.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/certifications',
  },
};

export default async function CertificationsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
  ];

  // Fetch certification data server-side
  const { firms, error } = await fetchCertificationsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IT Certifications Catalog</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore certification programs from leading technology companies. Each certification is
            designed to validate your skills and advance your career in the ever-evolving tech
            industry.
          </p>
        </div>

        <Suspense fallback={<CertificationsOverviewSkeleton />}>
          <CertificationsOverviewClient initialFirms={firms} initialError={error} />
        </Suspense>
      </div>
    </div>
  );
}

function CertificationsOverviewSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="p-4 border rounded-lg">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
