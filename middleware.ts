import axios from 'axios';
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
      await axios.post(
        `${request.nextUrl.origin}/api/auth/verify`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

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
