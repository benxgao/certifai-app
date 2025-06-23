import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CertificationDetail from '@/src/components/custom/CertificationDetail';
import Breadcrumb from '@/src/components/custom/Breadcrumb';

interface Props {
  params: {
    certId: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const certId = params.certId;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications/${certId}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );

    if (!response.ok) {
      return {
        title: 'Certification Not Found | CertifAI',
        description: 'The requested certification could not be found.',
      };
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return {
        title: 'Certification Not Found | CertifAI',
        description: 'The requested certification could not be found.',
      };
    }

    const cert = result.data;
    const firmName = cert.firm?.name || 'Unknown';

    return {
      title: `${cert.name} - ${firmName} Certification | CertifAI`,
      description:
        cert.description ||
        `Learn about ${cert.name} certification from ${firmName}. Prepare with AI-powered practice questions and study materials.`,
      keywords: `${cert.name}, ${firmName} certification, IT certification, exam preparation, practice questions, ${firmName} training`,
      openGraph: {
        title: `${cert.name} - ${firmName} Certification | CertifAI`,
        description:
          cert.description ||
          `Learn about ${cert.name} certification from ${firmName}. Prepare with AI-powered practice questions and study materials.`,
        type: 'article',
        url: `https://certifai.app/certifications/${certId}`,
        images: cert.firm?.logo_url
          ? [
              {
                url: cert.firm.logo_url,
                width: 400,
                height: 400,
                alt: `${firmName} logo`,
              },
            ]
          : undefined,
      },
      twitter: {
        title: `${cert.name} - ${firmName} Certification | CertifAI`,
        description:
          cert.description ||
          `Learn about ${cert.name} certification from ${firmName}. Prepare with AI-powered practice questions and study materials.`,
        card: 'summary_large_image',
      },
      alternates: {
        canonical: `/certifications/${certId}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Certification | CertifAI',
      description: 'IT certification information and training materials.',
    };
  }
}

export default async function CertificationPage({ params }: Props) {
  const certId = params.certId;

  // Validate certId is a number
  if (!/^\d+$/.test(certId)) {
    notFound();
  }

  // Fetch certification data for breadcrumb
  let certification = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications/${certId}`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        certification = result.data;
      }
    }
  } catch (error) {
    console.error('Error fetching certification for breadcrumb:', error);
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
    ...(certification
      ? [
          {
            label: certification.name,
            href: `/certifications/${certId}`,
          },
        ]
      : [
          {
            label: `Certification ${certId}`,
            href: `/certifications/${certId}`,
          },
        ]),
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
