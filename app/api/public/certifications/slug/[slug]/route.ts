import { NextRequest } from 'next/server';
import {
  getJWTToken,
  makeJWTAuthenticatedRequest,
  handleApiResponse,
  createErrorResponse,
  buildApiUrl,
} from '@/src/lib/api-utils';

const CERTIFICATIONS_API_URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications`;

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const jwtToken = await getJWTToken();
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug || typeof slug !== 'string') {
      return createErrorResponse(new Error('Invalid slug parameter'), 'validating slug');
    }

    // Validate slug format (should be lowercase letters, numbers, and hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return createErrorResponse(new Error('Invalid slug format'), 'validating slug');
    }

    const response = await makeJWTAuthenticatedRequest(`${CERTIFICATIONS_API_URL}/slug/${slug}`, {
      method: 'GET',
      jwtToken,
    });

    return handleApiResponse(response, 'fetch certification by slug');
  } catch (error) {
    return createErrorResponse(error as Error, 'fetching certification by slug');
  }
}
