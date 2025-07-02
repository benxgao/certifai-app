// FAQ Schema for SEO
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is CertifAI and how can I simulate exams by AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CertifAI is an AI-powered IT certification training platform that allows you to simulate exams by AI and prepare for IT certification by self exams. Our technology provides personalized learning experiences, AI-generated practice questions, and adaptive study recommendations to help professionals succeed in their certification goals.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I create exams on particular exam topics to test my knowledge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can create exams on particular exam topics by telling our AI to generate exams on your particular needs. Simply specify the topics, concepts, or technologies you want to focus on, and the AI will generate targeted questions to test if you have mastered knowledge in those specific areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I tell AI to generate exams focused on specific topics for free during beta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! During our beta phase, new users receive 300 credit coins absolutely free to create exams on particular exam topics and test knowledge mastery. This allows you to thoroughly test our topic-focused AI exam generation platform while providing valuable feedback.',
      },
    },
    {
      '@type': 'Question',
      name: 'What IT certification topics can I create exams for using AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CertifAI supports various IT certification topics including cloud computing, cybersecurity, networking, and software development. You can create exams on particular exam topics and tell AI to generate questions focused on specific concepts, technologies, or certification domains for most major certification programs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is the topic-focused AI exam generation for testing knowledge mastery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our topic-focused AI exam generation technology is continuously refined based on user feedback and performance data. While we are in beta, we are actively improving the accuracy and relevance of topic-specific questions to ensure they effectively test knowledge mastery and align with actual certification exam standards.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is CertifAI better than generating exam tests in AI chatbots directly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CertifAI provides a superior user experience compared to AI chatbots with professional exam formatting, timed sessions, dedicated progress tracking, and seamless workflow designed specifically for certification preparation. Unlike basic text responses in chatbots, CertifAI offers a purpose-built platform for creating exams on particular exam topics.',
      },
    },
  ],
};
