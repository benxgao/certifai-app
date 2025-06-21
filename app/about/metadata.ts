import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About CertifAI | AI-Powered IT Certification Training Platform | Learn Our Story',
  description:
    "Discover CertifAI's mission to revolutionize IT certification training with AI technology. Learn about our developer journey, core values, and how we're making professional education accessible to everyone.",
  keywords: [
    'CertifAI about us',
    'AI-powered IT certification training',
    'artificial intelligence education platform',
    'IT certification study platform',
    'personalized learning technology',
    'professional development tools',
    'certification exam preparation',
    'AI education innovation',
    'IT career advancement',
    'online certification training',
    'adaptive learning platform',
    'beta software development',
  ].join(', '),
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
    title: 'About CertifAI | AI-Powered IT Certification Training Platform',
    description:
      'Discover how CertifAI is revolutionizing IT certification training with AI-powered personalized learning. Join our growing community of beta users.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/about-certifai-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI - AI-Powered IT Certification Training Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About CertifAI | AI-Powered IT Certification Training',
    description:
      'Learn how CertifAI is transforming IT certification training with AI technology. Discover our mission, values, and development journey.',
    images: ['/images/about-certifai-twitter.jpg'],
    creator: '@CertifAI',
  },
  alternates: {
    canonical: 'https://certifai.app/about',
  },
  category: 'Technology',
};
