import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { fetchCertificationData } from '@/src/lib/server-actions/certifications';
import CertificationMarketingPage from '@/src/components/custom/CertificationMarketingPage';

interface Props {
  params: Promise<{ firmCode: string; certId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { firmCode, certId } = resolvedParams;

  // Validate certId is a number
  if (!/^\d+$/.test(certId)) {
    return {
      title: 'Certification Not Found | CertifAI',
      description: 'The requested certification could not be found.',
    };
  }

  // Fetch certification data for better SEO metadata
  try {
    const { certification: cert, error: fetchError } = await fetchCertificationData(certId);

    if (fetchError) {
      console.error('Error fetching certification for metadata:', fetchError);
    }

    if (cert) {
      return {
        title: `${
          cert.name
        } - Create Exams on Particular Topics & Test Knowledge Mastery | ${firmCode.toUpperCase()} | CertifAI`,
        description: `Master the ${
          cert.name
        } certification by creating exams on particular exam topics. Tell AI to generate exams on your particular needs focusing on specific concepts, technologies, and domains. Better user experience than generating exam tests in AI chatbots directly for ${firmCode.toUpperCase()} certifications.`,
        keywords: `${cert.name}, ${firmCode}, create exams on particular exam topics, test knowledge mastery, tell AI to generate exams, better than AI chatbots, superior user experience, topic-focused exam preparation, IT certification training, concept-specific practice questions, AI-powered learning, study guide`,
        openGraph: {
          title: `${
            cert.name
          } - Create Exams on Particular Topics & Test Knowledge Mastery | ${firmCode.toUpperCase()} | CertifAI`,
          description: `Master the ${cert.name} certification by creating exams on particular exam topics. Tell AI to generate exams focused on your specific learning needs and test knowledge mastery.`,
          type: 'website',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching certification for metadata:', error);
  }

  return {
    title: `${firmCode.toUpperCase()} Certification Training - Create Exams on Particular Topics & Test Knowledge Mastery | CertifAI`,
    description: `Master your ${firmCode.toUpperCase()} certification by creating exams on particular exam topics. Tell AI to generate exams on your particular needs focusing on specific concepts, technologies, and certification domains. Superior user experience compared to AI chatbots for exam generation.`,
    keywords: `${firmCode}, create exams on particular exam topics, test knowledge mastery, tell AI to generate exams, better than AI chatbots, superior user experience, topic-focused certification training, exam preparation, concept-specific practice questions, AI-powered learning, study guide`,
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

  // Fetch certification data using server action
  let certification = null;
  let error = null;

  try {
    const result = await fetchCertificationData(certId);
    certification = result.certification;
    error = result.error;

    if (error) {
      console.error('Error fetching certification:', error);
    }

    if (!certification && !error) {
      notFound();
    }
  } catch (err) {
    console.error('Error fetching certification:', err);
    error = 'Failed to load certification';
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

  if (certification) {
    // Update breadcrumb with certification name
    breadcrumbItems[3] = {
      label: certification.name,
      href: `/certifications/${firmCode}/${certId}`,
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header with Navigation */}
      <LandingHeader showFeaturesLink={false} />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <Suspense fallback={<CertificationMarketingPageSkeleton />}>
            <CertificationMarketingPage
              certId={certId}
              firmCode={firmCode}
              initialData={
                certification
                  ? {
                      cert_id: certification.cert_id,
                      name: certification.name,
                      description:
                        certification.description ||
                        `Learn about ${certification.name} certification and prepare for your exam with comprehensive training materials.`,
                      min_quiz_counts: certification.min_quiz_counts,
                      max_quiz_counts: certification.max_quiz_counts,
                      pass_score: certification.pass_score,
                      created_at: certification.created_at || new Date().toISOString(),
                      firm_id: certification.firm_id || certification.firm?.firm_id || 0,
                    }
                  : null
              }
            />
          </Suspense>
        )}
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
