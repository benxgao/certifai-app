import useSWRMutation from 'swr/mutation';
import { useAuthSWR } from './useAuthSWR';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

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

// Fetcher function for registering certifications with auth refresh support
async function registerCertificationFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: CertificationInput & {
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<CertificationResponse> {
  const { refreshToken, ...certificationData } = arg;

  let response = await fetch('/api/certifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(certificationData),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    console.log('Token expired during certification registration, attempting refresh...');
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch('/api/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificationData),
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to register certification.');
  }

  return response.json();
}

// Custom hook to use for creating a certification
// This hook encapsulates the useSWRMutation logic
export function useRegisterCertification() {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    'REGISTER_CERTIFICATION', // The API endpoint for creating certifications
    registerCertificationFetcher,
    // Optional: You can add SWRMutation options here, e.g., for optimistic updates
    // {
    //   optimisticData: (currentData, newData) => [...(currentData || []), newData],
    //   populateCache: (newData, currentData) => [...(currentData || []), newData],
    //   revalidate: true, // or false, or a function
    // }
  );

  // Wrapper to inject refreshToken function
  const registerCertification = (arg: CertificationInput) => {
    return trigger({ ...arg, refreshToken });
  };

  return {
    registerCertification, // Rename trigger to something more descriptive
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

// Fetcher function for user registration to certifications with auth refresh support
async function registerUserForCertificationFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certificationId: number;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<CertificationResponse> {
  const { apiUserId, certificationId, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/certifications`;

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ certificationId }),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    console.log('Token expired during user certification registration, attempting refresh...');
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificationId }),
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to register user for certification.');
  }

  return response.json();
}

// Custom hook for a user to register for a certification
export function useRegisterUserForCertification(apiUserId: string | null) {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    apiUserId ? `REGISTER_USER_FOR_CERTIFICATION_${apiUserId}` : null, // The API endpoint for user registration
    registerUserForCertificationFetcher,
  );

  // Wrapper to inject refreshToken function and apiUserId
  const registerForCertification = (arg: UserCertificationRegistrationInput) => {
    if (!apiUserId) {
      throw new Error('User ID is required');
    }
    return trigger({
      apiUserId,
      certificationId: arg.certificationId,
      refreshToken,
    });
  };

  return {
    registerForCertification,
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
