import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'About Certestic | Our Mission to Revolutionize AI-Powered IT Certification Training',
  description:
    "Discover Certestic's story and mission. Learn how we're using adaptive AI technology to help IT professionals pass certifications faster. Meet our team, explore our values, and understand our approach to personalized exam preparation.",
  keywords: [
    'about Certestic',
    'company mission',
    'AI-powered training',
    'IT certification platform',
    'adaptive learning technology',
    'personalized exam preparation',
    'AI education innovation',
    'certification success stories',
    'professional development',
    'technology company',
    'education technology',
    'AI learning platform',
    'exam simulation technology',
    'knowledge assessment',
    'training methodology',
    'learning innovation',
    'IT career development',
    'industry expertise',
    'team story',
    'startup journey',
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
    title: 'About Certestic | Transforming IT Certification Training with AI',
    description:
      'Learn how Certestic combines adaptive AI technology with proven learning science to help professionals achieve certification success faster and more efficiently.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/about',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Certestic - AI-Powered Certification Training Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Certestic | Transforming Certification Training',
    description:
      'Discover our mission to revolutionize IT certification training with adaptive AI technology and personalized learning paths.',
    images: [
      {
        url: 'https://certestic.com/og-about.png',
        alt: 'About Certestic',
      },
    ],
    creator: '@Certestic',
    site: '@Certestic',
  },
  alternates: {
    canonical: 'https://certestic.com/about',
  },
  category: 'Technology',
};
