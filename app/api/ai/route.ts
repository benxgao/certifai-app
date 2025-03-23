import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET;

export async function GET(request: Request) {
  console.log(`request: ${JSON.stringify(request)}`);

  return NextResponse.json({ message: 'GET request success' });
}

export async function POST() {
  const token = (await cookies()).get('authToken')?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  // const authHeader = request.headers.get('Authorization');

  // if (!authHeader) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  // const token = authHeader.split(' ')[1];

  try {
    if (!secretKey) throw new Error('JWT secret not configured');

    const { payload, protectedHeader } = await jwtVerify(
      token,
      new TextEncoder().encode(secretKey),
    );

    console.log(`protectedHeader: ${JSON.stringify(protectedHeader)}`);

    const data = { message: `Protected data for user ${payload.userId}` };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('JWT verification error:', error);

    return new Response('Unauthenticated', { status: 401 });
  }
}
