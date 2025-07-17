import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Certestic - Join a growing number of Users Mastering IT Certifications with AI',
  description:
    'Join Certestic today and get free beta access with 300 credit coins. Start your AI-powered IT certification journey with personalized learning and practice exams.',
  keywords: [
    'Certestic sign up',
    'free beta access',
    'register account',
    'join Certestic',
    'IT certification training registration',
    'AI platform signup',
    'free trial registration',
    'beta user registration',
    'certification training account',
    'create account',
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
    title: 'Sign Up | Certestic - Join a growing number of Users Mastering IT Certifications',
    description:
      'Join Certestic today and get free beta access with 300 credit coins. Start your AI-powered certification journey.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/signup',
    siteName: 'Certestic',
    images: [
      {
        url: '/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'Join Certestic - Free Beta Access Available',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up | Certestic - Free Beta Access',
    description:
      'Join a growing number of users mastering IT certifications with AI-powered learning.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/favicon.ico',
        alt: 'Join Certestic - Free Beta Access Available',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/signup',
  },
  category: 'Registration',
};
