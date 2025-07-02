import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'CertifAI | Create Exams on Particular Topics & Test Knowledge Mastery with AI | Beta Access',
  description:
    'Create exams on particular exam topics to test if you have mastered knowledge. Tell AI to generate exams on your particular needs like focusing on specific concepts or technologies. Superior user experience compared to generating exam tests in AI chatbots directly.',
  keywords: [
    'CertifAI',
    'create exams on particular exam topics',
    'test knowledge mastery with AI',
    'tell AI to generate exams on particular needs',
    'better than AI chatbots for exams',
    'superior user experience vs chatbots',
    'dedicated exam platform vs AI chatbots',
    'topic-focused exam generation',
    'AI-powered IT certification training',
    'concept-specific practice questions',
    'artificial intelligence learning platform',
    'personalized topic-based study',
    'adaptive certification training',
    'AI-generated topic-focused questions',
    'IT professional development',
    'certification topic mastery',
    'custom exam topic creation',
    'AI exam topic simulation',
    'professional exam interface',
    'timed exam sessions',
    'exam progress tracking',
    'beta testing platform',
    'free certification training',
    'machine learning education',
    'IT career advancement',
    'topic-specific exam preparation',
    'smart study technology',
    'certification success platform',
    'knowledge mastery assessment',
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
    title: 'CertifAI | Create Exams on Particular Topics & Test Knowledge Mastery with AI',
    description:
      'Create exams on particular exam topics to test knowledge mastery. Tell AI to generate exams on your particular needs like focusing on specific concepts or technologies. Better user experience than AI chatbots. Join a growing number of beta users.',
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
      'Simulate exams by AI and prepare for IT certification by self exams with a growing number of beta users. AI-powered practice questions and personalized study recommendations.',
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
