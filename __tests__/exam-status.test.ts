/**
 * Unit tests for src/types/exam-status.ts
 *
 * Covers:
 * - Type guard helpers
 * - Transition helpers
 * - getDerivedExamStatus branching
 * - getExamProgressBadgeStatus branching
 * - getExamStatusInfo label/color lookups
 */

import {
  BackendExamStatus,
  DerivedExamStatus,
  isExamGeneratingStatus,
  isExamReadyStatus,
  isExamGenerationFailedStatus,
  isExamPendingQuestionsStatus,
  isGenerationCompletedTransition,
  isGenerationFailedTransition,
  getDerivedExamStatus,
  getExamProgressBadgeStatus,
  getExamStatusInfo,
} from '@/src/types/exam-status';

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

describe('isExamGeneratingStatus', () => {
  it('returns true for QUESTIONS_GENERATING', () => {
    expect(isExamGeneratingStatus(BackendExamStatus.QUESTIONS_GENERATING)).toBe(true);
  });

  it('returns false for all other statuses', () => {
    const others = [
      BackendExamStatus.READY,
      BackendExamStatus.PENDING_QUESTIONS,
      BackendExamStatus.IN_PROGRESS,
      BackendExamStatus.COMPLETED,
      BackendExamStatus.QUESTION_GENERATION_FAILED,
    ];
    others.forEach((s) => expect(isExamGeneratingStatus(s)).toBe(false));
  });

  it('returns false for undefined/null', () => {
    expect(isExamGeneratingStatus(undefined)).toBe(false);
    expect(isExamGeneratingStatus(null)).toBe(false);
  });
});

describe('isExamReadyStatus', () => {
  it('returns true for READY', () => {
    expect(isExamReadyStatus(BackendExamStatus.READY)).toBe(true);
  });

  it('returns false for other statuses and undefined', () => {
    expect(isExamReadyStatus(BackendExamStatus.QUESTIONS_GENERATING)).toBe(false);
    expect(isExamReadyStatus(undefined)).toBe(false);
  });
});

describe('isExamGenerationFailedStatus', () => {
  it('returns true for QUESTION_GENERATION_FAILED', () => {
    expect(isExamGenerationFailedStatus(BackendExamStatus.QUESTION_GENERATION_FAILED)).toBe(true);
  });

  it('returns false for other statuses and undefined', () => {
    expect(isExamGenerationFailedStatus(BackendExamStatus.READY)).toBe(false);
    expect(isExamGenerationFailedStatus(null)).toBe(false);
  });
});

describe('isExamPendingQuestionsStatus', () => {
  it('returns true for PENDING_QUESTIONS', () => {
    expect(isExamPendingQuestionsStatus(BackendExamStatus.PENDING_QUESTIONS)).toBe(true);
  });

  it('returns false for other statuses', () => {
    expect(isExamPendingQuestionsStatus(BackendExamStatus.READY)).toBe(false);
    expect(isExamPendingQuestionsStatus(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Transition helpers
// ---------------------------------------------------------------------------

describe('isGenerationCompletedTransition', () => {
  it('returns true when previous=QUESTIONS_GENERATING and current=READY', () => {
    expect(
      isGenerationCompletedTransition(
        BackendExamStatus.QUESTIONS_GENERATING,
        BackendExamStatus.READY,
      ),
    ).toBe(true);
  });

  it('returns false when previous is not QUESTIONS_GENERATING', () => {
    expect(
      isGenerationCompletedTransition(BackendExamStatus.PENDING_QUESTIONS, BackendExamStatus.READY),
    ).toBe(false);
  });

  it('returns false when current is not READY', () => {
    expect(
      isGenerationCompletedTransition(
        BackendExamStatus.QUESTIONS_GENERATING,
        BackendExamStatus.IN_PROGRESS,
      ),
    ).toBe(false);
  });

  it('handles undefined inputs gracefully', () => {
    expect(isGenerationCompletedTransition(undefined, BackendExamStatus.READY)).toBe(false);
    expect(isGenerationCompletedTransition(BackendExamStatus.QUESTIONS_GENERATING, null)).toBe(
      false,
    );
  });
});

describe('isGenerationFailedTransition', () => {
  it('returns true when previous=QUESTIONS_GENERATING and current=QUESTION_GENERATION_FAILED', () => {
    expect(
      isGenerationFailedTransition(
        BackendExamStatus.QUESTIONS_GENERATING,
        BackendExamStatus.QUESTION_GENERATION_FAILED,
      ),
    ).toBe(true);
  });

  it('returns false for unrelated transitions', () => {
    expect(
      isGenerationFailedTransition(BackendExamStatus.READY, BackendExamStatus.QUESTION_GENERATION_FAILED),
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getDerivedExamStatus
// ---------------------------------------------------------------------------

describe('getDerivedExamStatus', () => {
  const base = { submitted_at: null, started_at: null };

  it('returns generating when exam_status is QUESTIONS_GENERATING (regardless of other fields)', () => {
    expect(
      getDerivedExamStatus({
        ...base,
        exam_status: BackendExamStatus.QUESTIONS_GENERATING,
      }),
    ).toBe(DerivedExamStatus.generating);
  });

  it('returns generation_failed when exam_status is QUESTION_GENERATION_FAILED', () => {
    expect(
      getDerivedExamStatus({
        ...base,
        exam_status: BackendExamStatus.QUESTION_GENERATION_FAILED,
      }),
    ).toBe(DerivedExamStatus.generation_failed);
  });

  it('returns completed_successful when submitted and score >= pass_score', () => {
    expect(
      getDerivedExamStatus({
        submitted_at: '2024-01-01T10:00:00Z',
        started_at: '2024-01-01T09:00:00Z',
        exam_status: BackendExamStatus.COMPLETED,
        score: 80,
        certification: { pass_score: 75 },
      }),
    ).toBe(DerivedExamStatus.completed_successful);
  });

  it('returns completed_review when submitted and score < pass_score', () => {
    expect(
      getDerivedExamStatus({
        submitted_at: '2024-01-01T10:00:00Z',
        started_at: '2024-01-01T09:00:00Z',
        exam_status: BackendExamStatus.COMPLETED,
        score: 60,
        certification: { pass_score: 75 },
      }),
    ).toBe(DerivedExamStatus.completed_review);
  });

  it('returns completed when submitted but no score/pass_score available', () => {
    expect(
      getDerivedExamStatus({
        submitted_at: '2024-01-01T10:00:00Z',
        started_at: '2024-01-01T09:00:00Z',
        exam_status: BackendExamStatus.COMPLETED,
        score: null,
      }),
    ).toBe(DerivedExamStatus.completed);
  });

  it('returns in_progress when started but not submitted', () => {
    expect(
      getDerivedExamStatus({
        submitted_at: null,
        started_at: '2024-01-01T09:00:00Z',
        exam_status: BackendExamStatus.IN_PROGRESS,
      }),
    ).toBe(DerivedExamStatus.in_progress);
  });

  it('returns ready when exam_status is READY and not started', () => {
    expect(
      getDerivedExamStatus({
        ...base,
        exam_status: BackendExamStatus.READY,
      }),
    ).toBe(DerivedExamStatus.ready);
  });

  it('returns not_started when exam_status is PENDING_QUESTIONS', () => {
    expect(
      getDerivedExamStatus({
        ...base,
        exam_status: BackendExamStatus.PENDING_QUESTIONS,
      }),
    ).toBe(DerivedExamStatus.not_started);
  });

  it('returns not_started when no status and no activity', () => {
    expect(getDerivedExamStatus(base)).toBe(DerivedExamStatus.not_started);
  });

  it('QUESTIONS_GENERATING takes priority over submitted_at', () => {
    // Edge case: generating status overrides submitted state in branching order
    expect(
      getDerivedExamStatus({
        submitted_at: '2024-01-01T10:00:00Z',
        started_at: '2024-01-01T09:00:00Z',
        exam_status: BackendExamStatus.QUESTIONS_GENERATING,
      }),
    ).toBe(DerivedExamStatus.generating);
  });
});

// ---------------------------------------------------------------------------
// getExamProgressBadgeStatus
// ---------------------------------------------------------------------------

describe('getExamProgressBadgeStatus', () => {
  it('returns passed when submitted with score >= pass_score', () => {
    expect(
      getExamProgressBadgeStatus({ submitted_at: 1700000000, score: 80, pass_score: 75 }),
    ).toBe('passed');
  });

  it('returns failed when submitted with score < pass_score', () => {
    expect(
      getExamProgressBadgeStatus({ submitted_at: 1700000000, score: 60, pass_score: 75 }),
    ).toBe('failed');
  });

  it('returns completed when submitted but score/pass_score unavailable', () => {
    expect(
      getExamProgressBadgeStatus({ submitted_at: 1700000000, score: null, pass_score: null }),
    ).toBe('completed');
  });

  it('returns completed when submitted and pass_score is undefined', () => {
    expect(getExamProgressBadgeStatus({ submitted_at: 1700000000 })).toBe('completed');
  });

  it('returns generating when QUESTIONS_GENERATING and not submitted', () => {
    expect(
      getExamProgressBadgeStatus({
        submitted_at: null,
        exam_status: BackendExamStatus.QUESTIONS_GENERATING,
      }),
    ).toBe('generating');
  });

  it('returns generation_failed when QUESTION_GENERATION_FAILED', () => {
    expect(
      getExamProgressBadgeStatus({
        submitted_at: null,
        exam_status: BackendExamStatus.QUESTION_GENERATION_FAILED,
      }),
    ).toBe('generation_failed');
  });

  it('returns ready when READY', () => {
    expect(
      getExamProgressBadgeStatus({ submitted_at: null, exam_status: BackendExamStatus.READY }),
    ).toBe('ready');
  });

  it('returns pending when PENDING_QUESTIONS', () => {
    expect(
      getExamProgressBadgeStatus({
        submitted_at: null,
        exam_status: BackendExamStatus.PENDING_QUESTIONS,
      }),
    ).toBe('pending');
  });

  it('returns in_progress as default when not submitted and no matching status', () => {
    expect(getExamProgressBadgeStatus({ submitted_at: null })).toBe('in_progress');
  });

  it('submitted_at takes priority over exam_status for badge', () => {
    expect(
      getExamProgressBadgeStatus({
        submitted_at: 1700000000,
        score: 80,
        pass_score: 75,
        exam_status: BackendExamStatus.QUESTIONS_GENERATING,
      }),
    ).toBe('passed');
  });
});

// ---------------------------------------------------------------------------
// getExamStatusInfo
// ---------------------------------------------------------------------------

describe('getExamStatusInfo', () => {
  it('returns correct label for each DerivedExamStatus', () => {
    const checks: [DerivedExamStatus, string][] = [
      [DerivedExamStatus.not_started, 'Not Started'],
      [DerivedExamStatus.ready, 'Ready'],
      [DerivedExamStatus.generating, 'Generating Questions...'],
      [DerivedExamStatus.generation_failed, 'Generation Failed'],
      [DerivedExamStatus.in_progress, 'In Progress'],
      [DerivedExamStatus.completed, 'Completed'],
      [DerivedExamStatus.completed_successful, 'Score Above Threshold'],
      [DerivedExamStatus.completed_review, 'Score Below Threshold'],
    ];

    checks.forEach(([status, expectedLabel]) => {
      expect(getExamStatusInfo(status).label).toBe(expectedLabel);
    });
  });

  it('returns the correct status member on the result object', () => {
    Object.values(DerivedExamStatus).forEach((s) => {
      expect(getExamStatusInfo(s).status).toBe(s);
    });
  });

  it('returns non-empty bgColor and borderColor for every status', () => {
    Object.values(DerivedExamStatus).forEach((s) => {
      const info = getExamStatusInfo(s);
      expect(info.bgColor).toBeTruthy();
      expect(info.borderColor).toBeTruthy();
    });
  });
});
