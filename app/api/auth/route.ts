import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET;

export async function POST(request: Request) {
  if (!secretKey) {
    return new Response('JWT secret not configured', { status: 500 });
  }

  const body = await request.json();

  const token = (body as any).token;

  if (!token) {
    return new Response('User ID required', { status: 400 });
  }

  try {
    const signedToken = await new SignJWT({ token: token })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(secretKey));

    (await cookies()).set('authToken', signedToken, {
      httpOnly: true, // Crucial for security
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Prevent CSRF attacks
      path: '/', // Cookie path
    });

    // return Response.json({ token: token });
    return Response.json({ success: true });
  } catch (error) {
    console.error('JWT generation error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
