import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '../../../src/config/constants';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function GET() {

  return Response.json({ message: 'GET request success' });
}

export async function POST() {
  const token = (await cookies()).get(COOKIE_AUTH_NAME)?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    if (!secretKey) throw new Error('JWT secret not configured');

    const { payload, protectedHeader } = await jwtVerify(
      token,
      new TextEncoder().encode(secretKey),
    );

    console.log(`protectedHeader: ${JSON.stringify(protectedHeader)}`);

    const data = { message: `Protected data for user ${payload.userId}` };

    return Response.json({ data });
  } catch (error) {
    console.error('JWT verification error:', error);

    return new Response('Unauthenticated', { status: 401 });
  }
}
