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
