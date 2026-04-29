import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation & Help Center | Certestic Platform Guide',
  description:
    'Complete documentation and help center for the Certestic platform. Learn how to use AI-powered features, track your progress, manage study sessions, and maximize your path to certification success with step-by-step guides and FAQs.',
  keywords: [
    'documentation',
    'help center',
    'platform guide',
    'user manual',
    'how to guide',
    'tutorial',
    'getting started',
    'FAQ',
    'frequently asked questions',
    'troubleshooting',
    'platform features',
    'AI features guide',
    'study tracking',
    'certification platform help',
    'learning guide',
    'feature documentation',
    'technical guide',
    'support documentation',
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
    title: 'Documentation | Certestic Platform Help & Guides',
    description:
      'Comprehensive platform documentation covering all features, guides, and FAQs to help you maximize your certification training experience.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/documentation',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-documentation.png',
        width: 1200,
        height: 630,
        alt: 'Certestic Documentation - Platform Help & Guides',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certestic Documentation | Platform Help',
    description:
      'Complete guides, tutorials, and FAQs for using the Certestic platform. Learn all features and get the most from your study experience.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-documentation.png',
        alt: 'Certestic Documentation',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/documentation',
  },
  category: 'Education',
};
