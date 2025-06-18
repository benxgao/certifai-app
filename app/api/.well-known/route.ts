import { NextResponse } from 'next/server';

export async function GET() {
  // This endpoint is used by Chrome DevTools for debugging
  // Return a simple JSON response to prevent errors
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Chrome DevTools endpoint',
    },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache',
      },
    },
  );
}

export async function OPTIONS() {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
