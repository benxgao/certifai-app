import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import CertificationDetail from '@/src/components/custom/CertificationDetail';
import { fetchCertificationData } from '@/src/lib/server-actions/certifications';

interface Props {
  params: Promise<{
    certId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { certId } = resolvedParams;

  // Validate certId is a number
  if (!/^\d+$/.test(certId)) {
    return {
      title: 'Certification Not Found | CertifAI',
      description: 'The requested certification could not be found.',
    };
  }

  try {
    // Fetch certification data using server-side authenticated request
    const { certification: certData, error: fetchError } = await fetchCertificationData(certId);

    if (fetchError) {
      console.error('Error fetching certification for metadata:', fetchError);
    }

    if (certData) {
      return {
        title: `${certData.name} | CertifAI`,
        description:
          certData.description ||
          `Learn about ${certData.name} certification - exam details, study materials, and career benefits.`,
        keywords: `${certData.name}, IT certification, exam preparation, practice questions, training`,
        openGraph: {
          title: `${certData.name} | CertifAI`,
          description: certData.description || `Learn about ${certData.name} certification`,
          type: 'website',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching certification for metadata:', error);
  }

  return {
    title: `Certification Details | CertifAI`,
    description: 'Explore certification details, exam information, and study materials.',
  };
}

export default async function CertificationPage({ params }: Props) {
  const resolvedParams = await params;
  const { certId } = resolvedParams;

  // Validate certId is a number
  if (!/^\d+$/.test(certId)) {
    notFound();
  }

  let certification = null;
  let error = null;

  try {
    // Fetch certification data using server-side authenticated request
    const { certification: certData, error: fetchError } = await fetchCertificationData(certId);

    if (fetchError) {
      console.error('Error fetching certification:', fetchError);
      error = fetchError;
    } else if (certData) {
      certification = certData;
      // Note: firm data might need to be fetched separately if needed for breadcrumbs
    } else {
      notFound();
    }
  } catch (err) {
    console.error('Error fetching certification:', err);
    error = 'Failed to load certification';
  }

  if (!certification && !error) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
  ];

  if (certification) {
    breadcrumbItems.push({
      label: certification.name,
      href: `/certifications/cert/${certId}`,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <Suspense fallback={<CertificationDetailSkeleton />}>
            <CertificationDetail certId={certId} initialData={certification} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function CertificationDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
