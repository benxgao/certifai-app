# Public Certifications Marketing Page Setup

This document explains how to set up the certifications marketing page to work with the public JWT-protected API routes.

## Overview

The certifications marketing page (`/certifications`) is now completely public and does not require Firebase authentication. It uses server-side JWT tokens to access public API endpoints, allowing any visitor to browse the certification catalog.

## Environment Variables

### Required Variables

Create a `.env.local` file in the app root with these variables:

```bash
# API Configuration
NEXT_PUBLIC_SERVER_API_URL=https://your-api-domain.com
SERVICE_SECRET=your-service-secret-here-minimum-32-characters

# Firebase Configuration (still needed for other parts of the app)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Variable Descriptions

- **NEXT_PUBLIC_SERVER_API_URL**: The base URL of your API server
- **SERVICE_SECRET**: A secret key used to authenticate with the service token endpoint (must match the API's SERVICE_SECRET)
- **Firebase variables**: Still needed for authenticated parts of the app, but not used by the marketing page

## API Requirements

Ensure your API server has the following:

1. **Service Token Endpoint**: `/api/auth/generate-service-token`

   - Accepts `x-service-secret` header
   - Returns JWT tokens for public API access

2. **Public API Endpoints**:

   - `/api/public/firms` - Get firms with certification counts
   - `/api/public/certifications` - Get all certifications
   - Both protected by JWT middleware

3. **Environment Variables** (API server):
   ```bash
   SERVICE_SECRET=same-secret-as-app
   PUBLIC_JWT_SECRET=your-jwt-signing-secret
   ```

## How It Works

1. **Server-Side Token Generation**: When the page loads, the server generates a JWT token using the service secret
2. **API Calls**: The server makes authenticated requests to public API endpoints
3. **Data Rendering**: Data is passed to the client component for rendering
4. **Caching**: API responses are cached for 1 hour for better performance
5. **Fallback**: If API calls fail, mock data is shown to ensure the page always loads

## Benefits

- **Public Access**: No authentication required for visitors
- **SEO Friendly**: Server-side rendering with real data
- **Performance**: Cached API responses and optimized loading
- **Reliability**: Graceful fallback to mock data if API is unavailable
- **Security**: JWT-protected API endpoints prevent abuse

## Testing

1. Ensure environment variables are set correctly
2. Visit `/certifications` without being logged in
3. Verify that firm and certification data loads
4. Check browser network tab to confirm no Firebase auth calls

## Troubleshooting

- **No data loading**: Check SERVICE_SECRET matches between app and API
- **API errors**: Verify NEXT_PUBLIC_SERVER_API_URL is correct
- **Token generation fails**: Ensure SERVICE_SECRET is at least 32 characters
- **Mock data showing**: API endpoints may be down or misconfigured
