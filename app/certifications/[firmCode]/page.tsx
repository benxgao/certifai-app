import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import CertificationsOverviewClient from '@/src/components/custom/CertificationsOverviewClient';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { fetchCertificationsData } from '@/src/lib/server-actions/certifications';

interface Props {
  params: Promise<{ firmCode: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { firmCode } = resolvedParams;

  // Fetch certification data for better SEO metadata
  const { firms } = await fetchCertificationsData();
  const firm = firms?.find((f) => f.code.toLowerCase() === firmCode.toLowerCase());

  if (firm) {
    return {
      title: `${firm.name} Certifications | Certestic`,
      description:
        firm.description ||
        `Explore ${firm.name} certification programs with AI-powered training materials, practice questions, and detailed study guides.`,
      keywords: `${firm.name}, ${firmCode}, IT certification, exam preparation, practice questions, training`,
      openGraph: {
        title: `${firm.name} Certifications | Certestic`,
        description:
          firm.description ||
          `Explore ${firm.name} certification programs with AI-powered training materials.`,
        type: 'website',
      },
    };
  }

  return {
    title: `${firmCode.toUpperCase()} Certifications | Certestic`,
    description: `Explore ${firmCode.toUpperCase()} certification programs with AI-powered training materials, practice questions, and detailed study guides.`,
    keywords: `${firmCode}, IT certification, exam preparation, practice questions, training`,
  };
}

export default async function FirmCertificationsPage({ params }: Props) {
  const resolvedParams = await params;
  const { firmCode } = resolvedParams;

  // Validate firmCode (should be alphanumeric, typically 2-6 characters)
  if (!/^[a-zA-Z0-9]{1,10}$/i.test(firmCode)) {
    notFound();
  }

  // Fetch certification data server-side
  const { firms, error } = await fetchCertificationsData();

  // Find the specific firm
  const firm = firms?.find((f) => f.code.toLowerCase() === firmCode.toLowerCase());

  if (!firm && !error) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
    {
      label: firm?.name || firmCode.toUpperCase(),
      href: `/certifications/${firmCode}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Navigation */}
      <LandingHeader showFeaturesLink={false} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {firm?.name || firmCode.toUpperCase()} Certifications
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl">
            {firm?.description ||
              `Explore certification programs from ${firmCode.toUpperCase()}. Each certification is designed to validate your skills and advance your career in the ever-evolving tech industry.`}
          </p>
        </div>

        <Suspense fallback={<CertificationsOverviewSkeleton />}>
          <CertificationsOverviewClient
            initialFirms={firms && firm ? [firm] : []}
            initialError={error}
            defaultFirmFilter={firmCode}
          />
        </Suspense>
      </div>
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
              <div className="w-16 h-10 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Skeleton */}
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="p-4 border rounded-lg">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
