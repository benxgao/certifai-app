'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EmailVerification from '@/src/components/auth/EmailVerification';
import PasswordReset from '@/src/components/auth/PasswordReset';
import LandingPageContent from '@/src/components/landing/LandingPageContent';

// Structured Data for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CertifAI',
  description:
    'AI-powered IT certification training platform providing personalized learning experiences',
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
    'AI-powered IT certification training platform with personalized learning, practice exams, and adaptive study recommendations',
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
    'AI-generated practice questions',
    'Personalized study recommendations',
    'Multiple IT certification tracks',
    'Progress tracking and analytics',
    'Community learning features',
    'Adaptive difficulty adjustment',
    'Real-time performance insights',
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'CertifAI - AI-Powered IT Certification Training Platform',
  description:
    'Join 500+ beta users mastering IT certifications with AI-powered practice questions and personalized study recommendations',
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

  // If mode is verifyEmail, show email verification component
  if (mode === 'verifyEmail') {
    return <EmailVerification />;
  }

  // If mode is resetPassword, show password reset component
  if (mode === 'resetPassword') {
    return <PasswordReset />;
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
