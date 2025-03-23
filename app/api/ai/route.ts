import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log(`request: ${JSON.stringify(request)}`);

  // ...existing code...
  return NextResponse.json({ message: 'GET request success' });
  // ...existing code...
}

export async function POST(request: Request) {
  // ...existing code...
  try {
    const body = await request.json();
    // Process the POST request data as needed
    return NextResponse.json({ message: 'POST request success', data: { body: body || '' } });
  } catch (error) {
    return NextResponse.json({ error: `error: ${error}` }, { status: 400 });
  }
  // ...existing code...
}
