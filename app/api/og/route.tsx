import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Certestic - AI-Powered IT Certification Training';
  const description =
    searchParams.get('description') ||
    'Master IT certifications with AI-powered practice questions';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#6366f1',
          backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 40,
            margin: 40,
            maxWidth: '80%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#6b7280',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 30,
              fontSize: 20,
              color: '#6366f1',
              fontWeight: 600,
            }}
          >
            🚀 Powered by AI • certestic.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
