import { NextResponse } from 'next/server';

export async function GET() {
  // Chrome DevTools JSON endpoint
  // This endpoint is used by Chrome's DevTools for debugging capabilities
  const devToolsConfig = {
    webSocketDebuggerUrl: '',
    devtoolsFrontendUrl: '',
    description: 'Next.js Application',
    title: 'Certestic App',
    type: 'page',
    url: 'http://localhost:3000',
    // Add basic debugging info but don't expose sensitive details
    metadata: {
      framework: 'Next.js',
      version: '15.3.4',
    },
  };

  return NextResponse.json(devToolsConfig, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
