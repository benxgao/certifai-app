import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

/**
 * Hook to get the api_user_id from Firebase Auth context
 * Returns null if user is not authenticated or api_user_id is not set
 */
export function useApiUserId() {
  const { apiUserId, loading, firebaseUser } = useFirebaseAuth();

  return {
    apiUserId,
    loading,
    user: firebaseUser,
  };
}
