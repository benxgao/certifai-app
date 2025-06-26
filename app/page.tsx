'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EmailActionHandler from '@/src/components/auth/EmailActionHandler';
import LandingPageContent from '@/src/components/landing/LandingPageContent';

// Structured Data for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CertifAI',
  description:
    'AI-powered IT certification training platform to simulate exams by AI and prepare for IT certification by self exams with personalized learning experiences',
  url: 'https://certifai.app',
  logo: 'https://certifai.app/images/logo.png',
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'CertifAI Development Team',
      jobTitle: 'AI Education Platform Developers',
    },
  ],
  sameAs: [
    'https://twitter.com/CertifAI',
    'https://linkedin.com/company/certifai',
    'https://github.com/certifai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@certifai.app',
  },
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CertifAI',
  description:
    'Simulate exams by AI and prepare for IT certification by self exams with our AI-powered training platform featuring personalized learning, practice exams, and adaptive study recommendations',
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
    'AI-generated practice questions to simulate exams by AI',
    'Personalized study recommendations for self exam preparation',
    'Multiple IT certification tracks',
    'Progress tracking and analytics',
    'Community learning features',
    'Adaptive difficulty adjustment',
    'Real-time performance insights for certification success',
    'Self-paced exam simulation technology',
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'CertifAI - Simulate Exams by AI & Prepare for IT Certification by Self Exams',
  description:
    'Join 500+ beta users who simulate exams by AI and prepare for IT certification by self exams with AI-powered practice questions and personalized study recommendations',
  url: 'https://certifai.app',
  mainEntity: {
    '@type': 'EducationalOrganization',
    name: 'CertifAI',
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
      fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
    >
      <MainPage />
    </Suspense>
  );
}
