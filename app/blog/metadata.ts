import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | IT Certification Tips, Study Strategies & Career Advice | Certestic',
  description:
    'Discover expert insights, study strategies, and success tips for passing IT certifications faster. Read our blog for AWS, Azure, GCP, CompTIA, Cisco, and other certification preparation guides, learning psychology articles, and career advancement advice.',
  keywords: [
    'IT certification blog',
    'certification study tips',
    'AWS certification guide',
    'Azure study strategies',
    'certification exam tips',
    'IT career advice',
    'professional development',
    'learning strategies',
    'certification success tips',
    'exam preparation guide',
    'cloud certification blog',
    'cybersecurity certification tips',
    'CompTIA certification prep',
    'Cisco certification guide',
    'study effectiveness',
    'memory retention techniques',
    'test-taking strategies',
    'certification articles',
    'IT professional blog',
    'education psychology',
  ].join(', '),
  authors: [{ name: 'Certestic Team' }],
  creator: 'Certestic',
  publisher: 'Certestic',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Certestic Blog | IT Certification Tips & Success Strategies',
    description:
      'Expert insights and proven strategies for passing IT certifications. Learn from our blog covering AWS, Azure, GCP, CompTIA, and more certification programs.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/blog',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Certestic Blog - IT Certification Tips & Insights',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certestic Blog | Certification Success Strategies',
    description:
      'Expert tips and strategies for passing AWS, Azure, GCP, CompTIA, and other IT certifications faster with effective study methods.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-blog.png',
        alt: 'Certestic Blog - IT Certification Insights',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/blog',
  },
  category: 'Education',
};
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Certestic - IT Certification Training Insights',
    description:
      'Expert insights and strategies for IT certification success with AI-powered learning.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/favicon.ico',
        alt: 'Certestic Blog - IT Certification Training Insights',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/blog',
  },
  category: 'Education',
};
