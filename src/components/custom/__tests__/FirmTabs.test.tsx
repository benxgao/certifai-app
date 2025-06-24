// Test file to verify the FirmTabs component functionality
// This would be used in a Jest test environment

import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import FirmTabs from '@/components/custom/FirmTabs';

// Mock the SWR hooks
jest.mock('@/swr/firms', () => ({
  useFirms: () => ({
    firms: [
      {
        firm_id: 1,
        name: 'Amazon Web Services',
        code: 'AWS',
        description: 'Leading cloud platform provider',
        website_url: 'https://aws.amazon.com',
        _count: { certifications: 3 },
      },
      {
        firm_id: 2,
        name: 'Google Cloud Platform',
        code: 'GCP',
        description: 'Google Cloud Platform services',
        website_url: 'https://cloud.google.com',
        _count: { certifications: 5 },
      },
    ],
    isLoadingFirms: false,
    isFirmsError: null,
  }),
}));

jest.mock('@/swr/certifications', () => ({
  useAllAvailableCertifications: () => ({
    availableCertifications: [
      {
        cert_id: 1,
        firm_id: 1,
        name: 'AWS Certified Solutions Architect',
        exam_guide_url: 'https://aws.amazon.com/certification/',
        min_quiz_counts: 65,
        max_quiz_counts: 75,
        firm: {
          firm_id: 1,
          name: 'Amazon Web Services',
          code: 'AWS',
          description: 'Leading cloud platform provider',
          website_url: 'https://aws.amazon.com',
          logo_url: null,
          created_at: '2025-06-23T00:00:00Z',
          updated_at: '2025-06-23T00:00:00Z',
        },
      },
    ],
    isLoadingAvailableCertifications: false,
  }),
}));

jest.mock('@/context/UserCertificationsContext', () => ({
  useUserCertifications: () => ({
    userCertifications: [],
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('FirmTabs Component', () => {
  const mockProps = {
    onRegister: jest.fn(),
    registeringCertId: null,
  };

  test('renders tabs for firms with certifications', () => {
    render(<FirmTabs {...mockProps} />);

    // Should show "All" tab
    expect(screen.getByText(/All \(1\)/)).toBeInTheDocument();

    // Should show AWS tab
    expect(screen.getByText(/AWS \(3\)/)).toBeInTheDocument();

    // Should show GCP tab
    expect(screen.getByText(/GCP \(5\)/)).toBeInTheDocument();
  });

  test('displays firm information correctly', () => {
    render(<FirmTabs {...mockProps} />);

    // Should show firm description when a specific firm tab is selected
    // This would require additional interaction testing
  });

  test('shows certification cards with proper information', () => {
    render(<FirmTabs {...mockProps} />);

    // Should display certification name
    expect(screen.getByText('AWS Certified Solutions Architect')).toBeInTheDocument();

    // Should display question count
    expect(screen.getByText('65-75 Questions')).toBeInTheDocument();
  });

  test('handles registration correctly', () => {
    render(<FirmTabs {...mockProps} />);

    // Should show Register button for non-registered certifications
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});

export {};
