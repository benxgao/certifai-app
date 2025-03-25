import * as jose from 'jose';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { verifyToken } from '../../../../firebase/verifyTokenByAdmin';

export async function POST() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 400 });
    }

    const token = authorization.replace('Bearer ', '');
    const firebaseToken = jose.decodeJwt(token).token;

    console.log(`firebaseToken pass in verifyToken(): ${firebaseToken}`);

    const { valid } = await verifyToken(firebaseToken as string);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('/api/auth/verify:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
