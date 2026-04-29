// How-To Schema for Certification Training Process
export const certificationTrainingHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Prepare for IT Certifications with AI-Powered Training',
  description:
    'A comprehensive step-by-step guide to using Certestic for IT certification training. Learn how to leverage adaptive AI, personalized study plans, and practice exams to pass your certification exam.',
  image: [
    'https://certestic.com/how-to-certification-training.png',
  ],
  totalTime: 'PT60H',
  estimatedCost: {
    '@type': 'PriceSpecification',
    priceCurrency: 'USD',
    price: '0',
  },
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Certestic Platform',
    },
    {
      '@type': 'HowToTool',
      name: 'Practice Exams',
    },
    {
      '@type': 'HowToTool',
      name: 'Performance Analytics',
    },
  ],
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Study time commitment',
    },
    {
      '@type': 'HowToSupply',
      name: 'Computer with internet connection',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Create Your Certestic Account',
      text: 'Sign up for free on Certestic with your email or Google account. No credit card required. You\'ll receive 300 free credit coins to create custom practice exams.',
      image: 'https://certestic.com/step-1-signup.png',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Select Your Target Certification',
      text: 'Choose the IT certification you want to prepare for. Certestic supports AWS, Azure, Google Cloud, CompTIA, Cisco, VMware, and 100+ other certifications. Select your specific certification (e.g., AWS Solutions Architect Associate).',
      image: 'https://certestic.com/step-2-select-cert.png',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Take a Diagnostic Exam',
      text: 'Take an initial diagnostic exam covering the full certification curriculum. This establishes your baseline knowledge level and helps the AI identify your strengths and weaknesses.',
      image: 'https://certestic.com/step-3-diagnostic.png',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Review Your Knowledge Gap Analysis',
      text: 'Analyze your diagnostic exam results. Certestic provides detailed reports showing which topics and domains you need to focus on. Your knowledge gap analysis guides your entire study strategy.',
      image: 'https://certestic.com/step-4-analysis.png',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Create Focused Practice Exams',
      text: 'Use Certestic\'s AI to generate targeted practice exams on your weakest areas. Tell the AI specifically which topics to focus on (e.g., "AWS Lambda and API Gateway" or "Azure networking and security"). This targeted approach maximizes study efficiency.',
      image: 'https://certestic.com/step-5-focused-exams.png',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Study and Learn from Questions',
      text: 'Complete the practice exams and carefully review every question, especially those you missed. Understand not just the correct answer, but why other options are wrong. Use explanations and pursue deeper learning on weak concepts.',
      image: 'https://certestic.com/step-6-study.png',
    },
    {
      '@type': 'HowToStep',
      position: 7,
      name: 'Follow Adaptive Recommendations',
      text: 'The platform recommends next steps based on your performance. If you\'re struggling with specific topics, focus on those. If you\'re mastering areas, move toward integration and full-length exams. Trust the AI\'s recommendations.',
      image: 'https://certestic.com/step-7-recommendations.png',
    },
    {
      '@type': 'HowToStep',
      position: 8,
      name: 'Progress to Full-Length Exams',
      text: 'Once you\'ve improved performance on topic-focused exams, take full-length practice exams under timed conditions. These simulate actual certification exam format, timing, and difficulty.',
      image: 'https://certestic.com/step-8-full-length.png',
    },
    {
      '@type': 'HowToStep',
      position: 9,
      name: 'Monitor Progress Trends',
      text: 'Check your progress analytics dashboard regularly. Look for upward trends in your scores and improvement in previously weak areas. Certestic shows you how close you are to certification readiness.',
      image: 'https://certestic.com/step-9-progress.png',
    },
    {
      '@type': 'HowToStep',
      position: 10,
      name: 'Achieve Target Score and Schedule Exam',
      text: 'When you consistently score above your target (typically 70-80% on practice exams), you\'re ready. Schedule your official certification exam with confidence. Keep practicing until exam day to maintain knowledge.',
      image: 'https://certestic.com/step-10-schedule.png',
    },
  ],
};

// Service Schema for Certification Training
export const certificationTrainingServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalService',
  name: 'AI-Powered IT Certification Training',
  description:
    'Comprehensive AI-powered certification training service for AWS, Azure, Google Cloud, CompTIA, Cisco, and 100+ IT certifications. Includes adaptive practice exams, knowledge gap analysis, personalized study plans, and realistic exam simulation.',
  serviceType: 'IT Certification Preparation',
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Certification Training Programs',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Cloud Certifications',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: 'AWS Certifications',
            description: 'AWS Solutions Architect, Developer, SysOps exams',
          },
          {
            '@type': 'Offer',
            itemOffered: 'Azure Certifications',
            description: 'Azure Administrator, Developer, Solutions Architect exams',
          },
          {
            '@type': 'Offer',
            itemOffered: 'Google Cloud Certifications',
            description: 'Associate Cloud Engineer, Professional certifications',
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Security Certifications',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: 'CompTIA Security+',
            description: 'Industry-leading security certification',
          },
          {
            '@type': 'Offer',
            itemOffered: 'Cisco CCNA Security',
            description: 'Cisco network security certification',
          },
        ],
      },
    ],
  },
  provider: {
    '@type': 'Organization',
    name: 'Certestic',
    url: 'https://certestic.com',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    description: 'Free access during beta period with 300 free practice exam credits',
  },
};

// Learning Resource Schema
export const learningResourceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Certestic IT Certification Training Platform',
  description:
    'AI-powered learning platform for preparing for IT certifications with adaptive practice exams and personalized study plans.',
  educationalLevel: 'Beginner to Advanced',
  url: 'https://certestic.com',
  author: {
    '@type': 'Organization',
    name: 'Certestic Team',
  },
  learningResourceType: [
    'Interactive Practice Exams',
    'Adaptive Learning',
    'Personalized Study Plans',
    'Performance Analytics',
    'Knowledge Gap Analysis',
  ],
  about: [
    {
      '@type': 'Thing',
      name: 'Cloud Computing Certifications',
      description: 'AWS, Azure, Google Cloud certification training',
    },
    {
      '@type': 'Thing',
      name: 'Cybersecurity Certifications',
      description: 'Security-focused IT certifications like CompTIA Security+',
    },
    {
      '@type': 'Thing',
      name: 'Networking Certifications',
      description: 'Network administration and engineering certifications',
    },
  ],
};
