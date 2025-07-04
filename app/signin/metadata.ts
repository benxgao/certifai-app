import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Certestic - Access Your AI-Powered Training Account',
  description:
    'Sign in to your Certestic account to access AI-powered IT certification training, personalized study plans, and practice exams. Secure login for beta users.',
  keywords: [
    'Certestic sign in',
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
  authors: [{ name: 'Certestic Team' }],
  creator: 'Certestic',
  publisher: 'Certestic',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Sign In | Certestic - Access Your Training Account',
    description:
      'Sign in to access your AI-powered IT certification training account and personalized study materials.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/signin',
    siteName: 'Certestic',
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | Certestic',
    description: 'Access your AI-powered IT certification training account.',
    creator: '@Certestic',
    site: '@Certestic',
  },
  alternates: {
    canonical: 'https://certestic.com/signin',
  },
  category: 'Authentication',
};
