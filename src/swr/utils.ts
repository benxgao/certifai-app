export interface PaginationInfo {
  currentPage: number; // 1
  pageSize: number; // 10
  totalItems: number; // 20
  totalPages: number; // 2
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    try {
      (error as any).info = await res.json();
    } catch (e) {
      // If response is not JSON, use text
      (e as any).info = await res.text();
    }
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

// Utility function to refresh auth cookie on the server-side
export const refreshAuthCookie = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/auth-cookie/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      console.log('Auth cookie refreshed successfully');
      return true;
    } else {
      console.error('Failed to refresh auth cookie:', res.status);
      return false;
    }
  } catch (error) {
    console.error('Error refreshing auth cookie:', error);
    return false;
  }
};

// Enhanced fetcher that handles token refresh on 401 errors
export const fetcherWithAuth = async (
  url: string,
  refreshTokenFn?: () => Promise<string | null>,
) => {
  let res = await fetch(url);

  // If we get a 401 and have a refresh function, try to refresh token and retry
  if (res.status === 401 && refreshTokenFn) {
    console.log('Token expired, attempting refresh...');
    const newToken = await refreshTokenFn();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      res = await fetch(url);
    } else {
      // If Firebase token refresh failed, try cookie-based refresh as fallback
      const cookieRefreshSuccess = await refreshAuthCookie();
      if (cookieRefreshSuccess) {
        res = await fetch(url);
      }
    }
  }

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    try {
      (error as any).info = await res.json();
    } catch (e) {
      (e as any).info = await res.text();
    }
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};
