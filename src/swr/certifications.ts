import useSWRMutation from 'swr/mutation';
import { useAuthSWR } from './useAuthSWR';

// Define the type for the certification data you expect to send
export interface CertificationInput {
  name: string;
}

// Define the type for registering a user for a certification
export interface UserCertificationRegistrationInput {
  certificationId: number;
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
    registeredCertification: data?.data,
    resetCreation: reset,
  };
}

// --- Fetching a list of ALL available certifications (formerly useCertifications) ---

// Define the type for a single certification item in the list
export interface UserRegisteredCertification {
  user_id: string;
  cert_id: number;
  status: string;
  assigned_at: string;
  updated_at: string;
  certification: {
    cert_id: number;
    // cert_category_id: number;
    name: string;
    exam_guide_url: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
}

export interface CertificationListItem {
  cert_id: number;
  // cert_category_id: number;
  name: string;
  exam_guide_url: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
}

// Custom hook to use for fetching the list of all available certifications
export function useAllAvailableCertifications() {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    { data: CertificationListItem[] },
    Error
  >(
    '/api/certifications', // Endpoint for all available certifications
  );

  return {
    availableCertifications: data?.data,
    isLoadingAvailableCertifications: isLoading,
    isAvailableCertificationsError: error,
    isValidatingAvailableCertifications: isValidating,
    mutateAvailableCertifications: mutate,
  };
}

// --- Fetching a list of USER'S REGISTERED certifications ---

// Custom hook to use for fetching the list of a user's registered certifications
export function useUserRegisteredCertifications(apiUserId: string | null) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    { data: UserRegisteredCertification[] },
    Error
  >(
    apiUserId ? `/api/users/${apiUserId}/certifications` : null, // Conditional fetching
  );

  return {
    userCertifications: data?.data,
    isLoadingUserCertifications: isLoading,
    isUserCertificationsError: error,
    isValidatingUserCertifications: isValidating,
    mutateUserCertifications: mutate,
  };
}

// --- Registering a USER for a specific certification ---

// The actual function that sends the POST request for a user to register for a certification
async function registerUserForCertificationFetcher(
  url: string, // This url will include the apiUserId
  { arg }: { arg: UserCertificationRegistrationInput },
): Promise<CertificationResponse> {
  // Assuming CertificationResponse is a suitable response type
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other necessary headers, e.g., Authorization
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to register user for certification.');
  }

  return response.json();
}

// Custom hook for a user to register for a certification
export function useRegisterUserForCertification(apiUserId: string | null) {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    apiUserId ? `/api/users/${apiUserId}/certifications` : null, // The API endpoint for user registration
    registerUserForCertificationFetcher,
  );

  return {
    registerForCertification: trigger,
    isRegistering: isMutating,
    registrationError: error,
    registrationData: data?.data,
    resetRegistration: reset,
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
