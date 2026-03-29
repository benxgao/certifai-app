/**
 * Converts raw error messages (including JSON) to human-readable text
 * @param error Error object or string
 * @returns Human-readable error message
 */
export function parseErrorMessage(error: Error | string | any): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  // If it's a string, try to parse as JSON
  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error);
      return parsed.error || parsed.message || error;
    } catch {
      // Not JSON, return as is
      return error;
    }
  }

  // If it's an Error object, check the message
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      return parsed.error || parsed.message || error.message;
    } catch {
      // Not JSON, return the message
      return error.message;
    }
  }

  // If it's an object with error or message property
  if (typeof error === 'object') {
    return error.error || error.message || 'An unknown error occurred';
  }

  return String(error);
}
