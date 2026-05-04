import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { isApiError } from '@/src/types/api';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { useAuthSWR } from './useAuthSWR';
import { ApiResponse, PaginatedApiResponse } from '../types/api';
import { fetchAllCertifications } from '../lib/pagination-utils';
import {
  CertificationInput,
  CertificationMutationResponse,
  UserCertificationData,
  CertificationDeletionData,
  CertificationListItem,
  UserCertificationRegistrationInput,
  UserRegisteredCertification,
  CertificationStatus,
  CertificationInfo,
  KnowledgePoolingData,
  KnowledgePoolingGenerateData,
} from '../types/swr-data/certifications';

// Re-export types for backward compatibility
export type { CertificationStatus, CertificationInfo };
export { CertificationStatus as CertificationStatusEnum };

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
): Promise<CertificationMutationResponse> {
  const { refreshToken, ...certificationData } = arg;

  let response = await fetch('/api/public/certifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(certificationData),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch('/api/public/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificationData),
      });
    } else {
      // If refresh failed, throw authentication error
      throw new Error('Authentication failed. Please sign in again.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to register certification.');
  }

  const result = await response.json();
  return result.data || result;
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
    registeredCertification: data,
    resetCreation: reset,
  };
}

// --- Fetching a list of ALL available certifications (formerly useCertifications) ---

// Helper to recursively fetch all paginated certifications
async function fetchAllCertificationsPaginated() {
  // Use the new utility function instead
  const data = await fetchAllCertifications();
  return { data, meta: { total: data.length } };
}

// Custom hook to use for fetching the list of all available certifications (fetches all pages)
export function useAllAvailableCertifications() {
  // Use custom fetcher to load all pages recursively
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: CertificationListItem[]; meta: { total: number } },
    Error
  >('all-certifications', fetchAllCertificationsPaginated, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false, // Reduced reconnection fetching
    dedupingInterval: 300000, // Increased cache time to 5 minutes for better performance
    refreshInterval: 0, // Don't auto-refresh
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    focusThrottleInterval: 60000, // Throttle focus revalidation to 1 minute
    errorRetryCount: 1, // Reduced retry count
    errorRetryInterval: 5000,
    keepPreviousData: true, // Keep previous data while revalidating
    // Only retry on network errors, not on API errors
    shouldRetryOnError: (error) => {
      return error instanceof Error && error.name === 'NetworkError';
    },
  });

  // Optionally, expose a function to fetch all pages on demand
  const fetchAll = async () => {
    return fetchAllCertificationsPaginated();
  };

  return {
    availableCertifications: data?.data, // SwrDataApiCertificationsListResponse
    pagination: data?.meta,
    isLoadingAvailableCertifications: isLoading,
    isAvailableCertificationsError: error,
    isValidatingAvailableCertifications: isValidating,
    mutateAvailableCertifications: mutate,
    fetchAllAvailableCertifications: fetchAll, // Expose for manual use if needed
  };
}

// --- Fetching a list of USER'S REGISTERED certifications ---

// Custom hook to use for fetching the list of a user's registered certifications
export function useUserRegisteredCertifications(apiUserId: string | null) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<UserRegisteredCertification[]>,
    Error
  >(
    apiUserId ? `/api/users/${apiUserId}/certifications` : null, // Conditional fetching
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false, // Reduced reconnection fetching
      dedupingInterval: 120000, // Increased cache time to 2 minutes for better performance
      refreshInterval: 0, // Don't auto-refresh
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      focusThrottleInterval: 30000, // Increased throttle to 30 seconds
      errorRetryCount: 1, // Reduced retry count for faster failure recovery
      errorRetryInterval: 5000,
      keepPreviousData: true, // Keep previous data while revalidating for better UX
      // Be more selective about retries
      shouldRetryOnError: (error) => {
        const status = isApiError(error) ? error.status : undefined;
        // Don't retry on cancellation errors or auth errors
        if (error instanceof Error && error.name === 'CancelledError') return false;
        if (status === 401) return false;
        // Only retry on network/timeout errors
        return error instanceof Error &&
          (error.name === 'TimeoutError' || error.name === 'NetworkError');
      },
    },
  );

  return {
    userCertifications: data?.data, // SwrDataApiUserCertificationsResponse
    pagination: data?.meta,
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
): Promise<UserCertificationData> {
  const { apiUserId, certificationId, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/certifications`;

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cert_id: certificationId }),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cert_id: certificationId }),
      });
    } else {
      // If refresh failed, throw authentication error
      throw new Error('Authentication failed. Please sign in again.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to register user for certification.');
  }

  const result = await response.json();
  return result.data || result;
}

// Custom hook for a user to register for a certification
export function useRegisterUserForCertification(apiUserId: string | null) {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error, data, reset } = useSWRMutation<
    UserCertificationData,
    Error,
    string | null,
    { apiUserId: string; certificationId: number; refreshToken: () => Promise<string | null> }
  >(
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
    registrationData: data,
    resetRegistration: reset,
  };
}

// --- Fetching individual certification details (authenticated) ---

// Custom hook for fetching individual certification details with Firebase authentication
// This is for authenticated pages in /main area that need detailed certification info
export function useAuthenticatedCertificationDetail(certificationId: string | null) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    {
      success: boolean;
      data: CertificationListItem;
      meta: {
        related_count: number;
        timestamp: string;
      };
    },
    Error
  >(
    certificationId ? `/api/public/certifications/${certificationId}` : null, // Always use public endpoint for all app requests
    {
      // Aggressive deduplication to prevent duplicate requests
      dedupingInterval: 60000, // 60 seconds for maximum deduplication
      focusThrottleInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: false,
      keepPreviousData: true,
      errorRetryCount: 0, // No retries to prevent duplicate requests
      errorRetryInterval: 10000,
    },
  );

  return {
    certification: data?.data, // SwrDataApiCertificationDetailResponse
    meta: data?.meta,
    isLoadingCertification: isLoading,
    isCertificationError: error,
    isValidatingCertification: isValidating,
    mutateCertification: mutate,
  };
}

// Fetcher function for unregistering from a certification with auth refresh support
async function unregisterCertificationFetcher(
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
): Promise<CertificationDeletionData> {
  const { apiUserId, certificationId, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/certifications?cert_id=${certificationId}`;

  let response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // If refresh failed, throw authentication error
      throw new Error('Authentication failed. Please sign in again.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to unregister from certification.');
  }

  const result = await response.json();
  return result.data || result;
}

// Custom hook for unregistering from a certification
export function useUnregisterCertification(apiUserId: string | null) {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error, data, reset } = useSWRMutation<
    CertificationDeletionData,
    Error,
    string | null,
    { apiUserId: string; certificationId: number; refreshToken: () => Promise<string | null> }
  >(
    apiUserId ? `UNREGISTER_CERTIFICATION_${apiUserId}` : null,
    unregisterCertificationFetcher,
  );

  // Wrapper to inject refreshToken function and apiUserId
  const unregisterFromCertification = (certificationId: number) => {
    if (!apiUserId) {
      throw new Error('User ID is required');
    }
    return trigger({
      apiUserId,
      certificationId,
      refreshToken,
    });
  };

  return {
    unregisterFromCertification,
    isUnregistering: isMutating,
    unregistrationError: error,
    unregistrationData: data,
    resetUnregistration: reset,
  };
}

// === Knowledge Pooling Hooks ===

/**
 * Hook to fetch existing knowledge pooling data for a certification.
 * GET /api/users/:apiUserId/certifications/:certId/knowledge-pooling
 */
export function useGetKnowledgePooling(apiUserId: string | null, certId: number | null) {
  const key = apiUserId && certId ? `/api/users/${apiUserId}/certifications/${certId}/knowledge-pooling` : null;

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    ApiResponse<KnowledgePoolingData>,
    Error
  >(key, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
    refreshInterval: 0,
    keepPreviousData: true,
    errorRetryCount: 1,
    errorRetryInterval: 5000,
  });

  return {
    knowledgePooling: data?.data,
    isLoadingKnowledgePooling: isLoading,
    knowledgePoolingError: error,
    isValidatingKnowledgePooling: isValidating,
    mutateKnowledgePooling: mutate,
  };
}

async function generateKnowledgePoolingFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certId: number;
      examId: string;
      forceGenerate?: boolean;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<KnowledgePoolingGenerateData> {
  const { apiUserId, certId, examId, forceGenerate = true, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/certifications/${certId}/knowledge-pooling`;

  const body = JSON.stringify({ exam_id: examId, forceGenerate });

  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (response.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } else {
      throw new Error('Authentication failed. Please sign in again.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to generate knowledge pooling.');
  }

  return response.json();
}

/**
 * Hook to generate knowledge pooling insights for a certification.
 * POST /api/users/:apiUserId/certifications/:certId/knowledge-pooling
 */
export function useGenerateKnowledgePooling(apiUserId: string | null) {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error, data, reset } = useSWRMutation<
    KnowledgePoolingGenerateData,
    Error,
    string | null,
    {
      apiUserId: string;
      certId: number;
      examId: string;
      forceGenerate?: boolean;
      refreshToken: () => Promise<string | null>;
    }
  >(
    apiUserId ? `GENERATE_KNOWLEDGE_POOLING_${apiUserId}` : null,
    generateKnowledgePoolingFetcher,
  );

  const generateKnowledgePooling = (arg: { certId: number; examId: string; forceGenerate?: boolean }) => {
    if (!apiUserId) {
      throw new Error('User ID is required');
    }
    return trigger({ ...arg, apiUserId, refreshToken });
  };

  return {
    generateKnowledgePooling,
    isGenerating: isMutating,
    generationError: error,
    generationData: data,
    resetGeneration: reset,
  };
}
