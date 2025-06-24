import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { generatePublicJWTToken, makePublicAPIRequest } from '@/src/lib/jwt-utils';
import CertificationMarketingPage from '@/src/components/custom/CertificationMarketingPage';

interface Props {
  params: Promise<{ firmCode: string; certId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { firmCode, certId } = resolvedParams;

  // Fetch certification data for better SEO metadata
  try {
    const token = await generatePublicJWTToken();
    if (token) {
      const response = await makePublicAPIRequest(`/certifications/${certId}`, token);
      if (response.ok) {
        const result = await response.json();
        const cert = result.data;

        if (cert) {
          const firm = cert.firm;
          return {
            title: `${cert.name} - ${firm.name} Certification Training | CertifAI`,
            description: `Master the ${cert.name} certification with AI-powered training. Get personalized study plans, practice exams, and detailed progress tracking for ${firm.name} certifications.`,
            keywords: `${cert.name}, ${firm.name}, ${firmCode}, IT certification training, exam preparation, practice questions, AI-powered learning, study guide`,
            openGraph: {
              title: `${cert.name} - ${firm.name} Certification Training | CertifAI`,
              description: `Master the ${cert.name} certification with AI-powered training. Get personalized study plans, practice exams, and detailed progress tracking.`,
              type: 'website',
            },
          };
        }
      }
    }
  } catch (error) {
    console.error('Error fetching certification for metadata:', error);
  }

  return {
    title: `${firmCode.toUpperCase()} Certification Training | CertifAI`,
    description: `Master your ${firmCode.toUpperCase()} certification with AI-powered training. Get personalized study plans, practice exams, and detailed progress tracking.`,
    keywords: `${firmCode}, certification training, exam preparation, practice questions, AI-powered learning, study guide`,
  };
}

export default async function CertificationMarketingPageRoute({ params }: Props) {
  const resolvedParams = await params;
  const { firmCode, certId } = resolvedParams;

  // Validate certId is a number
  if (!/^\d+$/.test(certId)) {
    notFound();
  }

  // Validate firmCode (should be alphanumeric, typically 2-6 characters)
  if (!/^[a-zA-Z0-9]{1,10}$/i.test(firmCode)) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
    {
      label: firmCode.toUpperCase(),
      href: `/certifications?firm=${firmCode}`,
    },
    {
      label: `Certification ${certId}`,
      href: `/certifications/${firmCode}/${certId}`,
    },
    {
      label: 'Training',
      href: `/certifications/${firmCode}/${certId}/marketing`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <Suspense fallback={<CertificationMarketingPageSkeleton />}>
          <CertificationMarketingPage certId={certId} firmCode={firmCode} />
        </Suspense>
      </div>
    </div>
  );
}

function CertificationMarketingPageSkeleton() {
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
