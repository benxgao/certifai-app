'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EmailActionHandler from '@/src/components/auth/EmailActionHandler';
import LandingPageContent from '@/src/components/landing/LandingPageContent';
import PageLoader from '@/src/components/custom/PageLoader';

// Structured Data for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Certestic',
  description:
    'AI-powered IT certification training platform for AWS, Azure, GCP, CompTIA, and 100+ other certifications. Create personalized practice exams with adaptive AI technology to accelerate your IT career.',
  url: 'https://certestic.com',
  logo: 'https://certestic.com/favicon.ico',
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'Certestic Development Team',
      jobTitle: 'AI Education Platform Developers',
    },
  ],
  sameAs: [
    'https://twitter.com/Certestic',
    'https://linkedin.com/company/certestic',
    'https://github.com/certestic',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@certestic.com',
  },
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Certestic',
  description:
    'AI-powered practice exams for AWS, Azure, GCP, CompTIA, and 100+ IT certifications. Adaptive learning technology creates personalized study plans with realistic exam simulation to help IT professionals pass certifications faster.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Comprehensive IT certification practice exams and training',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '500',
    bestRating: '5',
  },
  featureList: [
    'AI-powered practice exams for AWS, Azure, GCP certifications',
    'Adaptive learning technology that personalizes study plans',
    'Realistic exam simulation with timed sessions',
    'Comprehensive analytics for AWS, Azure, GCP progress tracking',
    'Practice questions for CompTIA, Cisco, VMware certifications',
    'Personalized study recommendations based on performance',
    'Real-time insights on IT certification knowledge gaps',
    'Custom exam creation for specific technology domains',
    'Professional exam interface designed for IT certifications',
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Certestic - AI-Powered IT Certification Training for AWS, Azure, GCP & More',
  description:
    'Master AWS, Azure, GCP, and 100+ IT certifications with AI-powered practice exams. Adaptive learning technology creates personalized study plans to help you pass IT certifications faster.',
  url: 'https://certestic.com',
  mainEntity: {
    '@type': 'EducationalOrganization',
    name: 'Certestic',
    description:
      'AI-powered IT certification training platform for cloud and technology professionals',
  },
};

// Main Page Component - checks for email verification, password reset, or shows landing page
function MainPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  // If mode is verifyEmail or resetPassword, show email action handler
  if (mode === 'verifyEmail' || mode === 'resetPassword') {
    return <EmailActionHandler />;
  }

  // Otherwise show the landing page with structured data
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <LandingPageContent />
    </>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          isLoading={true}
          text="Loading Certestic..."
          showSpinner={true}
          variant="auth"
          fullScreen={true}
          showBrand={true}
        />
      }
    >
      <MainPage />
    </Suspense>
  );
}
