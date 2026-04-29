// Comprehensive FAQ Schema for Certestic Platform
export const expandedFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    // Getting Started FAQs
    {
      '@type': 'Question',
      name: 'What is Certestic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Certestic is an AI-powered IT certification training platform that helps professionals prepare for and pass AWS, Azure, Google Cloud, CompTIA, Cisco, and 100+ other IT certifications. Using adaptive learning technology, the platform creates personalized study plans and generates realistic practice exams tailored to your knowledge gaps.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Certestic use AI to improve certification training?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Certestic uses AI to analyze your strengths and weaknesses across certification domains. The platform generates adaptive practice questions, identifies knowledge gaps, creates personalized study paths, and simulates realistic exam conditions. Our machine learning algorithms continuously improve question relevance based on your performance and feedback.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Certestic free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Certestic is currently in beta and offers free unlimited access to all platform features. You get 300 free credit coins upon signup to create custom AI-generated practice exams. No credit card required to access the platform.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which IT certifications does Certestic support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Certestic covers 100+ IT certifications including: AWS (Solutions Architect, Developer, SysOps), Azure (Administrator, Fundamentals, Security), Google Cloud (Associate Cloud Engineer), CompTIA (Security+, Network+, A+), Cisco (CCNA, CCNP), VMware, and many more cloud, security, networking, and database certifications.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate are Certestic\'s AI-generated practice questions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI generates questions based on actual certification exam content, topic blueprints, and real exam patterns. The questions are validated against official certification requirements and continuously refined through user feedback. We maintain question quality aligned with official exam standards.',
      },
    },
    // Platform Features FAQs
    {
      '@type': 'Question',
      name: 'Can I create custom exams for specific topics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can tell the AI to generate exams focused on specific topics, concepts, services, or technologies. Specify your learning goals (e.g., "AWS EC2 and Lambda" or "Azure networking"), and the AI creates targeted practice questions to test mastery in those specific areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Certestic tell me what I\'m weak in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Certestic provides detailed analytics showing your performance across different topics and certification domains. The platform identifies your knowledge gaps, shows areas where you need improvement, and recommends focused study paths to strengthen weak areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does adaptive learning work on Certestic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As you complete practice exams, the platform analyzes your answers, identifies patterns in your performance, and adapts the difficulty and focus of subsequent questions. If you struggle with certain topics, you\'ll receive more questions in those areas. If you master topics, the platform moves you to more challenging content.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I simulate actual certification exams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Certestic offers full-length practice exams that simulate the format, timing, and difficulty of actual certification tests. You can take timed exams under realistic test conditions to assess your readiness and build exam confidence.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Certestic compare to other exam prep platforms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike traditional static question banks or generic chatbots, Certestic uses AI to personalize your entire learning experience. We provide adaptive exams, knowledge gap identification, personalized study recommendations, and AI-generated questions targeted to your specific learning goals - all free during beta.',
      },
    },
    // Learning & Study FAQs
    {
      '@type': 'Question',
      name: 'What\'s the best way to prepare for an IT certification using Certestic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start by taking a diagnostic exam to assess your current knowledge level. Review your performance analytics to identify weak areas. Use Certestic to create focused practice exams on difficult topics. Study the recommended resources. Retake exams on those topics to verify improvement. Finally, take full-length practice exams under timed conditions to assess overall readiness.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much time should I spend studying for an IT certification?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Certification prep time varies by certification level and your background. Typically: Associate-level certifications (CompTIA A+, AWS Solutions Architect Associate) require 100-200 hours. Professional-level (AWS Solutions Architect Professional, CCNP) require 200-400 hours. Specialties vary. Certestic helps optimize study time by focusing on your actual knowledge gaps.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I track my progress on Certestic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The platform provides comprehensive progress tracking with detailed analytics including: exam scores, topic mastery percentages, knowledge gap analysis, performance trends over time, and recommendations for improvement areas. You can monitor your readiness as you study.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I take practice exams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend frequent practice (~2-3 exams per week during active study). Start with topic-focused exams on weak areas, progress to mixed-topic exams, and finish with full-length simulations. Regular practice builds confidence, identifies remaining gaps, and helps you pace yourself for exam day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do if I fail a Certestic practice exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Don\'t worry - practice exams are learning tools. Review your performance analytics to see which topics you struggled with. Examine question explanations. Study those specific areas. Create focused practice exams on weak topics. Retake exams to verify improvement. Repeat until you consistently pass.',
      },
    },
    // Account & Technical FAQs
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use Certestic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you need a free account to access Certestic. You can sign up with your email and choose a password, or use Google sign-in. Account creation is quick and doesn\'t require a credit card. Your account stores your progress, exam history, and personalized recommendations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data and progress secure on Certestic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Certestic uses enterprise-grade security including encrypted data transmission (HTTPS), secure authentication, and compliance with data protection standards. Your exam results, answers, and personal information are safely stored and never shared without your consent.',
      },
    },
    {
      '@type': 'Question',
      name: 'What devices can I use Certestic on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Certestic is a web-based platform accessible on any device with a modern web browser: desktop computers, laptops, tablets (iPad, Android), and smartphones. Your progress syncs across devices, so you can study anywhere.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do if I encounter a technical issue?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you experience technical problems, visit our Support page for troubleshooting guides and FAQs. You can also contact our support team through the platform - we\'re available to help. Try clearing your browser cache or using a different browser if you encounter display issues.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I export my exam results or study data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, you can view and screenshot your exam results and analytics within the platform. We\'re working on tools to export your study data and progress reports. Contact support if you need specific data exports.',
      },
    },
  ],
};
