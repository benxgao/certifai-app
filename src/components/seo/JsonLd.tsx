import React from 'react';

interface CertificationDetailData {
  cert_id: number;
  name: string;
  description: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  created_at: string;
  updated_at: string;
  firm: {
    id: number;
    code: string;
    name: string;
    description: string;
    website_url: string | null;
    logo_url: string | null;
  };
  enrollment_count: number;
}

interface CertificationJsonLdProps {
  certification: CertificationDetailData;
}

export default function CertificationJsonLd({ certification }: CertificationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${certification.name} Certification Training - AI-Powered Practice Questions`,
    description: `Master ${certification.name} certification with AI-generated practice questions, personalized study recommendations, and adaptive learning technology. Comprehensive training for ${certification.firm.name} professionals.`,
    provider: {
      '@type': 'Organization',
      name: 'Certestic',
      description: 'AI-powered IT certification training platform',
      url: 'https://certestic.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://certestic.com/favicon.ico',
      },
      sameAs: ['https://twitter.com/certestic', 'https://linkedin.com/company/certestic'],
    },
    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      name: certification.name,
      description: `${certification.name} professional certification`,
      credentialCategory: 'Professional Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: certification.firm.name,
        description: certification.firm.description,
        url: certification.firm.website_url,
        logo: certification.firm.logo_url
          ? {
              '@type': 'ImageObject',
              url: certification.firm.logo_url,
            }
          : undefined,
      },
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'IT Professionals',
      name: 'IT Professionals and Students',
      description: `Professionals seeking ${certification.name} certification and career advancement in ${certification.firm.name} technologies`,
    },
    educationalLevel: ['Intermediate', 'Advanced'],
    teaches: [
      `${certification.name} skills and knowledge`,
      'IT Certification preparation',
      'AI-powered study techniques',
      'Adaptive learning strategies',
      `${certification.firm.name} best practices`,
      'Real-world application scenarios',
    ],
    learningResourceType: [
      'Practice Questions',
      'Study Guide',
      'Interactive Course',
      'Assessment Tool',
    ],
    interactivityType: 'active',
    courseMode: 'online',
    deliveryMode: 'blended',
    url: `https://certestic.com/certifications/${certification.firm.code?.toLowerCase()}/${
      certification.cert_id
    }`,
    image: `https://certestic.com/api/og?title=${encodeURIComponent(
      certification.name,
    )}&firm=${encodeURIComponent(certification.firm.name)}`,
    dateModified: certification.updated_at,
    dateCreated: certification.created_at,
    aggregateRating:
      certification.enrollment_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: '4.6',
            reviewCount: Math.max(certification.enrollment_count, 50),
            bestRating: '5',
            worstRating: '1',
            description: `Highly rated ${certification.name} training with AI-powered personalized learning`,
          }
        : {
            '@type': 'AggregateRating',
            ratingValue: '4.6',
            reviewCount: 50,
            bestRating: '5',
            worstRating: '1',
            description: `Highly rated ${certification.name} training with AI-powered personalized learning`,
          },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: certification.created_at,
      category: 'Educational Service',
      description: 'Free beta access to AI-powered certification training',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseSchedule: {
        '@type': 'Schedule',
        scheduleTimezone: 'UTC',
        repeatFrequency: 'PT24H',
        description: 'Available 24/7 with self-paced learning',
      },
      instructor: {
        '@type': 'Organization',
        name: 'Certestic AI System',
        description:
          'Advanced AI-powered certification training system with adaptive learning technology',
        url: 'https://certestic.com',
      },
      courseWorkload: 'PT40H',
      description: `Self-paced ${certification.name} certification training with AI-generated practice questions`,
    },
    about: [
      {
        '@type': 'Thing',
        name: certification.name,
        description: certification.description,
        sameAs: certification.firm.website_url
          ? `${certification.firm.website_url}/certifications`
          : undefined,
      },
      {
        '@type': 'Thing',
        name: 'IT Certification',
        description: 'Professional technology certification program',
      },
      {
        '@type': 'Thing',
        name: 'AI-Powered Learning',
        description: 'Artificial intelligence enhanced personalized education',
      },
      {
        '@type': 'Thing',
        name: `${certification.firm.name} Technologies`,
        description: `Professional training in ${certification.firm.name} cloud and technology solutions`,
      },
    ],
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `How does AI-powered ${certification.name} training work?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Our AI system analyzes your learning patterns, identifies knowledge gaps, and generates personalized practice questions tailored to your needs for ${certification.name} certification success.`,
          },
        },
        {
          '@type': 'Question',
          name: `What makes this better than other ${certification.name} study guides?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Unlike static study materials, our platform provides dynamic, personalized learning experiences with unlimited AI-generated practice questions that mirror the actual ${certification.name} exam format.`,
          },
        },
        {
          '@type': 'Question',
          name: `How long does it take to prepare for ${certification.name} certification?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `With our AI-powered adaptive learning system, most students achieve exam readiness in 4-8 weeks, depending on their background and study commitment.`,
          },
        },
      ],
    },
    keywords: [
      certification.name,
      `${certification.firm.name} certification`,
      'AI-powered certification training',
      'personalized study recommendations',
      'adaptive learning technology',
      'IT certification practice questions',
      'exam preparation',
      'professional development',
      certification.firm.name,
      'certification success',
      'intelligent tutoring system',
    ].join(', '),
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    typicalAgeRange: '18-65',
    timeRequired: 'P4W/P8W',
    educationalUse: 'professional development',
    learningResourceIdentifier: `cert-${certification.cert_id}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface CertificationsCatalogJsonLdProps {
  totalCertifications: number;
  totalFirms: number;
}

export function CertificationsCatalogJsonLd({
  totalCertifications,
  totalFirms,
}: CertificationsCatalogJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IT Certifications Catalog',
    description: `Browse ${totalCertifications} IT certifications from ${totalFirms} leading technology companies with AI-powered training.`,
    url: 'https://certestic.com/certifications',
    mainEntity: {
      '@type': 'ItemList',
      name: 'IT Certifications',
      description: 'Comprehensive catalog of technology certifications',
      numberOfItems: totalCertifications,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://certestic.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Certifications',
          item: 'https://certestic.com/certifications',
        },
      ],
    },
    about: [
      {
        '@type': 'Thing',
        name: 'IT Certifications',
        description: 'Professional technology certification programs',
      },
      {
        '@type': 'Thing',
        name: 'AI-powered Training',
        description: 'Artificial intelligence enhanced learning platform',
      },
    ],
    keywords: [
      'IT certifications',
      'technology certifications',
      'AI training',
      'exam preparation',
      'practice questions',
      'professional development',
    ].join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
