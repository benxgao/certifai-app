import { NextResponse } from 'next/server';
import { COOKIE_AUTH_NAME } from '../../../../src/config/constants';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie with the correct name
  response.cookies.delete(COOKIE_AUTH_NAME);

  // Also clear legacy cookie name if it exists
  response.cookies.delete('joseToken');

  return response;
}
