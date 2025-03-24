import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Get the token from the cookie
    const authToken = request.cookies.get('authToken')?.value;

    console.log(`middleware authToken: ${authToken}`);

    if (!authToken) {
      throw new Error('No authToken cookie');
    }

    // For protected routes, verify the token through an API route
    try {
      //   const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      //     headers: {
      //       Authorization: `Bearer ${authToken}`,
      //     },
      //   });

      //   if (!response.ok) {
      //     throw new Error('Invalid token');
      //   }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  } catch (error) {
    // Redirect to login if there's no valid session
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

// Add the paths that should be protected
export const config = {
  matcher: ['/main/:path*', '/dashboard/:path*'],
};
