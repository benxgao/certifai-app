# Data Models

> **Source of truth**: `src/types/swr-data/` (16 files), `src/types/api.ts`, `src/types/exam-status.ts`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents the frontend data model conventions: the `src/types/swr-data/` layout, type interface rules, enum usage, and prohibited patterns.

## Key Concepts

- **One type file per SWR hook**: every hook in `src/swr/` has a matching type file in `src/types/swr-data/`.
- **`ApiResponse<T>`**: base envelope from `src/types/api.ts`. Never redefine locally.
- **Enums for fixed value sets**: status fields, category names, and other fixed strings must use enums.
- **No `any`**: all types must be explicit interfaces or enums.

## Type File Map

| Type file | Paired hook | Key types exported |
| --------- | ----------- | ------------------ |
| `certifications.ts` | `src/swr/certifications.ts` | `CertificationListItem`, `UserRegisteredCertification`, `CertificationStatus` |
| `exams.ts` | `src/swr/exams.ts` | `ExamListItem`, `ExamSubmitData` |
| `questions.ts` | `src/swr/questions.ts` | `QuestionData`, `ExamAnswerSubmission`, `SubmitAnswerError` |
| `examInfo.ts` | `src/swr/examInfo.ts` | `ExamInfoData` |
| `examReport.ts` | `src/swr/examReport.ts` | `ExamReportData` |
| `certSummary.ts` | `src/swr/certSummary.ts` | `CertSummaryData` |
| `profile.ts` | `src/swr/profile.ts` | `UserProfileData` |
| `firms.ts` | `src/swr/firms.ts` | `FirmData` |
| `createExam.ts` | `src/swr/createExam.ts` | `CreateExamRequest`, `CreateExamResponse` |
| `deleteAccount.ts` | `src/swr/deleteAccount.ts` | `DeleteAccountResponse` |
| `rateLimitInfo.ts` | `src/swr/rateLimitInfo.ts` | `RateLimitInfoData` |
| `useAllData.ts` | `src/swr/useAllData.ts` | `AllData` |
| `useExamGeneratingProgress.ts` | `src/swr/useExamGeneratingProgress.ts` | `ExamGeneratingProgressData` |
| `useExamLiveStatus.ts` | `src/swr/useExamLiveStatus.ts` | `ExamLiveStatusData` |
| `demoCredentials.ts` | `src/swr/demoCredentials.ts` | `DemoCredentialsData` |

## Exam Status Enum

```typescript
// src/types/exam-status.ts
enum ExamStatus {
  GENERATING = 'GENERATING',
  READY      = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED  = 'COMPLETED',
  FAILED     = 'FAILED',
}
```

Always import `ExamStatus` from `src/types/exam-status.ts`. Never compare against raw strings like `'GENERATING'`.

## Interface Authoring Rules

```typescript
interface ExampleData {
  /** Always present — guaranteed by the API @guaranteed */
  id: number;

  /** May be absent when the API omits it @optional */
  description?: string;
}
```

- Use `@guaranteed` and `@optional` JSDoc tags to document API contract.
- Make a field optional (`?`) only when the API genuinely omits it.
- Do not use `[key: string]: any` — define explicit field-level types.
- Do not use `as any` casts to work around type mismatches — fix the root type instead.

## Custom Error Classes

For mutations where downstream code needs context about which item failed:

```typescript
// src/types/swr-data/questions.ts
export class SubmitAnswerError extends Error {
  constructor(message: string, public questionId: string) {
    super(message);
    this.name = 'SubmitAnswerError';
    Object.setPrototypeOf(this, SubmitAnswerError.prototype);
  }
}
```

## Conventions / Rules

- Type files live in `src/types/swr-data/<hook-name>.ts` — match the hook filename exactly.
- Re-export types from the SWR hook file for consumer backward compatibility.
- Enums must be in the type file for the domain they belong to, or in `src/types/exam-status.ts` for cross-cutting values.
- Run `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` after every type change to catch regressions early.

## Dangerous Areas / Anti-patterns

- `[key: string]: any` — allows unsafe field access; banned entirely.
- `data?.data` on a type that has no `.data` field — check the actual `ApiResponse<T>` structure.
- Bare `string` for fields that have a finite set of values — use enums.
- `any[]` in component props — always use the specific item type from `src/types/swr-data/`.

## Related Docs

- [API Connection](../api/api-connection.md)
- [SWR Patterns](../api/swr-patterns.md)
- [Product Glossary](../product/glossary.md)
