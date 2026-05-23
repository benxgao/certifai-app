import React, { useEffect } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SWRConfig } from 'swr';
import { useExamReport } from '@/src/swr/examReport';
import { useCertSummary } from '@/src/swr/certSummary';
import { CertSummary } from '@/src/components/custom/CertSummary';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { SWRFetchError } from '@/src/swr/utils';
import { ExamReportData } from '@/src/types/swr-data/examReport';
import { CertSummaryData } from '@/src/types/swr-data/certSummary';

jest.mock('@/src/context/FirebaseAuthContext', () => ({
  useFirebaseAuth: jest.fn(),
}));

jest.mock('@/components/custom', () => ({
  LoadingComponents: {
    CardSkeleton: () => null,
  },
}));

type ExamHookSnapshot = {
  examReport: ExamReportData | undefined;
  isLoadingReport: boolean;
  reportError: Error | undefined;
};

type CertHookSnapshot = {
  certSummary: CertSummaryData | null | undefined;
  isLoading: boolean;
  error: Error | undefined;
  hasSummary: boolean;
};

const mockUseFirebaseAuth = useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>;

function createJsonResponse(payload: unknown, status: number): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status >= 500 ? 'Internal Server Error' : 'Bad Request',
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  } as Response;
}

function ExamHookHarness({
  onSnapshot,
}: {
  onSnapshot: (snapshot: ExamHookSnapshot) => void;
}) {
  const snapshot = useExamReport('exam-123', true);

  useEffect(() => {
    onSnapshot(snapshot);
  }, [snapshot, onSnapshot]);

  return null;
}

function CertHookHarness({
  onSnapshot,
}: {
  onSnapshot: (snapshot: CertHookSnapshot) => void;
}) {
  const snapshot = useCertSummary('api-user-1', '10');

  useEffect(() => {
    onSnapshot(snapshot);
  }, [snapshot, onSnapshot]);

  return null;
}

function wrapWithIsolatedSWR(node: React.ReactNode) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
      }}
    >
      {node}
    </SWRConfig>
  );
}

describe('exam/cert error contract regression', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    originalFetch = global.fetch;

    mockUseFirebaseAuth.mockReturnValue({
      firebaseUser: { uid: 'firebase-uid-1' } as never,
      apiUserId: 'api-user-1',
    } as unknown as ReturnType<typeof useFirebaseAuth>);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    global.fetch = originalFetch;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('does not retry cert summary fetch on 400 INSUFFICIENT_EXAM_REPORTS and preserves error_code', async () => {
    jest.useFakeTimers();

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(
        createJsonResponse(
          {
            success: false,
            error: 'Not enough exam reports',
            error_code: 'INSUFFICIENT_EXAM_REPORTS',
            retriable: false,
            details: {
              required_reports: 2,
              available_reports: 1,
            },
          },
          400,
        ),
      ),
    ) as jest.Mock;

    let latestSnapshot: CertHookSnapshot = {
      certSummary: undefined,
      isLoading: true,
      error: undefined,
      hasSummary: false,
    };

    await act(async () => {
      root.render(
        wrapWithIsolatedSWR(
          <CertHookHarness
            onSnapshot={(snapshot) => {
              latestSnapshot = snapshot;
            }}
          />,
        ),
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(latestSnapshot.error).toBeInstanceOf(SWRFetchError);

    const swrError = latestSnapshot.error as SWRFetchError;
    expect((swrError.info as { error_code?: string }).error_code).toBe('INSUFFICIENT_EXAM_REPORTS');
  });

  it('attempts bounded retries on retriable 500 exam report errors', async () => {
    jest.useFakeTimers();

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(
        createJsonResponse(
          {
            success: false,
            error: 'Temporary generation issue',
            error_code: 'REPORT_GENERATION_TRANSIENT',
            retriable: true,
          },
          500,
        ),
      ),
    ) as jest.Mock;

    await act(async () => {
      root.render(
        wrapWithIsolatedSWR(
          <ExamHookHarness
            onSnapshot={() => {
              // no-op
            }}
          />,
        ),
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    for (let i = 0; i < 3; i += 1) {
      await act(async () => {
        jest.advanceTimersByTime(1100);
        await Promise.resolve();
      });
    }

    const calls = (global.fetch as jest.Mock).mock.calls.length;
    expect(calls).toBeGreaterThan(1);
    expect(calls).toBeLessThanOrEqual(4);
  });

  it('returns success payload data directly without double-unwrapping in exam report hook', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(
        createJsonResponse(
          {
            success: true,
            data: {
              exam_id: 'exam-123',
              report: 'Great progress.',
              already_existed: false,
              generated_at: '2026-05-23T00:00:00.000Z',
              performance_summary: {
                overall_score: 88,
                total_questions: 50,
                correct_answers: 44,
              },
            },
          },
          200,
        ),
      ),
    ) as jest.Mock;

    let latestSnapshot: ExamHookSnapshot = {
      examReport: undefined,
      isLoadingReport: true,
      reportError: undefined,
    };

    await act(async () => {
      root.render(
        wrapWithIsolatedSWR(
          <ExamHookHarness
            onSnapshot={(snapshot) => {
              latestSnapshot = snapshot;
            }}
          />,
        ),
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    for (let i = 0; i < 5 && !latestSnapshot.examReport; i += 1) {
      await act(async () => {
        await Promise.resolve();
      });
    }

    expect(latestSnapshot.examReport?.exam_id).toBe('exam-123');
    expect((latestSnapshot.examReport as ExamReportData & { data?: unknown })?.data).toBeUndefined();
  });

  it('renders actionable cert summary message from INSUFFICIENT_EXAM_REPORTS details', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(
        createJsonResponse(
          {
            success: false,
            error: 'Not enough reports',
            error_code: 'INSUFFICIENT_EXAM_REPORTS',
            retriable: false,
            details: {
              required_reports: 2,
              available_reports: 1,
            },
          },
          400,
        ),
      ),
    ) as jest.Mock;

    await act(async () => {
      root.render(
        wrapWithIsolatedSWR(<CertSummary userId="api-user-1" certId="10" examCount={3} />),
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    for (let i = 0; i < 5; i += 1) {
      await act(async () => {
        await Promise.resolve();
      });
    }

    expect(container.textContent).toContain('More Exam Reports Needed');
    expect(container.textContent).toContain(
      'Complete 1 more exam report to unlock your AI Learning Journey.',
    );
  });
});
