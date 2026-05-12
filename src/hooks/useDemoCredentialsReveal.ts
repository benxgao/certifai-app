'use client';

import { useCallback, useMemo, useState } from 'react';
import { type DemoCredentials } from '@/src/lib/demoCredentialsProvider';
import { useRevealDemoCredentials } from '@/src/swr/demoCredentials';

interface UseDemoCredentialsRevealResult {
  isRevealed: boolean;
  isLoading: boolean;
  error: string | null;
  credentials: DemoCredentials | null;
  revealCredentials: () => Promise<void>;
  resetReveal: () => void;
}

export function useDemoCredentialsReveal(): UseDemoCredentialsRevealResult {
  const { reveal, data, error: swrError, isLoading, reset } = useRevealDemoCredentials();
  const [isRevealed, setIsRevealed] = useState(false);

  const credentials = useMemo(() => data?.data ?? null, [data]);
  const error = useMemo(() => swrError?.message ?? null, [swrError]);

  const revealCredentials = useCallback(async () => {
    if (isLoading) {
      return;
    }

    try {
      const result = await reveal();
      if (!result?.data) {
        throw new Error('Unable to display demo credentials at the moment.');
      }
      setIsRevealed(true);
    } catch (fetchError) {
      setIsRevealed(false);
    }
  }, [isLoading, reveal]);

  const resetReveal = useCallback(() => {
    setIsRevealed(false);
    reset();
  }, [reset]);

  return {
    isRevealed,
    isLoading,
    error,
    credentials,
    revealCredentials,
    resetReveal,
  };
}
