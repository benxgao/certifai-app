import { NextRequest, NextResponse } from 'next/server';
import { serverFetchWithAuth } from '@/src/stripe/server';

/**
 * Frontend API route to get unified account data
 * Calls the backend unified account endpoint
 */
export async function GET(req: NextRequest) {
  try {
    const response = await serverFetchWithAuth('/stripe/account');

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      // If account not found (404), try to create a default Firestore account via backend
      if (response.status === 404) {
        console.log('Account not found, attempting to create default Firestore account...');

        try {
          // We need to get the user info from the Firebase token to create the account
          // The serverFetchWithAuth will handle the token, but we need to extract user info
          // Let's call a backend endpoint that can extract this info from the token
          const ensureResponse = await serverFetchWithAuth('/api/users/ensure-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // The backend will extract user info from the token
          });

          if (ensureResponse.ok) {
            console.log('Default Firestore account created successfully');

            // Wait a brief moment for the account to be fully created
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Retry the original request after creating the account
            const retryResponse = await serverFetchWithAuth('/stripe/account');

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              return NextResponse.json(retryData);
            } else {
              // Still failing after account creation attempt
              const retryErrorText = await retryResponse.text();
              console.error('Account fetch still failing after account creation:', retryErrorText);

              return NextResponse.json(
                {
                  success: false,
                  error: 'Account created but fetch still failing',
                  details: retryErrorText,
                },
                { status: retryResponse.status },
              );
            }
          } else {
            // Account creation failed
            const ensureErrorText = await ensureResponse.text();
            console.error('Failed to create default Firestore account:', ensureErrorText);

            return NextResponse.json(
              {
                success: false,
                error: 'Account not found and could not create default account',
                details: ensureErrorText,
              },
              { status: 404 },
            );
          }
        } catch (ensureError) {
          console.error('Error during account creation attempt:', ensureError);

          return NextResponse.json(
            {
              success: false,
              error: 'Account not found and account creation failed',
              details: ensureError instanceof Error ? ensureError.message : 'Unknown error',
            },
            { status: 404 },
          );
        }
      }

      // For other errors (not 404), return the original error
      console.error('Backend API error:', response.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: errorData.error || `Backend API error: ${response.status}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format from backend');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format from backend',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Account data API error:', error);

    // Provide more specific error responses
    if (error.message?.includes('No authentication token')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          requiresReauth: true,
        },
        { status: 401 },
      );
    }

    if (error.message?.includes('Request timed out')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request timeout - please try again',
        },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch account data',
      },
      { status: error.status || 500 },
    );
  }
}
