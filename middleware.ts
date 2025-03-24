import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Get the token from the cookie
    const session = request.cookies.get('authToken')?.value;
    if (!session) {
      throw new Error('No session cookie');
    }

    // // Verify the session using our API endpoint
    // const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-session`, {
    //   headers: {
    //     cookie: `authToken=${session}`,
    //   },
    // });

    // if (!verifyResponse.ok) {
    //   throw new Error('Invalid session');
    // }

    // const decodedClaims = await verifyResponse.json();

    // Add the user info to headers for server components
    const response = NextResponse.next();
    // response.headers.set('user', JSON.stringify(decodedClaims));

    return response;
  } catch (error) {
    // Redirect to login if there's no valid session
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

// Add the paths that should be protected
export const config = {
  matcher: ['/main/:path*', '/dashboard/:path*'],
};
