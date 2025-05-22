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

  // this is the token containing {token, exp, iat}
  const joseToken = authorization.replace('Bearer ', '');
  const { token, exp } = jose.decodeJwt(joseToken);
  const firebaseToken = token as string; // this is the token containing the firebase info
  const expiredAt = exp || 0;

  if (expiredAt < Date.now() / 1000) {
    console.error('Token expired:', { expiredAt, currentTime: Date.now() / 1000 });
    throw { message: 'Token expired', status: 401 } as TokenValidationError;
  }

  const { valid } = await verifyToken(firebaseToken);

  if (!valid) {
    throw { message: 'Invalid token', status: 401 } as TokenValidationError;
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
