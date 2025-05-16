// src/services/featureService.ts

export interface Feature {
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export const getFeatures = (): Feature[] => [
  {
    title: 'Comprehensive Study Materials',
    description:
      'Access up-to-date resources and practice exams tailored for top IT certifications.',
  },
  {
    title: 'Expert Guidance',
    description: 'Learn from certified professionals with years of industry experience.',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey and identify areas for improvement.',
  },
];

export const getPricingPlans = (): PricingPlan[] => [
  {
    name: 'Basic',
    price: '$19/mo',
    features: ['Access to study materials', 'Basic progress tracking'],
  },
  {
    name: 'Pro',
    price: '$49/mo',
    features: ['All Basic features', 'Practice exams', 'Expert Q&A sessions'],
  },
  {
    name: 'Premium',
    price: '$99/mo',
    features: ['All Pro features', '1-on-1 mentoring', 'Certification guarantee'],
  },
];