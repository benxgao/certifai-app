import { Metadata } from 'next';

const description =
  'Get free access to our AI-powered IT certification training platform. Complete access to all features while we gather feedback and improve the platform.';

const keywords = [
  'Certestic beta program',
  'free IT certification training',
  'AI certification beta',
  'free practice exam platform',
  'beta testing certification',
  'feedback driven development',
  'free AI training platform',
  'certification training beta',
  'IT certification feedback',
  'free certification practice',
  'beta user program',
].join(', ');

export const metadata: Metadata = {
  title:
    'Free Beta Program | Certestic - AI-Powered IT Certification Training | Help Us Build the Future',
  description,
  keywords,
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
    title: 'Free Beta Program | Certestic - Shape the Future of IT Certification Training',
    description:
      'Get free access to our AI-powered IT certification training platform. Complete access while we develop and improve.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/pricing',
    siteName: 'Certestic',
    images: [
      {
        url: '/images/pricing/certestic-pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Certestic Free Beta Program - Help Build the Future of IT Certification Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Beta Program | Certestic - Shape the Future',
    description:
      'Join our free beta program and help build the most effective AI-powered IT certification training platform.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/images/pricing/certestic-pricing-twitter.jpg',
        alt: 'Certestic Free Beta Program - Help Build the Future',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/pricing',
  },
  category: 'Education',
};
