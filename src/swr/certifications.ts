// filepath: /Users/xingbingao/workplace/certifai-app/src/swr/certifications.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

// Define the type for the certification data you expect to send
export interface CertificationInput {
  name: string;
}

// Define the type for the expected response (optional, but good practice)
export interface CertificationResponse {
  // Example: Adjust based on what your API returns upon successful creation
  id: string;
  message?: string;
  [key: string]: any;
}

// The actual function that sends the POST request
async function registerCertificationFetcher(
  url: string,
  { arg }: { arg: CertificationInput },
): Promise<CertificationResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other necessary headers, e.g., Authorization
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    // Attempt to parse error response, otherwise use status text
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to register certification.');
  }

  return response.json();
}

// Custom hook to use for creating a certification
// This hook encapsulates the useSWRMutation logic
export function useRegisterCertification() {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    '/api/certifications', // The API endpoint for creating certifications
    registerCertificationFetcher,
    // Optional: You can add SWRMutation options here, e.g., for optimistic updates
    // {
    //   optimisticData: (currentData, newData) => [...(currentData || []), newData],
    //   populateCache: (newData, currentData) => [...(currentData || []), newData],
    //   revalidate: true, // or false, or a function
    // }
  );

  return {
    registerCertification: trigger, // Rename trigger to something more descriptive
    isCreating: isMutating,
    creationError: error,
    registeredCertification: data,
    resetCreation: reset,
  };
}

// --- Fetching a list of certifications ---

// Define the type for a single certification item in the list
export interface CertificationListItem {
  id: string;
  name: string;
  [key: string]: any;
}

// Fetcher function for getting the list of certifications
async function fetchCertifications(url: string): Promise<CertificationListItem[]> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch certifications.');
  }

  return response.json();
}

// Custom hook to use for fetching the list of certifications
export function useCertifications() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<CertificationListItem[], Error>(
    '/api/certifications',
    fetchCertifications,
  );

  return {
    certifications: data,
    isLoadingCertifications: isLoading,
    isCertificationsError: error,
    isValidatingCertifications: isValidating,
    mutateCertifications: mutate,
  };
}

/*
Usage Example in a component (ensure this is in a .tsx file):

import { useCertifications, CertificationListItem } from '@/swr/certifications';

function MyCertificationsComponent() {
  const { certifications, isLoadingCertifications, isCertificationsError } = useCertifications();

  if (isLoadingCertifications) return <div>Loading...</div>;
  if (isCertificationsError) return <div>Error: {isCertificationsError.message}</div>;

  return (
    <div>
      <h2>Certifications</h2>
      {certifications && certifications.length > 0 ? (
        <ul>
          {certifications.map((cert: CertificationListItem) => (
            <li key={cert.id}>{cert.name}</li>
          ))}
        </ul>
      ) : (
        <p>No certifications found.</p>
      )}
    </div>
  );
}
*/
