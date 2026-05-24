# Executive Report: AI Exam Report Hotfix

## Executive summary

We identified and resolved a production issue that prevented some completed exams from generating AI exam reports. That failure also caused the AI Learning Journey summary to incorrectly tell users they had too few completed reports, even when they had already finished enough exams.

The root cause was a schema mismatch in the report-generation flow. The system was asking the LLM to return a field that is calculated locally by the application, so validation failed and the report was never saved. We corrected the contract, backfilled affected exams, standardized error handling, and added regression coverage.

## Customer impact

- Some users saw a `500` error when requesting an AI exam report.
- The learning journey summary could fail or show an inaccurate “insufficient progress” message.
- The issue blocked progress after exam completion and created avoidable support friction.

## Root cause

The report-generation pipeline expected the LLM to return both the report narrative and a locally computed adjustment field. Because the adjustment field is not produced by the model, validation rejected the response before persistence occurred. As a result:

1. No Firestore exam report document was written.
2. Cert summary logic counted zero available reports.
3. Users received misleading prerequisite failures instead of a successful summary.

## What was fixed

- Separated the LLM output schema from the final report schema so validation only checks fields the model actually returns.
- Re-enqueued and regenerated missing reports for completed exams that had been blocked by the failure.
- Normalized backend and frontend error handling so responses are consistent and easier to interpret.
- Improved prerequisite messaging for the cert summary flow so users can understand what is missing.
- Verified retry behavior and idempotency so repeat processing does not create duplicate reports.

## Outcome

- Report generation now succeeds for new exams.
- Previously affected completed exams were backfilled.
- Cert summary generation now works once the required reports exist.
- Users now see clearer, actionable errors instead of duplicated or ambiguous messages.

## Validation

The hotfix was validated through:

- TypeScript compilation checks in the API and frontend workspaces.
- Backend regression tests covering schema validation, task behavior, and idempotency.
- Frontend regression tests covering error contract handling and messaging.
- Manual verification against previously failing exam-report and cert-summary flows.

## Delivery status

**Status:** Complete

**Risk after fix:** Low

**Monitoring focus:** report generation success rate, summary completion rate, and any repeat failure patterns.

## Notes for stakeholders

- No product rules were changed. The requirement for a minimum report history remains in place.
- The fix was intentionally narrow to reduce risk and restore the user journey quickly.
- Technical details and implementation history are preserved in the underlying rollout record for engineering reference.
