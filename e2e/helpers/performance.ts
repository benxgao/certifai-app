import type { Page } from '@playwright/test';

export type TimingRecordCategory = 'page' | 'content' | 'action' | 'system' | 'polling';
export type TimingRecordStatus = 'passed' | 'failed';

export interface TimingRecord {
  name: string;
  category: TimingRecordCategory;
  durationMs: number;
  startedAt: string;
  endedAt: string;
  status: TimingRecordStatus;
  details?: string;
}

export interface PagePerformanceSnapshot {
  label: string;
  url: string;
  capturedAt: string;
  responseStartMs: number | null;
  domContentLoadedMs: number | null;
  loadMs: number | null;
  firstPaintMs: number | null;
  firstContentfulPaintMs: number | null;
}

export interface FlowTimingReport {
  flowName: string;
  totalDurationMs: number;
  generatedAt: string;
  records: TimingRecord[];
  pageMetrics: PagePerformanceSnapshot[];
}

type TrackStepOptions = {
  category?: TimingRecordCategory;
  details?: string;
};

type RecordDurationOptions = {
  category?: TimingRecordCategory;
  details?: string;
  status?: TimingRecordStatus;
  startedAt?: number;
};

function roundDuration(durationMs: number): number {
  return Math.max(0, Math.round(durationMs));
}

export function formatDuration(durationMs: number): string {
  if (durationMs >= 60_000) {
    return `${(durationMs / 60_000).toFixed(2)}m`;
  }

  if (durationMs >= 1_000) {
    return `${(durationMs / 1_000).toFixed(2)}s`;
  }

  return `${roundDuration(durationMs)}ms`;
}

export class FlowTimingTracker {
  private readonly flowStartedAt = Date.now();
  private readonly records: TimingRecord[] = [];
  private readonly pageMetrics: PagePerformanceSnapshot[] = [];

  constructor(private readonly flowName: string) {}

  async trackStep<T>(
    name: string,
    action: () => Promise<T>,
    options: TrackStepOptions = {},
  ): Promise<T> {
    const startedAt = Date.now();
    const { category = 'system', details } = options;

    try {
      const result = await action();
      this.recordDuration(name, Date.now() - startedAt, {
        category,
        details,
        status: 'passed',
        startedAt,
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.recordDuration(name, Date.now() - startedAt, {
        category,
        details: details ? `${details} | ${errorMessage}` : errorMessage,
        status: 'failed',
        startedAt,
      });
      throw error;
    }
  }

  recordDuration(
    name: string,
    durationMs: number,
    options: RecordDurationOptions = {},
  ): TimingRecord {
    const {
      category = 'system',
      details,
      status = 'passed',
      startedAt = Date.now() - durationMs,
    } = options;

    const normalizedDuration = roundDuration(durationMs);
    const normalizedStartedAt = new Date(startedAt).toISOString();
    const normalizedEndedAt = new Date(startedAt + normalizedDuration).toISOString();

    const record: TimingRecord = {
      name,
      category,
      durationMs: normalizedDuration,
      startedAt: normalizedStartedAt,
      endedAt: normalizedEndedAt,
      status,
      ...(details ? { details } : {}),
    };

    this.records.push(record);

    const detailSuffix = details ? ` — ${details}` : '';
    console.log(
      `  ⏱ ${name}: ${formatDuration(normalizedDuration)} [${category}/${status}]${detailSuffix}`,
    );

    return record;
  }

  async capturePageMetrics(page: Page, label: string): Promise<PagePerformanceSnapshot | null> {
    const metrics = await page
      .evaluate((pageLabel) => {
        const navigationEntry = performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming | undefined;

        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
        const firstContentfulPaint = paintEntries.find(
          (entry) => entry.name === 'first-contentful-paint',
        );

        const normalize = (value?: number) =>
          typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null;

        return {
          label: pageLabel,
          url: window.location.href,
          capturedAt: new Date().toISOString(),
          responseStartMs: normalize(navigationEntry?.responseStart),
          domContentLoadedMs: normalize(navigationEntry?.domContentLoadedEventEnd),
          loadMs: normalize(navigationEntry?.loadEventEnd),
          firstPaintMs: normalize(firstPaint?.startTime),
          firstContentfulPaintMs: normalize(firstContentfulPaint?.startTime),
        };
      }, label)
      .catch(() => null);

    if (!metrics) {
      console.log(`  ⚠ Unable to capture page metrics for ${label}`);
      return null;
    }

    this.pageMetrics.push(metrics);

    const metricParts = [
      `responseStart=${metrics.responseStartMs ?? 'n/a'}ms`,
      `domContentLoaded=${metrics.domContentLoadedMs ?? 'n/a'}ms`,
      `load=${metrics.loadMs ?? 'n/a'}ms`,
      `firstContentfulPaint=${metrics.firstContentfulPaintMs ?? 'n/a'}ms`,
    ];

    console.log(`  ⏱ Page metrics [${label}]: ${metricParts.join(', ')}`);

    return metrics;
  }

  buildReport(): FlowTimingReport {
    return {
      flowName: this.flowName,
      totalDurationMs: roundDuration(Date.now() - this.flowStartedAt),
      generatedAt: new Date().toISOString(),
      records: [...this.records],
      pageMetrics: [...this.pageMetrics],
    };
  }

  logSummary(): void {
    const report = this.buildReport();

    console.log(`\n================== TIMING SUMMARY: ${report.flowName} ==================`);

    if (report.records.length === 0) {
      console.log('  ⚠ No timing records captured');
    } else {
      report.records
        .slice()
        .sort((left, right) => right.durationMs - left.durationMs)
        .forEach((record, index) => {
          console.log(
            `  ${index + 1}. ${record.name} — ${formatDuration(record.durationMs)} [${record.category}/${record.status}]`,
          );
        });
    }

    if (report.pageMetrics.length > 0) {
      console.log('  --- Page metrics ---');
      report.pageMetrics.forEach((metric) => {
        console.log(
          `  • ${metric.label}: DCL=${metric.domContentLoadedMs ?? 'n/a'}ms, Load=${metric.loadMs ?? 'n/a'}ms, FCP=${metric.firstContentfulPaintMs ?? 'n/a'}ms`,
        );
      });
    }

    console.log(`  Total tracked flow time: ${formatDuration(report.totalDurationMs)}`);
    console.log('=================================================================');
  }
}
