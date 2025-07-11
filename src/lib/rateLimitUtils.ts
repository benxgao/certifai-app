import { ExamListItem } from '@/src/swr/exams';

// Interface for rate limit information extracted from exam responses
export interface RateLimitInfo {
  maxExamsAllowed: number;
  currentCount: number;
  remainingCount: number;
  canCreateExam: boolean;
  resetTime: string;
  nextAvailableTime?: string;
  hoursUntilNextExam?: number;
  error?: string;
}

/**
 * Extract rate limit information from enhanced exam response
 * This allows us to reuse data that's already fetched instead of making separate API calls
 *
 * @param rateLimit - Rate limit data from exam API response
 * @returns Normalized rate limit information
 */
export function extractRateLimitFromResponse(rateLimit: any): RateLimitInfo | null {
  if (!rateLimit) return null;

  const rateLimitInfo: RateLimitInfo = {
    maxExamsAllowed: rateLimit.maxExamsAllowed || 3,
    currentCount: rateLimit.currentCount || 0,
    remainingCount: rateLimit.remainingCount || 3,
    canCreateExam: rateLimit.canCreateExam ?? true,
    resetTime: rateLimit.resetTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    error: rateLimit.error,
  };

  // Add detailed time information if available
  if (rateLimit.nextAvailableTime) {
    rateLimitInfo.nextAvailableTime = rateLimit.nextAvailableTime;
  }

  if (rateLimit.hoursUntilNextExam) {
    rateLimitInfo.hoursUntilNextExam = rateLimit.hoursUntilNextExam;
  }

  return rateLimitInfo;
}

/**
 * Calculate rate limit information directly from exam data (client-side fallback)
 * This can be used when the API doesn't include rate limit info in the response
 *
 * @param exams - Array of exam data
 * @returns Calculated rate limit information
 */
export function calculateRateLimitFromExams(exams: ExamListItem[]): RateLimitInfo {
  const MAX_EXAMS_PER_24_HOURS = 3;

  // Calculate 24 hours ago from now
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  // Filter exams created in the last 24 hours
  const recentExams = exams.filter((exam) => {
    const startedAt = new Date(exam.started_at);
    return startedAt >= twentyFourHoursAgo;
  });

  const currentCount = recentExams.length;
  const remainingCount = Math.max(0, MAX_EXAMS_PER_24_HOURS - currentCount);
  const canCreateExam = currentCount < MAX_EXAMS_PER_24_HOURS;

  // Calculate reset time: 24 hours from the oldest exam in the window
  let resetTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  if (recentExams.length > 0) {
    // Sort by started_at to find the oldest exam
    const sortedExams = recentExams.sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime(),
    );
    const oldestExam = sortedExams[0];

    // Reset time is 24 hours after the oldest exam
    const resetTimeMs = new Date(oldestExam.started_at).getTime() + 24 * 60 * 60 * 1000;
    resetTime = new Date(resetTimeMs).toISOString();
  }

  const rateLimitInfo: RateLimitInfo = {
    maxExamsAllowed: MAX_EXAMS_PER_24_HOURS,
    currentCount,
    remainingCount,
    canCreateExam,
    resetTime,
  };

  // Add time calculations if rate limit is exceeded
  if (!canCreateExam && recentExams.length > 0) {
    const resetTimeMs = new Date(resetTime).getTime();
    const now = Date.now();
    const timeUntilReset = resetTimeMs - now;

    if (timeUntilReset > 0) {
      rateLimitInfo.nextAvailableTime = resetTime;
      rateLimitInfo.hoursUntilNextExam = Math.ceil(timeUntilReset / (1000 * 60 * 60));
    }
  }

  if (!canCreateExam) {
    rateLimitInfo.error = `Rate limit exceeded. You can create a maximum of ${MAX_EXAMS_PER_24_HOURS} exams per 24 hours. Please try again later.`;
  }

  return rateLimitInfo;
}

/**
 * Get rate limit information with automatic fallback
 * First tries to extract from API response, then calculates from exam data
 *
 * @param rateLimit - Rate limit data from API response (optional)
 * @param exams - Array of exam data for fallback calculation
 * @returns Rate limit information
 */
export function getRateLimitInfo(rateLimit?: any, exams?: ExamListItem[]): RateLimitInfo | null {
  // Try to extract from API response first
  const extractedRateLimit = extractRateLimitFromResponse(rateLimit);
  if (extractedRateLimit) {
    return extractedRateLimit;
  }

  // Fallback to calculation from exam data
  if (exams && exams.length >= 0) {
    return calculateRateLimitFromExams(exams);
  }

  return null;
}
