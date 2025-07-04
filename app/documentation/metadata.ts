import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | Certestic - Platform Guide & Help Center',
  description:
    'Complete documentation and help center for Certestic platform. Learn how to use AI-powered features, manage your study progress, and maximize your certification success.',
  keywords: [
    'Certestic documentation',
    'platform help center',
    'user guide',
    'AI features guide',
    'certification platform help',
    'study progress tracking',
    'platform tutorials',
    'user manual',
    'help documentation',
    'getting started guide',
    'feature documentation',
    'support resources',
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
    title: 'Documentation | Certestic - Platform Guide & Help Center',
    description:
      'Complete documentation and help center for Certestic platform. Learn how to maximize your certification success.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/documentation',
    siteName: 'Certestic',
    images: [
      {
        url: '/images/documentation/certestic-docs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Certestic Documentation - Platform Guide & Help Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation | Certestic - Platform Guide',
    description: 'Complete documentation and help center for Certestic platform.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/images/documentation/certestic-docs-twitter.jpg',
        alt: 'Certestic Documentation - Platform Guide & Help Center',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/documentation',
  },
  category: 'Education',
};
