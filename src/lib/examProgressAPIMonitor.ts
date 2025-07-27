/**
 * Utility functions for monitoring exam generation progress API usage
 * Helps track optimization effectiveness and debug issues
 */

interface ProgressAPIMetrics {
  totalCalls: number;
  generatingCalls: number;
  preventedCalls: number;
  errorCalls: number;
  lastCall: Date | null;
}

class ExamProgressAPIMonitor {
  private static metrics: ProgressAPIMetrics = {
    totalCalls: 0,
    generatingCalls: 0,
    preventedCalls: 0,
    errorCalls: 0,
    lastCall: null,
  };

  /**
   * Track when a progress API call would have been made
   * @param examId - The exam identifier
   * @param examStatus - Current exam status
   * @param wasCalled - Whether the API call was actually made
   */
  static trackCall(examId: string, examStatus: string, wasCalled: boolean) {
    this.metrics.totalCalls++;
    this.metrics.lastCall = new Date();

    if (wasCalled) {
      this.metrics.generatingCalls++;
      console.log(`[ProgressAPI] ✅ Called for ${examId} (status: ${examStatus})`);
    } else {
      this.metrics.preventedCalls++;
      console.log(`[ProgressAPI] 🚫 Prevented for ${examId} (status: ${examStatus})`);
    }
  }

  /**
   * Track API errors
   * @param examId - The exam identifier
   * @param error - Error details
   */
  static trackError(examId: string, error: any) {
    this.metrics.errorCalls++;
    console.warn(`[ProgressAPI] ❌ Error for ${examId}:`, error);
  }

  /**
   * Get current metrics
   */
  static getMetrics(): ProgressAPIMetrics & { preventionRate: number } {
    const preventionRate = this.metrics.totalCalls > 0 
      ? (this.metrics.preventedCalls / this.metrics.totalCalls) * 100 
      : 0;

    return {
      ...this.metrics,
      preventionRate: Math.round(preventionRate * 100) / 100,
    };
  }

  /**
   * Log current metrics summary
   */
  static logSummary() {
    const metrics = this.getMetrics();
    console.log(`[ProgressAPI] Metrics Summary:`, {
      totalCalls: metrics.totalCalls,
      generatingCalls: metrics.generatingCalls,
      preventedCalls: metrics.preventedCalls,
      preventionRate: `${metrics.preventionRate}%`,
      errorRate: metrics.totalCalls > 0 ? `${(metrics.errorCalls / metrics.totalCalls * 100).toFixed(2)}%` : '0%',
      lastCall: metrics.lastCall?.toISOString(),
    });
  }

  /**
   * Reset metrics (useful for testing)
   */
  static reset() {
    this.metrics = {
      totalCalls: 0,
      generatingCalls: 0,
      preventedCalls: 0,
      errorCalls: 0,
      lastCall: null,
    };
  }
}

export default ExamProgressAPIMonitor;
