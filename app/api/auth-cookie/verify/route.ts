import * as jose from 'jose';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { verifyToken } from '../../../../src/firebase/verifyTokenByAdmin';

export async function POST() {
  try {
    console.log(`/api/auth/verify: init
      | headers: ${JSON.stringify(headers())}`);

    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 400 });
    }

    // this is the token containing {token, exp, iat}
    const joseToken = authorization.replace('Bearer ', '');
    const { token, exp } = jose.decodeJwt(joseToken);
    const firebaseToken = token; // this is the token containing the firebase info
    const expiredAt = exp || 0;

    if (expiredAt < Date.now() / 1000) {
      console.error('Token expired:', { expiredAt, currentTime: Date.now() / 1000 });
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    // console.log(`firebaseToken pass in verifyToken(): ${firebaseToken}`);

    const { valid } = await verifyToken(firebaseToken as string);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error('/api/auth/verify:', {
      message: error.message,
      code: error.code,
      // stack: error.stack,
    });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
