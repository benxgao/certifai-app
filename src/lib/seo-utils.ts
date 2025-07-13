// SEO utility functions and structured data generators

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate?: string;
  founders?: Array<{
    '@type': string;
    name: string;
    jobTitle: string;
  }>;
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    contactType: string;
    email: string;
  };
}

export interface WebPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  mainEntity?: {
    '@type': string;
    name: string;
  };
  breadcrumb?: {
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item: string;
    }>;
  };
}

export interface SoftwareApplicationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
    description: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    ratingCount: string;
    bestRating: string;
  };
  featureList?: string[];
}

// Generate organization schema
export const generateOrganizationSchema = (): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Certestic',
  description:
    'AI-powered IT certification training platform providing personalized learning experiences',
  url: 'https://certestic.com',
  logo: 'https://certestic.com/images/logo.png',
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'Certestic Founder',
      jobTitle: 'Solo Developer & AI Enthusiast',
    },
  ],
  sameAs: ['https://twitter.com/certestic', 'https://linkedin.com/company/certestic'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@certestic.com',
  },
});

// Generate webpage schema
export const generateWebPageSchema = (
  name: string,
  description: string,
  url: string,
  breadcrumbs?: Array<{ name: string; url: string }>,
): WebPageSchema => {
  const schema: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'Organization',
      name: 'Certestic',
    },
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  return schema;
};

// Generate software application schema
export const generateSoftwareApplicationSchema = (): SoftwareApplicationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Certestic',
  description:
    'AI-powered IT certification training platform with personalized learning and practice exams',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free beta access with 300 credit coins',
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
    'Discussion forum features',
  ],
});

// Generate FAQ schema for pages with FAQ content
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// SEO meta tag generator
export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    title: string;
    description: string;
    image?: string;
  };
}

export const generateMetaTags = (config: SEOMetaTags) => {
  const baseUrl = 'https://certestic.com';

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    canonical: config.canonical || baseUrl,
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      image: config.openGraph?.image || `${baseUrl}/images/og-default.jpg`,
      url: config.openGraph?.url || baseUrl,
      type: 'website',
      siteName: 'Certestic',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.twitter?.title || config.title,
      description: config.twitter?.description || config.description,
      image: config.twitter?.image || `${baseUrl}/images/twitter-default.jpg`,
      creator: '@Certestic',
    },
  };
};

// Keyword optimization utilities
export const PRIMARY_KEYWORDS = [
  'AI-powered IT certification',
  'IT certification training',
  'personalized learning platform',
  'practice exam simulator',
  'certification study guide',
];

export const SECONDARY_KEYWORDS = [
  'artificial intelligence education',
  'machine learning certification',
  'adaptive learning technology',
  'professional development platform',
  'IT career advancement',
  'online certification prep',
  'beta testing platform',
];

export const LONG_TAIL_KEYWORDS = [
  'AI-powered IT certification practice exams',
  'personalized IT certification study recommendations',
  'machine learning certification training platform',
  'adaptive IT certification learning experience',
  'free IT certification practice questions',
  'beta IT certification training software',
];

// Content optimization helpers
export const optimizeHeading = (text: string, keywords: string[]): string => {
  // Simple keyword integration - in real implementation, this would be more sophisticated
  const keywordToAdd = keywords.find(
    (keyword) => !text.toLowerCase().includes(keyword.toLowerCase()),
  );
  return keywordToAdd ? `${text} | ${keywordToAdd}` : text;
};

export const generateBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: 'https://certestic.com' }];

  let currentPath = 'https://certestic.com';
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const name = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    breadcrumbs.push({ name, url: currentPath });
  });

  return breadcrumbs;
};

const SEOUtils = {
  generateOrganizationSchema,
  generateWebPageSchema,
  generateSoftwareApplicationSchema,
  generateFAQSchema,
  generateMetaTags,
  optimizeHeading,
  generateBreadcrumbs,
  PRIMARY_KEYWORDS,
  SECONDARY_KEYWORDS,
  LONG_TAIL_KEYWORDS,
};

export default SEOUtils;
