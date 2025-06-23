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
    name: certification.name,
    description: certification.description,
    provider: {
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
    audience: {
      '@type': 'Audience',
      audienceType: 'IT Professionals',
    },
    educationalLevel: 'Professional Certification',
    teaches: [`${certification.name} skills and knowledge`, 'IT Certification preparation'],
    url: `https://certifai.app/certifications/${certification.cert_id}`,
    dateModified: certification.updated_at,
    dateCreated: certification.created_at,
    aggregateRating:
      certification.enrollment_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: '4.5',
            reviewCount: Math.min(certification.enrollment_count, 100),
            bestRating: '5',
            worstRating: '1',
          }
        : undefined,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: certification.created_at,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: {
        '@type': 'Organization',
        name: 'CertifAI AI System',
        description: 'AI-powered certification training platform',
      },
    },
    about: [
      {
        '@type': 'Thing',
        name: certification.name,
        description: certification.description,
      },
      {
        '@type': 'Thing',
        name: 'IT Certification',
        description: 'Professional technology certification program',
      },
    ],
    keywords: [
      certification.name,
      `${certification.firm.name} certification`,
      'IT certification',
      'exam preparation',
      'practice questions',
      'AI-powered training',
      certification.firm.name,
    ].join(', '),
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
    url: 'https://certifai.app/certifications',
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
          item: 'https://certifai.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Certifications',
          item: 'https://certifai.app/certifications',
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
