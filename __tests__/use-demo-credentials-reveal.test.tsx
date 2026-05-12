import React, { useEffect } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useDemoCredentialsReveal } from '@/src/hooks/useDemoCredentialsReveal';
import { useRevealDemoCredentials } from '@/src/swr/demoCredentials';

jest.mock('@/src/swr/demoCredentials', () => ({
  useRevealDemoCredentials: jest.fn(),
}));

type HookSnapshot = ReturnType<typeof useDemoCredentialsReveal>;

const mockUseRevealDemoCredentials = useRevealDemoCredentials as jest.MockedFunction<
  typeof useRevealDemoCredentials
>;

function HookHarness({
  onSnapshot,
}: {
  onSnapshot: (snapshot: HookSnapshot) => void;
}) {
  const snapshot = useDemoCredentialsReveal();

  useEffect(() => {
    onSnapshot(snapshot);
  }, [onSnapshot, snapshot]);

  return null;
}

describe('useDemoCredentialsReveal', () => {
  let container: HTMLDivElement;
  let root: Root;
  let latestSnapshot: HookSnapshot | null = null;

  const renderHarness = async () => {
    await act(async () => {
      root.render(
        <HookHarness
          onSnapshot={(snapshot) => {
            latestSnapshot = snapshot;
          }}
        />,
      );
    });
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    latestSnapshot = null;
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    latestSnapshot = null;
    jest.clearAllMocks();
  });

  it('defaults to hidden credentials state on mount', async () => {
    mockUseRevealDemoCredentials.mockReturnValue({
      reveal: jest.fn().mockResolvedValue(undefined),
      data: undefined,
      error: undefined,
      isLoading: false,
      reset: jest.fn(),
    });

    await renderHarness();

    expect(latestSnapshot?.isRevealed).toBe(false);
    expect(latestSnapshot?.credentials).toBeNull();
    expect(latestSnapshot?.error).toBeNull();
  });

  it('calls reveal fetch when user triggers reveal action', async () => {
    const reveal = jest.fn().mockResolvedValue({
      data: {
        username: 'demo@certestic.com',
        password: 'demo@certestic.com',
      },
    });

    mockUseRevealDemoCredentials.mockReturnValue({
      reveal,
      data: undefined,
      error: undefined,
      isLoading: false,
      reset: jest.fn(),
    });

    await renderHarness();

    await act(async () => {
      await latestSnapshot?.revealCredentials();
    });

    expect(reveal).toHaveBeenCalledTimes(1);
  });

  it('reveals credentials after successful fetch', async () => {
    mockUseRevealDemoCredentials.mockReturnValue({
      reveal: jest.fn().mockResolvedValue({
        data: {
          username: 'demo@certestic.com',
          password: 'demo@certestic.com',
        },
      }),
      data: {
        success: true,
        data: {
          username: 'demo@certestic.com',
          password: 'demo@certestic.com',
        },
      },
      error: undefined,
      isLoading: false,
      reset: jest.fn(),
    });

    await renderHarness();

    await act(async () => {
      await latestSnapshot?.revealCredentials();
    });

    expect(latestSnapshot?.isRevealed).toBe(true);
    expect(latestSnapshot?.credentials).toEqual({
      username: 'demo@certestic.com',
      password: 'demo@certestic.com',
    });
  });

  it('keeps credentials hidden when fetch fails', async () => {
    mockUseRevealDemoCredentials.mockReturnValue({
      reveal: jest.fn().mockRejectedValue(new Error('network failure')),
      data: undefined,
      error: new Error('network failure'),
      isLoading: false,
      reset: jest.fn(),
    });

    await renderHarness();

    await act(async () => {
      await latestSnapshot?.revealCredentials();
    });

    expect(latestSnapshot?.isRevealed).toBe(false);
  });

  it('returns to hidden state on new mount after previous reveal', async () => {
    mockUseRevealDemoCredentials.mockReturnValue({
      reveal: jest.fn().mockResolvedValue({
        data: {
          username: 'demo@certestic.com',
          password: 'demo@certestic.com',
        },
      }),
      data: {
        success: true,
        data: {
          username: 'demo@certestic.com',
          password: 'demo@certestic.com',
        },
      },
      error: undefined,
      isLoading: false,
      reset: jest.fn(),
    });

    await renderHarness();

    await act(async () => {
      await latestSnapshot?.revealCredentials();
    });

    expect(latestSnapshot?.isRevealed).toBe(true);

    await act(async () => {
      root.unmount();
    });

    root = createRoot(container);
    latestSnapshot = null;

    mockUseRevealDemoCredentials.mockReturnValue({
      reveal: jest.fn().mockResolvedValue(undefined),
      data: undefined,
      error: undefined,
      isLoading: false,
      reset: jest.fn(),
    });

    await renderHarness();

    expect(latestSnapshot?.isRevealed).toBe(false);
    expect(latestSnapshot?.credentials).toBeNull();
  });
});
