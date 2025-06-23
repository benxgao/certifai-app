import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | CertifAI Certifications',
    default: 'IT Certifications | CertifAI',
  },
  description:
    'Explore IT certifications from leading technology companies with AI-powered training.',
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
