# Marketing Subscription Workflow

> **Source of truth**: `app/api/marketing/subscribe/route.ts`, `src/lib/marketing-api.ts`, `src/lib/marketing-types.ts`, `src/lib/marketing-claims.ts`, `src/components/auth/EmailActionHandler.tsx`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the end-to-end marketing subscription pipeline triggered during signup verification, including request boundaries, non-blocking behavior, integration with AWS Lambda/MailerLite, and operational safeguards.

This is the canonical procedural workflow doc for marketing subscription behavior. For core API envelope/fetch conventions, see [`api-connection.md`](api-connection.md).

## Key Concepts

- **Non-blocking subscription**: marketing failures must not block user signup completion.
- **Verification-gated trigger**: subscription is triggered after email verification flow (`VERIFY_EMAIL`).
- **Edge translation layer**: `/api/marketing/subscribe` route validates and normalizes request before server-side integration call.
- **External provider bridge**: app server calls AWS Lambda, which then calls MailerLite.

## Prerequisites in Signup Lifecycle (Context from Steps 1–6)

These steps provide context and are owned in detail by [`../workflow/signup-workflow.md`](../workflow/signup-workflow.md):

1. User submits signup form.
2. Firebase account is created.
3. Backend registration occurs.
4. Verification email is sent.
5. User clicks verification link.
6. Email verification is processed.

After this, marketing workflow begins.

## Complete Marketing Subscription Flow (Core Steps 7–12)

### Step 7 — Trigger subscription after verification

- Trigger location: `src/components/auth/EmailActionHandler.tsx`
- Trigger condition: verification operation (`VERIFY_EMAIL`)
- Behavior:
  - wait briefly for auth state consistency
  - collect email/name/user-agent context
  - call `/api/marketing/subscribe`

### Step 8 — Handle subscription request at API route

- Route: `app/api/marketing/subscribe/route.ts`
- Responsibilities:
  - validate required input (`email`)
  - call `subscribeUserToMarketing()`
  - return non-blocking response behavior (frontend-safe)

### Step 9 — Build and send marketing payload

- Function: `src/lib/marketing-api.ts` (`subscribeUserToMarketing`)
- Responsibilities:
  - generate JWT for marketing API auth
  - build standardized subscription payload
  - send request to AWS Lambda endpoint

### Step 10 — AWS Lambda forwards to MailerLite

- Lambda validates token, forwards subscription request, and handles create/update semantics in MailerLite.
- Subscriber is associated with configured groups (e.g., `new-users`, `newsletter`).

### Step 11 — Persist subscriber linkage

- Function: `src/lib/marketing-claims.ts`
- On success, subscriber ID can be stored in Firebase claims for later lookups.

### Step 12 — Continue normal completion path

- Verification success path continues; user reaches signin/dashboard flow.
- Marketing integration errors should not break primary auth completion.

## Request / Response Shape

### Route input (conceptual)

```typescript
interface MarketingSubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  userAgent?: string;
}
```

### Non-blocking route output (conceptual)

```typescript
interface MarketingSubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

## Environment Configuration

Required environment variables:

- `MARKETING_API_URL`
- `MARKETING_API_SECRET`

Recommended behavior:

- fail fast in server logs if missing configuration
- keep frontend behavior non-blocking regardless of downstream integration failures

## Error Handling and Fallbacks

| Failure point | Handling expectation |
| --- | --- |
| Missing email at route | validation failure response, do not crash flow |
| JWT generation failure | log + return non-blocking failure result |
| Lambda timeout/downstream failure | log + preserve signup completion path |
| MailerLite API failure | record failure; user flow must still complete |

## Monitoring and Debugging

Track and log at minimum:

- JWT generation success/failure
- Request payload validation outcomes
- Lambda response status and latency
- Subscriber ID persistence success/failure

Useful debug correlation signals:

- verification action event
- marketing route request ID
- downstream provider response status

## File Reference

- `app/api/marketing/subscribe/route.ts`
- `src/lib/marketing-api.ts`
- `src/lib/marketing-types.ts`
- `src/lib/marketing-claims.ts`
- `src/components/auth/EmailActionHandler.tsx`
- `src/utils/signup-debug.ts`

## Testing Checklist

- [ ] Successful verification triggers marketing route call
- [ ] Missing-email validation path handled safely
- [ ] Downstream timeout/error does not block signup completion
- [ ] Subscriber ID persistence path works on successful subscription
- [ ] Logs provide enough context for debugging failures

## Conventions / Rules

- Marketing subscription must remain non-blocking to auth/signup success.
- Keep route validation strict and server-side integration centralized in `src/lib/marketing-api.ts`.
- Do not duplicate signup lifecycle logic here; link to signup workflow doc for auth-specific flow detail.

## Dangerous Areas / Anti-patterns

- Blocking signup completion on marketing provider failure.
- Parsing business decisions from freeform message text instead of structured status fields.
- Duplicating integration calls in client components rather than routing through `app/api/marketing/subscribe`.

## Related Docs

- [API Connection](api-connection.md)
- [Signup Workflow](../workflow/signup-workflow.md)
- [Auth Patterns](../security/auth-patterns.md)
