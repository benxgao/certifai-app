// Organization and Company Schema for SEO
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Certestic',
  alternateName: 'Certestic Platform',
  description:
    'AI-powered IT certification training platform providing personalized learning experiences, intelligent practice questions, and adaptive study recommendations for IT professionals worldwide.',
  url: 'https://certestic.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://certestic.com/images/logo.png',
    width: 512,
    height: 512,
  },
  image: {
    '@type': 'ImageObject',
    url: 'https://certestic.com/images/certestic-og-image.jpg',
    width: 1200,
    height: 630,
  },
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'Certestic Development Team',
      jobTitle: 'AI Education Platform Developers',
      description:
        'Experienced developers passionate about making IT certification training accessible through artificial intelligence.',
    },
  ],
  sameAs: [
    'https://twitter.com/Certestic',
    'https://linkedin.com/company/certestic',
    'https://github.com/certestic',
    'https://facebook.com/Certestic',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@certestic.com',
      url: 'https://certestic.com/support',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      email: 'tech@certestic.com',
      url: 'https://certestic.com/documentation',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
    addressRegion: 'Global',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Certestic Training Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI-Powered IT Certification Training',
          description: 'Personalized learning platform with AI-generated practice questions',
        },
      },
    ],
  },
  knowsAbout: [
    'IT Certification',
    'Artificial Intelligence',
    'Machine Learning',
    'Educational Technology',
    'Professional Development',
    'Cybersecurity Certification',
    'Cloud Computing Certification',
    'Network Certification',
    'Software Development Certification',
  ],
  memberOf: {
    '@type': 'Organization',
    name: 'Educational Technology Industry',
  },
  award: 'Beta Innovation in AI Education 2025',
  slogan: 'AI-Powered IT Certification Training',
};

// Software Application Schema
export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Certestic',
  alternateName: 'Certestic Platform',
  description:
    'AI-powered IT certification training platform with personalized learning, intelligent practice questions, adaptive study recommendations, and comprehensive progress tracking for IT professionals.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: ['Web Browser', 'iOS', 'Android', 'Windows', 'macOS', 'Linux'],
  downloadUrl: 'https://certestic.com',
  installUrl: 'https://certestic.com/signup',
  screenshot: [
    {
      '@type': 'ImageObject',
      url: 'https://certestic.com/images/screenshots/dashboard.png',
      description: 'Certestic Dashboard Screenshot',
    },
    {
      '@type': 'ImageObject',
      url: 'https://certestic.com/images/screenshots/practice-exam.png',
      description: 'Practice Exam Interface',
    },
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Beta Starter Plan',
      description: 'Free beta access with 300 credit coins for practice exams',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      category: 'Free Trial',
    },
    {
      '@type': 'Offer',
      name: 'Beta Pro Plan',
      description: 'Enhanced beta access with 1500 credit coins and priority support',
      price: '19',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      category: 'Premium',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '500',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '500',
  },
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Beta User',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody:
        'Certestic has revolutionized my certification study approach. The AI-generated questions are incredibly relevant and help me focus on my weak areas.',
    },
  ],
  featureList: [
    'AI-generated practice questions',
    'Personalized study recommendations',
    'Multiple IT certification tracks',
    'Progress tracking and analytics',
    'Community learning features',
    'Adaptive difficulty adjustment',
    'Real-time performance insights',
    'Mobile-responsive design',
    'Offline study capabilities',
    'Expert-curated content',
  ],
  requirements: 'Modern web browser with JavaScript enabled',
  softwareVersion: '1.0.0-beta',
  releaseNotes: 'Initial beta release with AI-powered certification training features',
  maintainer: {
    '@type': 'Organization',
    name: 'Certestic Team',
  },
  creator: {
    '@type': 'Organization',
    name: 'Certestic',
  },
  datePublished: '2025-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'en-US',
  copyrightHolder: {
    '@type': 'Organization',
    name: 'Certestic',
  },
  copyrightYear: '2025',
  license: 'https://certestic.com/terms',
  isAccessibleForFree: true,
  isFamilyFriendly: true,
};
