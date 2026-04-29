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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Navigation */}
      <LandingHeader />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <Breadcrumb items={breadcrumbItems} />
        <Suspense fallback={<CertificationDetailSkeleton />}>
          <CertificationDetail certId={certification.cert_id.toString()} />
        </Suspense>
      </div>
    </div>
  );
}

function CertificationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
        {/* Main Content Card Skeleton */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 sm:p-12 mx-4 sm:mx-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
              <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-5/6 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-4/5 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse mx-auto mb-6" />
              <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-4" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Related Certifications Skeleton */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl mx-4 sm:mx-0">
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
              <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
                >
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
                  <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
                  <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="bg-linear-to-r from-violet-600 to-blue-600 rounded-3xl shadow-2xl mx-4 sm:mx-0 p-8 sm:p-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto animate-pulse" />
            <div className="w-2/3 h-8 bg-white/20 rounded-xl mx-auto animate-pulse" />
            <div className="w-3/4 h-6 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="flex gap-4 justify-center">
              <div className="w-40 h-12 bg-white/20 rounded-xl animate-pulse" />
              <div className="w-40 h-12 bg-white/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
