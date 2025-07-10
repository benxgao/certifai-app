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
    'AI-powered IT certification training platform to create exams on particular exam topics and test knowledge mastery. Tell AI to generate exams on your particular needs focusing on specific concepts and technologies',
  url: 'https://certestic.com',
  logo: 'https://certestic.com/images/logo.png',
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
    'Create exams on particular exam topics to test knowledge mastery and tell AI to generate exams on your particular needs. AI-powered training platform featuring topic-focused practice exams, personalized learning, and adaptive study recommendations',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free beta access with 300 credit coins for practice exams',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '500',
    bestRating: '5',
  },
  featureList: [
    'Create exams on particular exam topics to test knowledge mastery',
    'Tell AI to generate exams focused on your specific learning needs',
    'Topic-focused practice questions for targeted preparation',
    'Personalized study recommendations based on topic performance',
    'Multiple IT certification tracks with concept-specific testing',
    'Progress tracking across different topics and domains',
    'Adaptive difficulty adjustment for optimized learning',
    'Real-time insights on topic-specific knowledge gaps',
    'Custom exam creation for particular concepts and technologies',
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Certestic - Create Exams on Particular Topics & Test Knowledge Mastery with AI',
  description:
    'Create exams on particular exam topics to test if you have mastered knowledge. Tell AI to generate exams on your particular needs like focusing on specific concepts, technologies, or certification domains',
  url: 'https://certestic.com',
  mainEntity: {
    '@type': 'EducationalOrganization',
    name: 'Certestic',
    description: 'AI-powered IT certification training platform',
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
          variant="default"
          fullScreen={true}
          showBrand={true}
        />
      }
    >
      <MainPage />
    </Suspense>
  );
}
