import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CertificationDetail from '@/src/components/custom/CertificationDetail';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { fetchCertificationData } from '@/src/lib/server-actions/certifications';

interface Props {
  params: Promise<{ firmCode: string; certId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { firmCode, certId } = resolvedParams;

  // Fetch certification data for better SEO metadata
  try {
    const { certification } = await fetchCertificationData(certId);

    if (certification) {
      return {
        title: `${
          certification.name
        } - Simulate Exams by AI & Prepare by Self Exams | ${firmCode.toUpperCase()} | CertifAI`,
        description:
          certification.description ||
          `${
            certification.name
          } certification from ${firmCode.toUpperCase()}. Simulate exams by AI and prepare for IT certification by self exams. Learn about exam requirements, practice questions, and training materials.`,
        keywords: `${
          certification.name
        }, ${firmCode.toUpperCase()}, simulate exams by AI, prepare for IT certification by self exams, IT certification, exam preparation, practice questions, training, self exam preparation`,
        openGraph: {
          title: `${
            certification.name
          } - Simulate Exams by AI & Prepare by Self Exams | ${firmCode.toUpperCase()} | CertifAI`,
          description:
            certification.description ||
            `${
              certification.name
            } certification from ${firmCode.toUpperCase()}. Simulate exams by AI and prepare for IT certification by self exams. Learn about exam requirements, practice questions, and training materials.`,
          type: 'article',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching certification for metadata:', error);
  }

  return {
    title: `Certification ${certId} - Simulate Exams by AI & Prepare by Self Exams | ${firmCode.toUpperCase()} | CertifAI`,
    description: `${firmCode.toUpperCase()} certification information and training materials. Simulate exams by AI and prepare for IT certification by self exams with AI-powered practice questions and study materials.`,
    keywords: `${firmCode}, certification ${certId}, IT certification, exam preparation, practice questions, training`,
  };
}

export default async function CertificationPage({ params }: Props) {
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

  // Fetch certification data to get the certification name for breadcrumb
  const { certification } = await fetchCertificationData(certId);

  if (!certification) {
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
      label: certification.name,
      href: `/certifications/${firmCode}/${certId}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Navigation */}
      <LandingHeader showFeaturesLink={false} />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{certification.name}</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {firmCode.toUpperCase()} Certification - Learn about exam requirements, practice
            questions, and training materials.
          </p>
        </div>

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
