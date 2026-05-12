import { FeatureFlags } from '@/src/config/featureFlags';

export const DEFAULT_DEMO_CREDENTIALS_DISPLAY = 'demo@certestic.com';

export interface DemoCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

export interface DemoCredentialsProvider {
  getLatestCredentials(): Promise<DemoCredentials>;
}

type DemoCredentialsPayload = {
  username?: string;
  password?: string;
  updatedAt?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractCredentialsPayload(value: unknown): DemoCredentialsPayload | null {
  if (!isObject(value)) {
    return null;
  }

  const direct: DemoCredentialsPayload = {
    username: typeof value.username === 'string' ? value.username : undefined,
    password: typeof value.password === 'string' ? value.password : undefined,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : undefined,
  };

  if (direct.username || direct.password) {
    return direct;
  }

  const nested = value.data;
  if (!isObject(nested)) {
    return null;
  }

  return {
    username: typeof nested.username === 'string' ? nested.username : undefined,
    password: typeof nested.password === 'string' ? nested.password : undefined,
    updatedAt: typeof nested.updatedAt === 'string' ? nested.updatedAt : undefined,
  };
}

class HardcodedDemoCredentialsProvider implements DemoCredentialsProvider {
  async getLatestCredentials(): Promise<DemoCredentials> {
    return {
      username: DEFAULT_DEMO_CREDENTIALS_DISPLAY,
      password: DEFAULT_DEMO_CREDENTIALS_DISPLAY,
    };
  }
}

class ApiDemoCredentialsProvider implements DemoCredentialsProvider {
  async getLatestCredentials(): Promise<DemoCredentials> {
    const response = await fetch('/api/demo-credentials', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch latest demo credentials. Please try again.');
    }

    const payload = extractCredentialsPayload(await response.json());

    if (!payload?.username || !payload.password) {
      throw new Error('Demo credentials response is incomplete. Please try again.');
    }

    return {
      username: payload.username,
      password: payload.password,
      updatedAt: payload.updatedAt,
    };
  }
}

export function createDemoCredentialsProvider(): DemoCredentialsProvider {
  if (FeatureFlags.DEMO_CREDENTIALS_SOURCE === 'api') {
    return new ApiDemoCredentialsProvider();
  }

  return new HardcodedDemoCredentialsProvider();
}

export function formatDemoCredentialsForDisplay(credentials: DemoCredentials): string {
  if (credentials.username === credentials.password) {
    return credentials.username;
  }

  return `username: ${credentials.username} • password: ${credentials.password}`;
}
