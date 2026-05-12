import {
  createDemoCredentialsProvider,
  DEFAULT_DEMO_CREDENTIALS_DISPLAY,
  formatDemoCredentialsForDisplay,
} from '@/src/lib/demoCredentialsProvider';
import { FeatureFlags } from '@/src/config/featureFlags';

describe('demoCredentialsProvider', () => {
  const originalSource = FeatureFlags.DEMO_CREDENTIALS_SOURCE;
  const originalFetch = global.fetch;

  afterEach(() => {
    (FeatureFlags as { DEMO_CREDENTIALS_SOURCE: 'hardcoded' | 'api' }).DEMO_CREDENTIALS_SOURCE =
      originalSource;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns hardcoded credentials in hardcoded mode', async () => {
    (FeatureFlags as { DEMO_CREDENTIALS_SOURCE: 'hardcoded' | 'api' }).DEMO_CREDENTIALS_SOURCE =
      'hardcoded';

    const provider = createDemoCredentialsProvider();
    const credentials = await provider.getLatestCredentials();

    expect(credentials).toEqual({
      username: DEFAULT_DEMO_CREDENTIALS_DISPLAY,
      password: DEFAULT_DEMO_CREDENTIALS_DISPLAY,
    });
  });

  it('fetches credentials from API in api mode', async () => {
    (FeatureFlags as { DEMO_CREDENTIALS_SOURCE: 'hardcoded' | 'api' }).DEMO_CREDENTIALS_SOURCE =
      'api';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          username: 'demo-user@example.com',
          password: 'demo-pass',
          updatedAt: '2026-05-12T00:00:00.000Z',
        },
      }),
    } as Response);

    const provider = createDemoCredentialsProvider();
    const credentials = await provider.getLatestCredentials();

    expect(global.fetch).toHaveBeenCalledWith('/api/demo-credentials', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });
    expect(credentials).toEqual({
      username: 'demo-user@example.com',
      password: 'demo-pass',
      updatedAt: '2026-05-12T00:00:00.000Z',
    });
  });

  it('throws when API returns non-ok status', async () => {
    (FeatureFlags as { DEMO_CREDENTIALS_SOURCE: 'hardcoded' | 'api' }).DEMO_CREDENTIALS_SOURCE =
      'api';

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'error' }),
    } as Response);

    const provider = createDemoCredentialsProvider();

    await expect(provider.getLatestCredentials()).rejects.toThrow(
      'Failed to fetch latest demo credentials. Please try again.',
    );
  });

  it('formats identical credentials as single value', () => {
    const display = formatDemoCredentialsForDisplay({
      username: 'demo@certestic.com',
      password: 'demo@certestic.com',
    });

    expect(display).toBe('demo@certestic.com');
  });

  it('formats different username/password with labels', () => {
    const display = formatDemoCredentialsForDisplay({
      username: 'demo-user',
      password: 'demo-pass',
    });

    expect(display).toBe('username: demo-user • password: demo-pass');
  });
});
