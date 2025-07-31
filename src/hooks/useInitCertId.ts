import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { useEffect, useState } from 'react';

/**
 * Hook to get the init_cert_id from Firebase Auth custom claims
 * Returns null if user is not authenticated or init_cert_id is not set
 */
export function useInitCertId() {
  const { firebaseUser, loading } = useFirebaseAuth();
  const [initCertId, setInitCertId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitCertId = async () => {
      if (!firebaseUser) {
        setInitCertId(null);
        setIsLoading(false);
        return;
      }

      try {
        // Get the latest token with custom claims
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const customClaims = idTokenResult.claims;
        const certId = customClaims.init_cert_id as number | undefined;

        setInitCertId(certId || null);
      } catch (error) {
        setInitCertId(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (loading) {
      return; // Wait for auth context to finish loading
    }

    getInitCertId();
  }, [firebaseUser, loading]);

  return {
    initCertId,
    isLoading: loading || isLoading,
    user: firebaseUser,
  };
}
