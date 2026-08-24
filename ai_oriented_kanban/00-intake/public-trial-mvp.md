# Public Trial MVP in certifai-app

## Overview

The Public Trial MVP provides a low-friction way for anonymous users to try the certifai experience without creating an account. It helps users understand product value before signup and gives the team usage data to improve conversion and reliability.

This document defines frontend scope plus the required API, data, and architecture decisions for MVP delivery.

## Goals

1. **User exploration**: Let users trial certification questions without authentication.
2. **Feedback collection**: Capture behavioral signals and product feedback.
3. **Conversion support**: Encourage signup after trial completion.
4. **Performance monitoring**: Track flow reliability and latency.
5. **Data isolation**: Keep trial-domain data lifecycle isolated from core Prisma domain data.
6. **Code isolation**: Keep trial generation/services isolated from registered-user generation/services at the interface level, while allowing strategic reuse of core generation logic.

## Success Metrics

1. **Trial engagement**: Users who start and complete a trial (target: >30% completion rate).
2. **Feedback quality**: Quantity/usefulness of events and optional free-text feedback.
3. **Conversion rate**: Trial users who click signup and complete registration (target: >5% click-through).
4. **Reliability**: API success rate, p95 latency <2s, and error rate by endpoint.
5. **Data boundary health**: No direct dependency of trial question/answer persistence on Prisma trial tables.
6. **Code boundary health**: Trial functions/services remain discoverable via `Trial*` naming + `public_trial` domain folder.

## MVP Requirements (Spec-First)

### Normative language

- **MUST** = required for MVP acceptance.
- **SHOULD** = strongly recommended for MVP if implementation cost/risk is acceptable.
- **MAY** = optional for MVP.

### Product and UX requirements

- The frontend **MUST** provide a Public Trial entry in global navigation.
- The trial flow **MUST** allow anonymous users to choose certification and firm from public catalog data.
- The trial flow **MUST** present reusable question sets segmented by `certId + firmId + version`.
- The frontend **MUST** show immediate result output after submission and a signup CTA/value message.
- The frontend **MUST** implement loading, empty, retry, and error fallback states.

### API and security requirements

- `certifai-api` **MUST** expose endpoints to retrieve trial questions, submit answers, and ingest events.
- The API **MUST** validate `certId` and `firmId` against public active Prisma records before serving trial sets.
- Scoring and pass/fail computation **MUST** run server-side for anti-tampering.
- Response payloads **MUST** include `traceId` for operational traceability.

### Data and persistence requirements

- Firestore question set cache **MUST** be persisted and reusable across visitors (not in-memory/Redis/CDN cache semantics).
- Cache TTL **MUST** be 90 days, with regeneration triggered asynchronously when expired.
- Regeneration **SHOULD** use Cloud Tasks queue to prevent duplicate concurrent generation and avoid Firestore transaction timeouts.
- MVP persistence **MUST NOT** store raw answers, exact scores, or per-question correctness in durable storage beyond 7 days (strict TTL for `public_trial_answers`).
- Event ingestion **SHOULD** follow the hybrid model (frontend UX events + API milestone events).
- Trial-domain entities **MUST** use denormalized embedded document design in Firestore to minimize read costs and latency.
- Prisma and Firestore **MUST NOT** be tightly coupled for trial-domain data; only `certId` and `firmId` references are allowed for cross-system linkage in MVP.

### Code architecture and naming requirements (REVISED)

- Genkit trial question generation **SHOULD** reuse existing core generation logic through configuration parameters (e.g., `mode: 'trial'`, `questionCount: 10`), but **MUST** expose trial-specific entry points with `Trial*` prefix.
- Trial generation flow **MUST NOT** duplicate prompt engineering logic; instead, it **SHOULD** call shared generation utilities with trial-specific configurations.
- All trial-related function signatures **MUST** use the `Trial` prefix for explicit domain separation at the API/service layer.
- ExpressJS controllers for public trial endpoints **MUST** delegate to Trial-prefixed domain services (thin controller pattern).
- All trial-related service/repository/generation files **MUST** live under one dedicated domain folder: `public_trial`.
- Shared helper usage **MAY** be allowed for domain-agnostic utilities and core generation logic (e.g., base prompt templates, output parsers), provided they are pure functions without side effects.

### Operations and reliability requirements

- If regeneration fails and no valid active set exists, the API **MUST** return a controlled error with `traceId` or fallback to on-demand generation for critical certifications (Top 5).
- The system **SHOULD** emit backend milestone events (`questions_served`, `submission_processed`, `regeneration_started`, `regeneration_failed`).
- Dashboards/monitoring **SHOULD** track cache hit ratio, regeneration outcomes, p95 latency, and trial funnel conversion.
- The system **MUST** implement IP-based rate limiting (e.g., 3 trials per certification per 24h per IP) to prevent abuse.

## MVP Scope

### User Experience

- Add a **Public Trial** item to global navigation.
- Let users select a certification and firm from public catalog data.
- Present a reusable question set segmented by certification + firm.
- Show results immediately after submission.
- Show signup CTA and value messaging after results.
- Show graceful fallback states (loading, empty, retry, error).

### Backend and Data Requirements

`certifai-api` MUST expose endpoints for:

- Creating/retrieving trial question sets
- Submitting answers
- Returning computed results
- Logging trial events

**Terminology clarification (MVP):**

- In this document, **cache** means **pre-generated and persisted trial question sets in Firestore**.
- These question sets are **reusable across all visitors** for the same `certId + firmId + version`.
- This does **not** refer to Redis, CDN, or in-memory ephemeral caching.
- This is intentionally different from **personalized generation**, where questions are generated uniquely for an individual user.

Trial questions are stored as reusable Firestore-persisted sets ("cache") and reused across visitors. Cache TTL is **90 days**. On expiration, an asynchronous regeneration job is triggered.

Results are computed server-side for consistency and anti-tampering. Submission payloads are processed transiently; raw answers, exact scores, and per-question correctness are **not persisted** in MVP (or retained with strict 7-day TTL only).

## Technical Architecture Plan

### System Components

1. **certifai-app (Next.js frontend)**
   - Public trial pages and UI state
   - API integration
   - Anonymous session management (Firebase Anonymous Auth or localStorage-based session token)
   - Public cert/firm selector driven by Prisma-backed public data

2. **certifai-api (backend service)**
   - Trial orchestration
   - Reusable question set (Firestore "cache") lifecycle
   - Result computation
   - Event ingestion
   - Abuse monitoring hooks (IP rate limiting, honeypot fields)
   - Validation against public cert/firm records from Prisma
   - Dedicated trial domain module under `public_trial`
   - Trial-prefixed service entry points consumed by ExpressJS controllers

3. **Prisma-backed primary DB (source of truth for catalog only)**
   - Public `Certification` and `Firm` entities
   - IDs and display metadata used by frontend and API request validation
   - No MVP trial question/option/answer persistence in Prisma

4. **Firestore (source of truth for trial domain)**
   - Reusable pre-generated trial question sets ("cache") using denormalized embedded documents
   - Trial submission metadata
   - Trial answers (ephemeral/transient handling; 7-day TTL)
   - Analytics events
   - Minimal operational metadata (TTL/version/status)

### Backend domain foldering

Recommended layout in `certifai-api`:

- `src/domains/public_trial/controllers`
- `src/domains/public_trial/services`
- `src/domains/public_trial/repositories`
- `src/domains/public_trial/genkit`
- `src/domains/public_trial/types`

Rules:

- ExpressJS controllers in `controllers` remain thin and call services only.
- Trial business logic lives in `services`.
- Firestore persistence logic lives in `repositories`.
- Genkit trial-specific configurations and prompt variations live in `public_trial/genkit`, but may import shared generation utilities from core domains.
- Trial domain APIs use `Trial*` signatures.

### Trial function signature convention

Examples of expected naming:

- `TrialGetPublicCatalog(...)`
- `TrialGetQuestions(...)`
- `TrialGenerateQuestionSet(...)` (wraps shared logic with trial config)
- `TrialSubmitAnswers(...)`
- `TrialComputeResult(...)`
- `TrialIngestEvent(...)`

This naming convention is mandatory for trial-domain entry points in MVP.

### Request Flow (Happy Path)

1. User opens Public Trial page.
2. Frontend initializes anonymous session (Firebase Anonymous Auth or session token).
3. Frontend fetches public cert/firm options (Prisma-backed API).
4. Frontend calls `GET /public-trial/questions?certId={id}&firmId={id}`.
5. API validates `certId`/`firmId` against public Prisma data.
6. API returns Firestore-persisted reusable question set cache (single document fetch).
7. If cache expired/missing, API returns `status: preparing` and triggers async generation; frontend polls or shows "preparing" state.
8. User submits answers via `POST /public-trial/submissions`.
9. API computes score/result and returns normalized payload.
10. Frontend displays results and signup CTA.
11. Frontend emits analytics events (`page_view`, `trial_start`, `trial_complete`, `signup_click`).

### Anonymous Session Management (NEW)

To maintain state across page refreshes and prevent abuse while keeping friction low:

- **Primary approach**: Firebase Anonymous Auth ( lightweight, provides persistent UID across sessions).
- **Fallback**: Cryptographic session token stored in `localStorage` with 24h expiration, validated via HMAC.
- **Session data stored**: `sessionId`, `trialSetId` (if in progress), `submissionId` (if completed), `createdAt`, `ipHash` (for abuse detection).
- **Cleanup**: Automatic expiration via Firestore TTL on session documents.

### Event Ingestion Strategy (MVP)

**Trade-offs**

- **Frontend-only events to API**
  - Pros: fastest to implement, captures rich UI interactions.
  - Cons: more event loss risk (navigation drops, blockers, network issues), easier client-side tampering.

- **API-emitted server-side events**
  - Pros: higher reliability for backend milestones (question served/submission processed), more trustworthy data.
  - Cons: less UI context unless frontend also sends events.

**MVP decision: hybrid**

- Frontend sends UX/interaction events (`page_view`, `trial_start`, `trial_complete`, `signup_click`).
- API emits core system events for backend milestones.
- This keeps implementation simple while reducing critical event loss.

## Data Modeling Strategy (Revised)

### Denormalized Document Design (Embedded Structure)

For MVP, trial data uses denormalized embedded documents optimized for Firestore's pricing model (minimize reads) and query patterns.

**Key principle**: Optimize for read-heavy operations (serving questions to thousands of users) over write normalization.

**Rationale**:

- A trial set is immutable after generation (90-day TTL, then replaced).
- Embedding questions and options into a single document reduces Firestore reads from 3 (set+questions+options) to 1 per trial session.
- With 10 questions per set, document size stays well under Firestore's 1MB limit (~50-100KB estimated).

### Coupling boundary

- Allowed Prisma dependency:
  - Validation + lookup of public/active `certId` and `firmId`
  - Read-only access to certification metadata (name, passing score thresholds)
- Disallowed in MVP:
  - Storing trial question/option/answer entities in Prisma
  - Requiring Prisma joins for trial execution
  - Bidirectional sync between Firestore trial collections and Prisma trial tables

### Generation boundary (Revised)

- Trial generation **SHOULD** reuse core generation utilities (prompt builders, output parsers, LLM client wrappers) from existing domains.
- Trial-specific logic (prompt variations, question count, difficulty targeting) lives in `public_trial/genkit`.
- Configuration-driven isolation: Use `GenerationMode.TRIAL` enum to trigger trial-specific behaviors (e.g., no personalization, fixed 10 questions) rather than code duplication.

## Cache and Regeneration Strategy (Revised)

- Cache key: `public_trial_sets/{certId}_{firmId}_v{version}`.
- **Cache structure**: Single Firestore document containing embedded questions array.
- **Document includes**:
  - `questions[]` (embedded with options and correct flags)
  - `createdAt`, `expiresAt`
  - `status` (`active`, `generating`, `failed`)
  - `version`, `generationMeta`
- **Warm-up strategy (NEW)**: On deployment or certification update, pre-generate trial sets for Top 5 certifications to prevent cold-start latency.
- **Regeneration flow**:
  1. On cache miss or expiry, return immediate response with `status: generating` (or fallback to real-time generation for critical certs).
  2. Enqueue regeneration job to Cloud Tasks queue (avoids Firestore transaction timeouts).
  3. Worker generates questions and writes single document with `status: active`.
  4. If generation fails, mark `status: failed` and alert ops; subsequent requests may trigger retry with exponential backoff.
- **No transaction locks**: Cloud Tasks provides natural deduplication via task IDempotency keys.

## API Contract (MVP Draft)

- `GET /public-trial/questions`
  - Query: `certId`, `firmId`
  - Controller delegates to: `TrialGetQuestions(...)`
  - Response: `{ trialSetId, certId, firmId, status: 'active' | 'generating', questions[], expiresAt, traceId }`
  - Note: If `status: generating`, frontend should poll or show waiting state.

- `POST /public-trial/submissions`
  - Body: `{ trialSetId, answers[], sessionToken }`
  - Controller delegates to: `TrialSubmitAnswers(...)`
  - Response: `{ score, passed, traceId }`

- `POST /public-trial/events`
  - Body: `{ eventType, sessionToken?, trialSetId?, certId?, firmId?, properties? }`
  - Controller delegates to: `TrialIngestEvent(...)`
  - Response: `{ accepted: true, traceId }`

## Database Collection Design (Revised)

### 1) Prisma-backed primary DB (read/validate source only)

Used for public catalog lookup and request validation only in MVP.

- `Certification`
  - `id` (string, PK)
  - `slug` (string, unique)
  - `name` (string)
  - `isPublic` (boolean)
  - `isActive` (boolean)
  - `passingScore` (int, optional - for trial scoring context)
  - `updatedAt` (datetime)

- `Firm`
  - `id` (string, PK)
  - `slug` (string, unique)
  - `name` (string)
  - `isPublic` (boolean)
  - `isActive` (boolean)
  - `updatedAt` (datetime)

Validation rule: only `isPublic && isActive` records are eligible for public trial.

### 2) Firestore collections (trial-domain source of truth)

#### `public_trial_sets` (Denormalized Cache - Single Collection)

Document ID: `{certId}_{firmId}_v{version}` (e.g., `aws-saa-001_v1`)

- `trialSetId` (string, same as document ID)
- `certId` (string, Prisma reference)
- `firmId` (string, Prisma reference)
- `version` (number)
- `status` (`active` | `generating` | `failed`)
- `questions` (array of embedded objects):
  ```typescript
  {
    questionId: string,
    order: number,
    prompt: string,
    options: [{
      optionId: string,
      text: string,
      order: number,
      isCorrect: boolean  // Server-only, filtered in API response
    }],
    explanation: string  // Optional in MVP, can be added later
  }
  ```
- `questionCount` (number, default 10)
- `createdAt` (timestamp)
- `expiresAt` (timestamp, TTL index)
- `lastServedAt` (timestamp)

## Evaluation and Open Questions

### Evaluation Summary

The MVP plan is well-structured and implementation-ready. It has strong qualities:

- Clear **domain separation** (`public_trial` folder + `Trial*` signatures).
- Correct **data boundary** between Prisma (catalog validation only) and Firestore (trial-domain source of truth).
- Good **operational posture** (`traceId`, status lifecycle, regeneration events, rate limiting).
- Practical **UX fallback model** (`active` vs `generating`, polling/retry states).
- Sensible **generation strategy** (reuse shared generation logic without duplicating prompts).

Primary concerns to resolve before implementation:

1. **Sensitive correctness data in Firestore docs**
   `isCorrect` is stored in embedded options. This is acceptable only if strictly never returned by API and access is service-account only. Confirm Firestore security rules and response serializers enforce this.

2. **Regeneration concurrency/idempotency details**
   Cloud Tasks is proposed, but task key strategy and duplicate suppression rules are not fully specified. Define deterministic task IDs per `{certId}_{firmId}_v{version}` and retry/backoff behavior.

3. **Rate limit trust model**
   IP-only limiting may be weak behind NAT/proxies and can penalize shared networks. Confirm whether limiter uses `ip + certId + firmId + sessionId` and trusted proxy configuration.

4. **Submission retention policy precision**
   Document says “MUST NOT store raw answers... beyond 7 days (strict TTL).” Clarify whether default is no persistence, with 7-day retention as exception for abuse/debug only.

5. **Result contract completeness**
   Current response is `{ score, passed, traceId }`. Consider adding `totalQuestions` and `passingScore` for stable frontend rendering and analytics consistency.

### Open Questions (Decision Log Needed)

1. **Anonymous identity choice**
   - Is Firebase Anonymous Auth mandatory, or optional with local token as first-class fallback?
   - What is the canonical `sessionId` format used across frontend, API, and events?

2. **Versioning ownership**
   - Who increments `version` for trial sets (manual release step vs auto on cert content changes)?
   - Should old versions remain readable until TTL expiry, or be hard-invalidated?

3. **Critical-cert fallback behavior**
   - For Top 5 certs, does API do synchronous on-demand generation when cache is missing, or always return `generating`?
   - What is the max wait budget before returning controlled error?

## Evaluation and Open Questions

### Evaluation Summary

The MVP plan is well-structured and implementation-ready. It has strong qualities:

- Clear **domain separation** (`public_trial` folder + `Trial*` signatures).
- Correct **data boundary** between Prisma (catalog validation only) and Firestore (trial-domain source of truth).
- Good **operational posture** (`traceId`, status lifecycle, regeneration events, rate limiting).
- Practical **UX fallback model** (`active` vs `generating`, polling/retry states).
- Sensible **generation strategy** (reuse shared generation logic without duplicating prompts).

Primary concerns to resolve before implementation:

1. **Sensitive correctness data in Firestore docs**
   `isCorrect` is stored in embedded options. This is acceptable only if strictly never returned by API and access is service-account only. Confirm Firestore security rules and response serializers enforce this.

2. **Regeneration concurrency/idempotency details**
   Cloud Tasks is proposed, but task key strategy and duplicate suppression rules are not fully specified. Define deterministic task IDs per `{certId}_{firmId}_v{version}` and retry/backoff behavior.

3. **Rate limit trust model**
   IP-only limiting may be weak behind NAT/proxies and can penalize shared networks. Confirm whether limiter uses `ip + certId + firmId + sessionId` and trusted proxy configuration.

4. **Submission retention policy precision**
   Document says “MUST NOT store raw answers... beyond 7 days (strict TTL).” Clarify whether default is no persistence, with 7-day retention as exception for abuse/debug only.

5. **Result contract completeness**
   Current response is `{ score, passed, traceId }`. Consider adding `totalQuestions` and `passingScore` for stable frontend rendering and analytics consistency.

### Open Questions (Decision Log Needed)

1. **Anonymous identity choice**
   - Is Firebase Anonymous Auth mandatory, or optional with local token as first-class fallback?
   - What is the canonical `sessionId` format used across frontend, API, and events?

2. **Versioning ownership**
   - Who increments `version` for trial sets (manual release step vs auto on cert content changes)?
   - Should old versions remain readable until TTL expiry, or be hard-invalidated?

3. **Critical-cert fallback behavior**
   - For Top 5 certs, does API do synchronous on-demand generation when cache is missing, or always return `generating`?
   - What is the max wait budget before returning controlled error?
