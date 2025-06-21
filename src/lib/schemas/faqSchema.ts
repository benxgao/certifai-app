// FAQ Schema for SEO
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is CertifAI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CertifAI is an AI-powered IT certification training platform that provides personalized learning experiences, AI-generated practice questions, and adaptive study recommendations to help professionals succeed in their certification goals.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI-powered learning work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI technology analyzes your learning patterns, strengths, and weaknesses to generate personalized practice questions and study recommendations. The system adapts to your progress and provides targeted content to help you improve in areas where you need the most support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is CertifAI really free during beta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! During our beta phase, new users receive 300 credit coins absolutely free, which is enough for approximately 5 practice exams. This allows you to thoroughly test our platform and provide valuable feedback.',
      },
    },
    {
      '@type': 'Question',
      name: 'What IT certifications does CertifAI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CertifAI supports various IT certification tracks including cloud computing, cybersecurity, networking, and software development certifications. Our AI can generate practice questions for most major certification programs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate are the AI-generated practice questions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI-generated practice questions are continuously refined based on user feedback and performance data. While we are in beta, we are actively improving the accuracy and relevance of questions to ensure they align with actual certification exam standards.',
      },
    },
  ],
};
