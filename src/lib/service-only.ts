import 'server-only';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '@/src/config/constants';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function getFirebaseTokenFromCookie(): Promise<string | undefined> {
  const cookieToken = (await cookies()).get(COOKIE_AUTH_NAME)?.value;

  if (!cookieToken) {
    console.error('api/certifications: Auth cookie not found');
    return undefined;
  }

  try {
    // payload = {token, iat, exp}
    const { payload } = await jwtVerify(cookieToken, new TextEncoder().encode(secretKey));
    return payload.token as string;
  } catch (error) {
    console.error(`api/certifications: JWT verification failed: ${error}`);
    return undefined;
  }
}
