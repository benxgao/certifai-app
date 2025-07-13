import { NextResponse } from 'next/server';
import { clearTokenCache } from '@/src/lib/service-only';

/**
 * Clear server-side token cache endpoint
 * This helps resolve stuck loading states caused by cached authentication tokens
 */
export async function POST() {
  try {
    // Clear the server-side token cache
    clearTokenCache();

    console.log('Server-side token cache cleared successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Token cache cleared successfully' 
    });
  } catch (error) {
    console.error('Failed to clear token cache:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear cache',
        message: 'An error occurred while clearing the token cache'
      },
      { status: 500 }
    );
  }
}
