import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'CertifAI | Simulate Exams by AI & Prepare for IT Certification by Self Exams | Beta Access Available',
  description:
    'Simulate exams by AI and prepare for IT certification by self exams with 500+ beta users. AI-powered practice questions, personalized study recommendations, and adaptive learning. Free beta access with 300 credit coins.',
  keywords: [
    'CertifAI',
    'simulate exams by AI',
    'prepare for IT certification by self exams',
    'AI-powered IT certification training',
    'IT certification practice exams',
    'artificial intelligence learning platform',
    'personalized study recommendations',
    'adaptive certification training',
    'AI-generated practice questions',
    'IT professional development',
    'certification exam simulator',
    'self exam preparation',
    'AI exam simulation technology',
    'beta testing platform',
    'free certification training',
    'machine learning education',
    'IT career advancement',
    'online certification preparation',
    'smart study technology',
    'certification success platform',
    'self-paced exam simulation',
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
    title: 'CertifAI | Simulate Exams by AI & Prepare for IT Certification by Self Exams',
    description:
      'Simulate exams by AI and prepare for IT certification by self exams with 500+ beta users. AI-powered practice questions and personalized study recommendations. Free beta access available.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/landing/certifai-homepage-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI - AI-Powered IT Certification Training Platform Homepage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertifAI | Simulate Exams by AI & Prepare for IT Certification by Self Exams',
    description:
      'Simulate exams by AI and prepare for IT certification by self exams with 500+ beta users. AI-powered practice questions and personalized study recommendations.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/landing/certifai-homepage-twitter.jpg',
        alt: 'CertifAI - AI-Powered IT Certification Training Platform',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app',
  },
  category: 'Education',
  applicationName: 'CertifAI',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
