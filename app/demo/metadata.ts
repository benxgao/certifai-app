import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Component Demos | Certestic Design System Showcase',
  description:
    'Interactive showcase of Certestic UI components and design system elements. Explore our enhanced notification bars, cards, buttons, and other reusable components built with glass-morphism styling and full dark mode support.',
  keywords: [
    'design system demo',
    'UI components',
    'Certestic design system',
    'component showcase',
    'notification bar demo',
    'glass-morphism components',
    'dark mode components',
    'interactive components',
    'web components library',
    'design system documentation',
  ].join(', '),
  authors: [{ name: 'Certestic Team' }],
  creator: 'Certestic',
  publisher: 'Certestic',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Certestic Design System Component Showcase',
    description:
      'Interactive demonstrations of our UI components and design patterns. Explore glass-morphism styling, dark mode support, and modern web component design.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/demo',
    siteName: 'Certestic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Component Demos | Certestic Design System',
    description: 'Interactive showcase of UI components with modern design patterns and full dark mode support.',
    creator: '@Certestic',
    site: '@Certestic',
  },
  alternates: {
    canonical: 'https://certestic.com/demo',
  },
};
