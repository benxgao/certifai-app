import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';

const secretKey = process.env.JOSE_JWT_SECRET;

export async function POST(request: Request) {
  if (!secretKey) {
    return new Response('JWT secret not configured', { status: 500 });
  }

  const body = await request.json();

  console.log(`auth-cookie/set:0
    | req_body: ${JSON.stringify(body)}`);

  const firebaseToken = (body as any).firebaseToken;

  if (!firebaseToken) {
    return new Response('User ID required', { status: 400 });
  }

  try {
    const joseToken = await new SignJWT({ token: firebaseToken })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(secretKey));

    console.log(`auth-cookie/set:1
      | joseToken: ${joseToken}`);

    // const cookieString = serialize('authToken', signedToken, {
    //   httpOnly: true, // Crucial for security
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict', // Prevent CSRF attacks
    //   path: '/', // Cookie path
    // });

    (await cookies()).set(COOKIE_AUTH_NAME, joseToken, {
      httpOnly: true, // Crucial for security
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'strict', // Prevent CSRF attacks
      path: '/', // Cookie path
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('auth-cookie/set: error:', error);
    return new Response('auth-cookie/set: error', { status: 500 });
  }
}
