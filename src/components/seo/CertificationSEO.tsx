import { Metadata } from 'next';

interface CertificationData {
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

interface CertificationSEOProps {
  certification: CertificationData;
  firmCode: string;
}

export function generateCertificationSEOMetadata({
  certification,
  firmCode,
}: CertificationSEOProps): Metadata {
  const title = `${certification.name} Certification Training - AI-Powered Practice Questions & Study Guide | ${certification.firm.name} | Certestic`;

  const description = `Master ${certification.name} certification with AI-powered practice questions, personalized study recommendations, and adaptive learning technology. Join thousands of professionals who have successfully passed their ${certification.firm.name} certifications using our intelligent training system. Free beta access available.`;

  const keywords = [
    // Primary keywords
    certification.name,
    `${certification.firm.name} certification`,
    `${certification.name} practice questions`,
    `${certification.name} study guide`,

    // Long-tail keywords
    `AI-powered ${certification.name} training`,
    `personalized ${certification.name} study recommendations`,
    `adaptive ${certification.name} learning`,
    `${certification.name} exam preparation`,
    `${certification.name} certification success`,
    `best ${certification.name} practice questions`,
    `${certification.name} exam simulator`,
    `${certification.name} training course`,

    // Firm-specific long-tail keywords
    `${certification.firm.name} certification training`,
    `${certification.firm.name} exam preparation`,
    `${certification.firm.name} practice tests`,
    `${certification.firm.name} study materials`,

    // AI and technology keywords
    'AI-powered certification training',
    'intelligent tutoring system',
    'adaptive learning technology',
    'personalized study recommendations',
    'machine learning education',
    'artificial intelligence training',

    // General certification keywords
    'IT certification practice questions',
    'professional certification training',
    'online certification preparation',
    'certification exam simulator',
    'practice test questions',
    'exam readiness assessment',
    'certification study plan',
    'professional development training',

    // Success and career keywords
    'certification career advancement',
    'IT professional development',
    'technology certification success',
    'certification pass rate',
    'exam success strategies',

    // Platform-specific keywords
    'Certestic AI training',
    'beta certification platform',
    'free certification training',
    'smart study technology',
  ].join(', ');

  const canonicalUrl = `https://certestic.com/certifications/${firmCode.toLowerCase()}/${
    certification.cert_id
  }/marketing`;
  const imageUrl = `https://certestic.com/api/og?title=${encodeURIComponent(
    certification.name,
  )}&firm=${encodeURIComponent(certification.firm.name)}&type=certification`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Certestic Team' }],
    creator: 'Certestic',
    publisher: 'Certestic',
    category: 'Education',
    classification: 'Educational Technology',

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': canonicalUrl,
      },
    },

    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${certification.name} - AI-Powered Certification Training | ${certification.firm.name}`,
      description: `Master ${certification.name} with AI-generated practice questions and personalized study recommendations. Join thousands achieving ${certification.firm.name} certification success.`,
      siteName: 'Certestic',
      locale: 'en_US',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${certification.name} Certification Training - AI-Powered Practice Questions`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@Certestic',
      creator: '@Certestic',
      title: `${certification.name} - AI-Powered Training | ${certification.firm.name}`,
      description: `Master ${certification.name} with AI-powered practice questions and personalized learning. Free beta access available.`,
      images: [
        {
          url: imageUrl,
          alt: `${certification.name} Certification Training`,
        },
      ],
    },

    other: {
      'article:author': 'Certestic Team',
      'article:section': 'Education',
      'article:tag': [
        certification.name,
        certification.firm.name,
        'AI Training',
        'Certification',
        'Professional Development',
      ].join(', '),

      // Schema.org markup hints
      'schema:audience': 'IT Professionals',
      'schema:educationalLevel': 'Professional',
      'schema:learningResourceType': 'Course',
      'schema:interactivityType': 'active',

      // Additional SEO hints
      'geo.region': 'Global',
      'geo.placename': 'Online',
      rating: '4.6',
      price: 'Free',
      availability: 'Available',

      // Mobile optimization
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',

      // Social media optimization
      'fb:app_id': '123456789', // Replace with actual Facebook app ID if available
      'og:see_also': [
        `https://certestic.com/certifications/${firmCode.toLowerCase()}`,
        'https://certestic.com/certifications',
        certification.firm.website_url,
      ]
        .filter(Boolean)
        .join(', '),

      // Microsoft-specific meta tags
      'msapplication-TileColor': '#6366f1',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#6366f1',
    },

    // Additional metadata for search engines
    applicationName: 'Certestic',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    // Apple-specific meta tags
    appleWebApp: {
      capable: true,
      title: `${certification.name} Training`,
      statusBarStyle: 'default',
    },
  };
}

// Helper function to generate breadcrumb structured data
export function generateCertificationBreadcrumb({
  certification,
  firmCode,
}: CertificationSEOProps) {
  return {
    '@context': 'https://schema.org',
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
      {
        '@type': 'ListItem',
        position: 3,
        name: certification.firm.name,
        item: `https://certestic.com/certifications/${firmCode.toLowerCase()}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: certification.name,
        item: `https://certestic.com/certifications/${firmCode.toLowerCase()}/${
          certification.cert_id
        }`,
      },
    ],
  };
}

// Helper function to generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Certestic',
    description:
      'AI-powered IT certification training platform with personalized learning experiences',
    url: 'https://certestic.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://certestic.com/favicon.ico',
    },
    sameAs: [
      'https://twitter.com/certestic',
      'https://linkedin.com/company/certestic',
      'https://github.com/certestic',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: 'https://certestic.com/support',
      availableLanguage: 'English',
    },
    areaServed: 'Worldwide',
    serviceType: 'Educational Technology',
    keywords:
      'AI-powered certification training, IT certification, personalized learning, adaptive education',
  };
}
