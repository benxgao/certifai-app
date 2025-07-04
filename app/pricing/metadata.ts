import { Metadata } from 'next';

const description =
  'Join our free beta program and help build the future of AI-powered IT certification training. Complete access to all features while we gather feedback and improve together.';

const keywords = [
  'CertifAI beta program',
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
    'Free Beta Program | CertifAI - AI-Powered IT Certification Training | Help Us Build the Future',
  description,
  keywords,
  authors: [{ name: 'CertifAI Team' }],
  creator: 'CertifAI',
  publisher: 'CertifAI',
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
    title: 'Free Beta Program | CertifAI - Shape the Future of IT Certification Training',
    description:
      'Join our free beta program and help build the most effective AI-powered IT certification training platform. Complete access while we develop together.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/pricing',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/pricing/certifai-pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI Free Beta Program - Help Build the Future of IT Certification Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Beta Program | CertifAI - Shape the Future',
    description:
      'Join our free beta program and help build the most effective AI-powered IT certification training platform.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/pricing/certifai-pricing-twitter.jpg',
        alt: 'CertifAI Free Beta Program - Help Build the Future',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/pricing',
  },
  category: 'Education',
};
