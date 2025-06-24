import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CertificationDetail from '@/src/components/custom/CertificationDetail';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { generatePublicJWTToken, makePublicAPIRequest } from '@/src/lib/jwt-utils';

interface Props {
  params: Promise<{
    certId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const certId = resolvedParams.certId;

  // Fetch certification data for better SEO metadata
  try {
    const token = await generatePublicJWTToken();
    if (token) {
      const response = await makePublicAPIRequest(`/certifications/${certId}`, token);
      if (response.ok) {
        const result = await response.json();
        const cert = result.data;

        if (cert) {
          return {
            title: `${cert.name} | CertifAI`,
            description:
              cert.description ||
              'IT certification information and training materials. Prepare with AI-powered practice questions and study materials.',
            keywords: `${cert.name}, IT certification, exam preparation, practice questions, training`,
            openGraph: {
              title: `${cert.name} | CertifAI`,
              description:
                cert.description || 'IT certification information and training materials.',
              type: 'article',
            },
          };
        }
      }
    }
  } catch (error) {
    console.error('Error fetching certification metadata:', error);
  }

  // Fallback metadata
  return {
    title: `Certification ${certId} | CertifAI`,
    description:
      'IT certification information and training materials. Prepare with AI-powered practice questions and study materials.',
    keywords: 'IT certification, exam preparation, practice questions, training',
    openGraph: {
      title: `Certification ${certId} | CertifAI`,
      description:
        'IT certification information and training materials. Prepare with AI-powered practice questions and study materials.',
      type: 'article',
      url: `https://certifai.app/certifications/${certId}`,
    },
    twitter: {
      title: `Certification ${certId} | CertifAI`,
      description:
        'IT certification information and training materials. Prepare with AI-powered practice questions and study materials.',
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `/certifications/${certId}`,
    },
  };
}

export default async function CertificationPage({ params }: Props) {
  const resolvedParams = await params;
  const certId = resolvedParams.certId;

  // Validate certId is a number
  if (!/^\d+$/.test(certId)) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
    {
      label: `Certification ${certId}`,
      href: `/certifications/${certId}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <Suspense fallback={<CertificationDetailSkeleton />}>
          <CertificationDetail certId={certId} />
        </Suspense>
      </div>
    </div>
  );
}

function CertificationDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-3">
            <div className="w-96 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Related Certifications Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
