'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  createDemoCredentialsProvider,
  type DemoCredentials,
} from '@/src/lib/demoCredentialsProvider';

interface UseDemoCredentialsRevealResult {
  isRevealed: boolean;
  isLoading: boolean;
  error: string | null;
  credentials: DemoCredentials | null;
  revealCredentials: () => Promise<void>;
  resetReveal: () => void;
}

export function useDemoCredentialsReveal(): UseDemoCredentialsRevealResult {
  const provider = useMemo(() => createDemoCredentialsProvider(), []);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<DemoCredentials | null>(null);

  const revealCredentials = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const latestCredentials = await provider.getLatestCredentials();
      setCredentials(latestCredentials);
      setIsRevealed(true);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to display demo credentials at the moment.';
      setError(message);
      setIsRevealed(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, provider]);

  const resetReveal = useCallback(() => {
    setIsRevealed(false);
    setCredentials(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isRevealed,
    isLoading,
    error,
    credentials,
    revealCredentials,
    resetReveal,
  };
}
