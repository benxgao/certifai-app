import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | CertifAI - Access Your AI-Powered Training Account',
  description:
    'Sign in to your CertifAI account to access AI-powered IT certification training, personalized study plans, and practice exams. Secure login for beta users.',
  keywords: [
    'CertifAI sign in',
    'login',
    'user account access',
    'certification training login',
    'AI platform access',
    'beta user login',
    'secure authentication',
    'account portal',
    'platform access',
    'user authentication',
  ].join(', '),
  authors: [{ name: 'CertifAI Team' }],
  creator: 'CertifAI',
  publisher: 'CertifAI',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Sign In | CertifAI - Access Your Training Account',
    description:
      'Sign in to access your AI-powered IT certification training account and personalized study materials.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/signin',
    siteName: 'CertifAI',
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | CertifAI',
    description: 'Access your AI-powered IT certification training account.',
    creator: '@CertifAI',
    site: '@CertifAI',
  },
  alternates: {
    canonical: 'https://certifai.app/signin',
  },
  category: 'Authentication',
};
