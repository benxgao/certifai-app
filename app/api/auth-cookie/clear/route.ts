import { NextResponse } from 'next/server';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie with the correct name
  response.cookies.delete(COOKIE_AUTH_NAME);

  // Also clear legacy cookie name if it exists
  response.cookies.delete('joseToken');

  // Add additional cookie clearing options to handle browser caching
  response.cookies.set(COOKIE_AUTH_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Expire immediately
  });

  response.cookies.set('joseToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}
