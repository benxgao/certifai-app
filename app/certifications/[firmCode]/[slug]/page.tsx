import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import CertificationDetail from '@/src/components/custom/CertificationDetail';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { fetchCertificationDataBySlug } from '@/src/lib/server-actions/certifications';

interface Props {
  params: Promise<{ firmCode: string; slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { firmCode, slug } = resolvedParams;

  // Fetch certification data for better SEO metadata
  try {
    const { certification } = await fetchCertificationDataBySlug(slug);

    if (certification) {
      return {
        title: `${
          certification.name
        } - Simulate Exams by AI & Prepare by Self Exams | ${firmCode.toUpperCase()} | Certestic`,
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
          } - Simulate Exams by AI & Prepare by Self Exams | ${firmCode.toUpperCase()} | Certestic`,
          description:
            certification.description ||
            `${
              certification.name
            } certification from ${firmCode.toUpperCase()}. Simulate exams by AI and prepare for IT certification by self exams. Learn about exam requirements, practice questions, and training materials.`,
          type: 'article',
        },
        alternates: {
          canonical: `/certifications/${firmCode}/${slug}`,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: `Certification - Simulate Exams by AI & Prepare by Self Exams | ${firmCode.toUpperCase()} | Certestic`,
    description: `${firmCode.toUpperCase()} certification information and training materials. Simulate exams by AI and prepare for IT certification by self exams with AI-powered practice questions and study materials.`,
    keywords: `${firmCode}, certification, IT certification, exam preparation, practice questions, training`,
  };
}

export default async function CertificationSlugPage({ params }: Props) {
  const resolvedParams = await params;
  const { firmCode, slug } = resolvedParams;

  // Validate firmCode (should be alphanumeric, typically 2-6 characters)
  if (!/^[a-zA-Z0-9]{1,10}$/i.test(firmCode)) {
    notFound();
  }

  // Validate slug format (should be lowercase letters, numbers, and hyphens)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  // Fetch certification data to get the certification details
  const { certification } = await fetchCertificationDataBySlug(slug);

  if (!certification) {
    notFound();
  }

  // Verify that the certification belongs to the correct firm
  if (certification.firm?.code.toLowerCase() !== firmCode.toLowerCase()) {
    // If the firm code doesn't match, redirect to the correct URL
    if (certification.firm?.code) {
      redirect(`/certifications/${certification.firm.code}/${slug}`);
    } else {
      notFound();
    }
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
      href: `/certifications/${firmCode}/${slug}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Navigation */}
      <LandingHeader />

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
          <CertificationDetail certId={certification.cert_id.toString()} />
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
