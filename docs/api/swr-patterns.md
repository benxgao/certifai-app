# SWR Patterns

> **Source of truth**: `src/swr/useAuthSWR.ts`, `src/swr/useAuthMutation.ts`, `src/swr/utils.ts`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents the SWR data-fetching conventions used across `certifai-app`: base hooks, domain hook inventory, generic type rules, mutation patterns, and caching defaults.

## Key Concepts

- **`useAuthSWR`**: authenticated read hook. Wraps `useSWR` with automatic token refresh on 401.
- **`useAuthMutation`**: authenticated write hook. Wraps `useSWRMutation` with automatic token refresh on 401.
- **Domain hooks**: one file per resource in `src/swr/`, each exporting named hooks (e.g., `useCertifications`, `useExams`).
- **`fetcherWithAuth`**: the SWR fetcher used by `useAuthSWR`; handles 401 retry.

## Base Hook Signatures

```typescript
// src/swr/useAuthSWR.ts
function useAuthSWR<Data = any, Error = any>(
  key: string | null,
  config?: SWRConfiguration<Data, Error>,
): SWRResponse<Data, Error>

// src/swr/useAuthMutation.ts
function useAuthMutation<Data = any, Arg = any>(
  key: string,
  method: 'POST' | 'PUT' | 'DELETE',
  config?: SWRMutationConfiguration<Data, Error, string, Arg>,
): SWRMutationResponse<Data, Error, string, Arg>
```

## Domain Hook Inventory

| File | Exported hooks | Resource |
| ---- | -------------- | -------- |
| `certifications.ts` | `useCertifications`, `useUserCertifications`, `useRegisterCertification` | Certification list and registration |
| `exams.ts` | `useExams`, `useSubmitExam`, `useDeleteExam` | Exam CRUD |
| `questions.ts` | `useQuestions`, `useSubmitAnswer` | Exam questions |
| `examInfo.ts` | `useExamInfo` | Single exam metadata |
| `examReport.ts` | `useExamReport` | Post-exam report |
| `certSummary.ts` | `useCertSummary` | Certification performance summary |
| `profile.ts` | `useProfile`, `useUpdateProfile` | User profile |
| `firms.ts` | `useFirms` | Firm / organization list |
| `createExam.ts` | `useCreateExam` | Exam generation |
| `deleteAccount.ts` | `useDeleteAccount` | Account deletion |
| `rateLimitInfo.ts` | `useRateLimitInfo` | Rate limit status |
| `useAllData.ts` | `useAllData` | Composite data hook |
| `useExamGeneratingProgress.ts` | `useExamGeneratingProgress` | Exam generation poll |
| `useExamLiveStatus.ts` | `useExamLiveStatus` | Live exam status poll |
| `demoCredentials.ts` | `useDemoCredentials` | Demo credential reveal |

## Generic Type Rules

### Read hooks — 2 generics

```typescript
// useAuthSWR<ResponseType, ErrorType>
const { data } = useAuthSWR<ApiResponse<ExamListItemData[]>, ApiError>(
  `/user/${userId}/exams`,
);
```

### Mutation hooks — 4 generics when passing extra args

```typescript
// useSWRMutation<Data, Error, Key, ExtraArgument>
const { trigger } = useSWRMutation<
  ApiResponse<ExamSubmitData>,
  ApiError,
  string,                        // key type
  { examId: string; body: ExamAnswerSubmission; refreshToken: () => Promise<string | null> }
>('SUBMIT_EXAM', submitExamFetcher);
```

Omitting the 4th generic when `trigger()` receives arguments will cause TypeScript to reject the call.

## Default Cache Config

`useAuthSWR` applies these defaults (overridable per hook):

```typescript
{
  dedupingInterval: 5000,       // 5 s — prevents duplicate in-flight requests
  focusThrottleInterval: 10000, // 10 s — throttles revalidation on window focus
}
```

Override in domain hooks when polling is needed:

```typescript
useAuthSWR<ProgressData>('/exam/progress', { refreshInterval: 2000 });
```

## Conventions / Rules

- All reads use `useAuthSWR` — never call `useSWR` directly in domain hooks.
- All authenticated mutations use `useAuthMutation` or `useSWRMutation` with explicit generic params.
- Every domain hook must have explicit generic type parameters. No bare `useAuthSWR()` without `<Data, Error>`.
- Keys must be absolute API paths or `null` (to pause fetching when a dependency is not yet available).
- Domain hook files live in `src/swr/`; types live in the matching `src/types/swr-data/<name>.ts`.

## Error Handling

```typescript
const { data, error } = useAuthSWR<ApiResponse<ProfileData>, ApiError>('/profile');

if (error) {
  if (isApiError(error) && error.status === 404) {
    // handle not found
  }
}
```

Use `isApiError()` from `src/types/api.ts` before accessing `.status` or `.info`.

## Dangerous Areas / Anti-patterns

- **Never** use `useSWR` directly in domain hooks — `useAuthSWR` is required for the 401 auto-refresh.
- **Never** call `fetch()` directly in components — always go through SWR hooks.
- **Never** return `data?.data` from a mutation hook when `ApiResponse<T>` already wraps the data — access `data.data` correctly or return the full `ApiResponse`.
- **Avoid** bare hook calls without generic params — TypeScript will infer `any`, masking type errors at the consumer.

## Related Docs

- [API Connection](api-connection.md)
- [Data Models](../data/data-models.md)
- [State: Client State](../state/client-state.md)
