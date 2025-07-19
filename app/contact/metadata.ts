import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Certestic - Get Support & Share Feedback',
  description:
    "Get in touch with the Certestic team for technical support, product feedback, or general inquiries. We're here to help you succeed in your IT certification journey.",
  keywords:
    'contact, support, help, feedback, Certestic, IT certification, customer service, technical support, community',
  robots: 'index, follow',
  openGraph: {
    title: 'Contact Certestic | Expert Support for IT Certification Success',
    description:
      "Get professional support, share feedback, and connect with our team. We're committed to helping you achieve your certification goals.",
    type: 'website',
    images: [
      {
        url: '/api/og?title=Contact Certestic&description=Get expert support for your IT certification journey',
        width: 1200,
        height: 630,
        alt: 'Contact Certestic - Expert Support Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Certestic | Expert Support for IT Certification Success',
    description:
      'Get professional support and connect with our team for your certification journey.',
  },
};
