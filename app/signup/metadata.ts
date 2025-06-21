import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | CertifAI - Join 500+ Users Mastering IT Certifications with AI',
  description:
    'Join CertifAI today and get free beta access with 300 credit coins. Start your AI-powered IT certification journey with personalized learning and practice exams.',
  keywords: [
    'CertifAI sign up',
    'free beta access',
    'register account',
    'join CertifAI',
    'IT certification training registration',
    'AI platform signup',
    'free trial registration',
    'beta user registration',
    'certification training account',
    'create account',
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
    title: 'Sign Up | CertifAI - Join 500+ Users Mastering IT Certifications',
    description:
      'Join CertifAI today and get free beta access with 300 credit coins. Start your AI-powered certification journey.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/signup',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/signup/certifai-signup-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Join CertifAI - Free Beta Access Available',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up | CertifAI - Free Beta Access',
    description: 'Join 500+ users mastering IT certifications with AI-powered learning.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/signup/certifai-signup-twitter.jpg',
        alt: 'Join CertifAI - Free Beta Access Available',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/signup',
  },
  category: 'Registration',
};
