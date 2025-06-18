import * as jose from 'jose';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { verifyToken } from '../../../../src/firebase/verifyTokenByAdmin';

interface TokenValidationError {
  message: string;
  status: number;
}

async function validateAndGetFirebaseToken(authorization: string | null): Promise<string> {
  if (!authorization?.startsWith('Bearer ')) {
    throw { message: 'Unauthorized', status: 400 } as TokenValidationError;
  }

  // this is the token containing {token, exp, iat, jti}
  const joseToken = authorization.replace('Bearer ', '');
  const decodedPayload = jose.decodeJwt(joseToken);
  const { token, exp, jti, iat } = decodedPayload;

  const firebaseToken = token as string; // this is the token containing the firebase info
  const expiredAt = exp || 0;
  const issuedAt = iat || 0;

  // Check if token has expired
  if (expiredAt < Date.now() / 1000) {
    console.error('Token expired:', { expiredAt, currentTime: Date.now() / 1000 });
    throw { message: 'Token expired', status: 401 } as TokenValidationError;
  }

  // Check if token has unique identifier (jti) - legacy tokens won't have this
  if (!jti) {
    console.error('Token missing unique identifier - legacy token detected');
    throw {
      message: 'Legacy token detected, please sign in again',
      status: 401,
    } as TokenValidationError;
  }

  // Check if token is too old (older than 24 hours should be refreshed for security)
  const tokenAge = Math.floor(Date.now() / 1000) - issuedAt;
  if (tokenAge > 24 * 60 * 60) {
    // 24 hours
    console.log('Token is older than 24 hours, requiring refresh');
    throw { message: 'Token too old, please refresh', status: 401 } as TokenValidationError;
  }

  // Verify the Firebase token is still valid
  const { valid } = await verifyToken(firebaseToken);

  if (!valid) {
    throw { message: 'Invalid Firebase token', status: 401 } as TokenValidationError;
  }

  return firebaseToken;
}

export async function POST() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    await validateAndGetFirebaseToken(authorization);

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    if (error.status && error.message) {
      // This is a TokenValidationError
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    // This is an unexpected internal server error
    console.error('/api/auth-cookie/verify:', {
      message: error.message,
      code: error.code,
      // stack: error.stack,
    });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
