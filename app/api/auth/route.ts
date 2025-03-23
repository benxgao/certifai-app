// app/api/auth/route.ts (API Route for JWT generation)

import { SignJWT } from 'jose';

const secretKey = process.env.JWT_SECRET; // Store securely!

export async function POST(request: Request) {
  if (!secretKey) {
    return new Response('JWT secret not configured', { status: 500 });
  }

  const body = await request.json();
  const userId = body.userId; // Example: get user ID from request

  if (!userId) {
    return new Response('User ID required', { status: 400 });
  }

  try {
    const token = await new SignJWT({ userId: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(new TextEncoder().encode(secretKey));

    return Response.json({ token: token });
  } catch (error) {
    console.error('JWT generation error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
