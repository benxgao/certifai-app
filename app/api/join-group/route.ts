import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAdminSDK } from '@/src/firebase/firebaseAdminConfig';

/**
 * Join Group API Route
 *
 * Allows authenticated users to join groups via the certifai-aws backend.
 * Uses existing Firebase Admin SDK and marketing API credentials.
 *
 * Reuses environment variables:
 * - GOOGLE_APPLICATION_CREDENTIALS: Firebase Admin authentication
 * - MARKETING_API_URL: Backend API endpoint (shared with certifai-aws)
 * - MARKETING_API_JWT_SECRET: JWT authentication for backend
 */

interface JoinGroupRequest {
  groupName: string;
  selectedCertifications: string[];
  customInterests?: string;
  subscriberId?: string;
}

interface JoinGroupRequestToCertifaiAws {
  groupName: string;
  subscriberId?: string;
  metadata?: {
    certificationInterests?: string;
    additionalInterests?: string;
    timestamp?: string;
  };
}

interface CertifaiAwsResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
  groupId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: JoinGroupRequest = await request.json();
    const { groupName, selectedCertifications, customInterests, subscriberId } = body;

    // Validate required fields
    if (!groupName) {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 },
      );
    }

    if (!selectedCertifications || selectedCertifications.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one certification area must be selected' },
        { status: 400 },
      );
    }

    // Get the Firebase auth token from the request headers
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Extract Firebase ID token and get user email
    const firebaseToken = authorization.replace('Bearer ', '');

    // Verify Firebase token and get user info
    const { auth } = getAdminSDK();
    let userEmail: string;

    try {
      const decodedToken = await auth.verifyIdToken(firebaseToken);
      userEmail = decodedToken.email!;
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 },
      );
    }

    // Generate JWT token for API authentication using existing secret
    const jwtSecret = process.env.MARKETING_API_JWT_SECRET;
    if (!jwtSecret) {
      console.error('MARKETING_API_JWT_SECRET not configured');
      return NextResponse.json(
        { success: false, error: 'Service configuration error' },
        { status: 500 },
      );
    }

    // Generate JWT token for certifai-aws
    const { SignJWT } = await import('jose');
    const secret = new TextEncoder().encode(jwtSecret);

    const jwtToken = await new SignJWT({ email: userEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    // Use existing marketing API URL for certifai-aws (they should be the same backend)
    const apiUrl = process.env.MARKETING_API_URL;
    if (!apiUrl) {
      console.error('MARKETING_API_URL not configured');
      return NextResponse.json(
        { success: false, error: 'Service configuration error' },
        { status: 500 },
      );
    }

    // Call certifai-aws join-group endpoint
    const requestPayload: JoinGroupRequestToCertifaiAws = {
      groupName: groupName,
    };

    // Add subscriberId if provided
    if (subscriberId) {
      requestPayload.subscriberId = subscriberId;
    }

    // Add metadata if certifications or interests are provided
    if (selectedCertifications.length > 0 || customInterests) {
      requestPayload.metadata = {
        certificationInterests: selectedCertifications.join(', '),
        additionalInterests: customInterests || '',
        timestamp: new Date().toISOString(),
      };
    }

    const response = await fetch(`${apiUrl}/join-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('certifai-aws API error:', response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'User or group not found. Please ensure you have an account first.',
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to join group. Please try again later.' },
        { status: 500 },
      );
    }

    const result: CertifaiAwsResponse = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully joined the adaptive learning group!',
        data: {
          groupName,
          certificationInterests: selectedCertifications,
          additionalInterests: customInterests,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message || 'Failed to join group' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('API error in join-group:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
