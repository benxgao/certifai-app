export const SEO_CONFIG = {
  // Base configuration
  SITE_NAME: 'Certestic',
  SITE_URL: 'https://certestic.com',
  SITE_TITLE: 'Certestic | AI-Powered IT Certification Training Platform',
  SITE_DESCRIPTION:
    'Master IT certifications with AI-powered practice questions, personalized study recommendations, and adaptive learning. Join a growing number of beta users advancing their careers through intelligent technology.',

  // Social media
  TWITTER_HANDLE: '@Certestic',
  FACEBOOK_APP_ID: '', // Add when available

  // Default Open Graph image
  DEFAULT_OG_IMAGE: '/images/og-default.png',

  // Contact information
  CONTACT_EMAIL: 'hello@certestic.com',
  SUPPORT_EMAIL: 'support@certestic.com',

  // Business information
  BUSINESS_NAME: 'Certestic',
  BUSINESS_ADDRESS: {
    country: 'US',
    region: 'California',
  },

  // Analytics
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,

  // Verification codes
  VERIFICATION: {
    GOOGLE: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    BING: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    YANDEX: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
    YAHOO: process.env.NEXT_PUBLIC_YAHOO_SITE_VERIFICATION,
  },

  // Keywords for different page types
  KEYWORDS: {
    DEFAULT:
      'Certestic, AI-powered IT certification training, artificial intelligence learning platform, IT certification practice exams, personalized study recommendations, adaptive certification training, AI-generated practice questions, IT professional development, certification exam simulator, beta testing platform, free certification training, machine learning education, IT career advancement, online certification preparation, smart study technology, certification success platform',
    CERTIFICATIONS:
      'IT certifications, certification practice tests, AI study guide, certification exam prep, professional development, career advancement',
    AI_FEATURES:
      'AI-powered learning, machine learning education, personalized recommendations, adaptive learning technology, intelligent tutoring',
    TRAINING:
      'IT training, online certification courses, practice exams, study materials, exam preparation',
  },

  // Social media links
  SOCIAL_LINKS: {
    TWITTER: 'https://twitter.com/certestic',
    LINKEDIN: 'https://linkedin.com/company/certestic',
    GITHUB: 'https://github.com/certestic',
  },

  // Page-specific SEO templates
  PAGE_TEMPLATES: {
    HOME: {
      title: 'Certestic | AI-Powered IT Certification Training Platform',
      description:
        'Master IT certifications with AI-powered practice questions, personalized study recommendations, and adaptive learning. Join a growing number of beta users advancing their careers.',
    },
    CERTIFICATIONS: {
      title: 'IT Certifications | AI-Powered Practice Tests & Study Guides',
      description:
        'Explore comprehensive IT certification training with AI-generated practice questions. Get personalized study recommendations for AWS, Azure, Google Cloud, and more.',
    },
    ABOUT: {
      title: 'About Certestic | AI-Powered IT Certification Training',
      description:
        'Learn about Certestic, the AI-powered platform revolutionizing IT certification training with personalized learning and adaptive practice tests.',
    },
    PRICING: {
      title: 'Pricing | Certestic AI-Powered IT Certification Training',
      description:
        'Choose the perfect plan for your IT certification journey. Flexible pricing for individuals and teams with AI-powered study features.',
    },
    CONTACT: {
      title: 'Contact Certestic | Get Support for IT Certification Training',
      description:
        'Get in touch with Certestic for support, feedback, or questions about our AI-powered IT certification training platform.',
    },
  },
} as const;

export type SEOConfig = typeof SEO_CONFIG;
