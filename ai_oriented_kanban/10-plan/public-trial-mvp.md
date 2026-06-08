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
6. **Code isolation**: Keep trial generation/services isolated from registered-user generation/services.

## Success Metrics

1. **Trial engagement**: Users who start and complete a trial.
2. **Feedback quality**: Quantity/usefulness of events and optional free-text feedback.
3. **Conversion rate**: Trial users who click signup and complete registration.
4. **Reliability**: API success rate, p95 latency, and error rate by endpoint.
5. **Data boundary health**: No direct dependency of trial question/answer persistence on Prisma trial tables.
6. **Code boundary health**: Trial functions/services remain discoverable and isolated via `Trial*` naming + `public_trial` domain folder.

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
- Cache TTL **MUST** be 90 days, with regeneration triggered on eligible post-expiration requests.
- Regeneration **MUST** use a Firestore transactional lock to prevent duplicate concurrent generation.
- MVP persistence **MUST NOT** store raw answers, exact scores, or per-question correctness in durable storage.
- Event ingestion **SHOULD** follow the hybrid model (frontend UX events + API milestone events).
- Trial-domain entities (**questions, options, submissions, answers, scoring snapshots**) **MUST** be represented in a relational-like schema design but persisted in Firestore collections.
- Prisma and Firestore **MUST NOT** be tightly coupled for trial-domain data; only `certId` and `firmId` references are allowed for cross-system linkage in MVP.

### Code architecture and naming requirements (NEW)

- Genkit trial question/option generation **MUST** be isolated from existing generation functions used for registered users.
- Trial generation flow **MUST NOT** directly call registered-user generation functions.
- All trial-related function signatures **MUST** use the `Trial` prefix for explicit domain separation.
- ExpressJS controllers for public trial endpoints **MUST** delegate to Trial-prefixed domain services (thin controller pattern).
- All trial-related service/repository/generation files **MUST** live under one dedicated domain folder: `public_trial`.
- Shared helper usage **MAY** be allowed only for domain-agnostic utilities (e.g., tracing, validation helpers, logger wrappers), not domain business logic.

### Operations and reliability requirements

- If regeneration fails and no valid active set exists, the API **MUST** return a controlled error with `traceId`.
- The system **SHOULD** emit backend milestone events (`questions_served`, `submission_processed`, `regeneration_started`, `regeneration_failed`).
- Dashboards/monitoring **SHOULD** track cache hit ratio, regeneration outcomes, p95 latency, and trial funnel conversion.

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

Trial questions are stored as reusable Firestore-persisted sets ("cache") and reused across visitors. Cache TTL is **90 days**. On expiration, next eligible request triggers regeneration.

Results are computed server-side for consistency and anti-tampering. Submission payloads are processed transiently; raw answers, exact scores, and per-question correctness are **not persisted** in MVP.

## Technical Architecture Plan

### System Components

1. **certifai-app (Next.js frontend)**
   - Public trial pages and UI state
   - API integration
   - Anonymous client session ID generation (non-authoritative)
   - Public cert/firm selector driven by Prisma-backed public data

2. **certifai-api (backend service)**
   - Trial orchestration
   - Reusable question set (Firestore "cache") lifecycle
   - Result computation
   - Event ingestion
   - Abuse monitoring hooks (extensible for future controls)
   - Validation against public cert/firm records from Prisma
   - Dedicated trial domain module under `public_trial`
   - Trial-prefixed service entry points consumed by ExpressJS controllers

3. **Prisma-backed primary DB (source of truth for catalog only)**
   - Public `Certification` and `Firm` entities
   - IDs and display metadata used by frontend and API request validation
   - No MVP trial question/option/answer persistence in Prisma

4. **Firestore (source of truth for trial domain)**
   - Reusable pre-generated trial question sets ("cache")
   - Trial question and option materialization
   - Trial submission metadata
   - Trial answers (ephemeral/transient handling; no raw answer durability requirement in MVP)
   - Analytics events
   - Minimal operational metadata (TTL/version/status)

### Backend domain foldering (NEW)

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
- Genkit prompts/chains/tools for trial question generation live in `genkit` and remain isolated from registered-user generation modules.
- Trial domain APIs use `Trial*` signatures.

### Trial function signature convention (NEW)

Examples of expected naming:

- `TrialGetPublicCatalog(...)`
- `TrialGetQuestions(...)`
- `TrialGenerateQuestionSet(...)`
- `TrialRegenerateQuestionSet(...)`
- `TrialSubmitAnswers(...)`
- `TrialComputeResult(...)`
- `TrialIngestEvent(...)`
- `TrialEmitMilestoneEvent(...)`

This naming convention is mandatory for trial-domain entry points in MVP.

### Request Flow (Happy Path)

1. User opens Public Trial page.
2. Frontend fetches public cert/firm options (Prisma-backed API).
3. Frontend calls `GET /public-trial/questions?certId={id}&firmId={id}`.
4. API validates `certId`/`firmId` against public Prisma data.
5. API returns Firestore-persisted reusable question set cache (or regenerates if expired/missing).
6. User submits answers via `POST /public-trial/submissions`.
7. API computes score/result and returns normalized payload.
8. Frontend displays results and signup CTA.
9. Frontend emits analytics events (`page_view`, `trial_start`, `trial_complete`, `signup_click`).

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

## Data Modeling Strategy (New/Updated)

### Relational-shape simulation in Firestore

For MVP, trial data is modeled as if it were SQL tables (normalized entities and IDs), but persisted in Firestore collections.

Conceptual entities:

- `TrialQuestionSet`
- `TrialQuestion`
- `TrialQuestionOption`
- `TrialSubmission`
- `TrialAnswer`
- `TrialEvent`

Implementation rule:

- Use Firestore collections/documents to represent these entities.
- Keep ID-based relationships (`trialSetId`, `questionId`, `optionId`, `submissionId`) explicit.
- Avoid embedding large mutable answer payloads into question set docs.
- Keep coupling to Prisma limited to referencing `certId` and `firmId`.

### Coupling boundary

- Allowed Prisma dependency:
  - validation + lookup of public/active `certId` and `firmId`
- Disallowed in MVP:
  - storing trial question/option/answer entities in Prisma
  - requiring Prisma joins for trial execution
  - bidirectional sync between Firestore trial collections and Prisma trial tables

### Generation boundary (NEW)

- Trial Genkit generation artifacts (prompt templates, output schema adapters, mapping logic) must remain inside `public_trial/genkit`.
- Registered-user generation artifacts must remain outside `public_trial`.
- Cross-calls between trial-generation and registered-user generation modules are disallowed in MVP.

## Cache and Regeneration Strategy

- Cache key: `certId + firmId + version`.
- **Cache meaning here:** pre-generated, persisted, reusable trial question sets in Firestore (not Redis/in-memory cache).
- Document includes:
  - `questions`
  - `createdAt`
  - `expiresAt`
  - `status` (`active`, `regenerating`, `failed`)
  - `version`
- Each question item includes its own `version` field.
- Regeneration uses a Firestore transactional lock to prevent duplicate concurrent regeneration.
- If regeneration fails and no valid active cache is available, return an error response and log incident details with trace IDs.

## API Contract (MVP Draft)

- `GET /public-trial/questions`
  - Query: `certId`, `firmId`
  - Controller delegates to: `TrialGetQuestions(...)`
  - Response: `{ trialSetId, certId, firmId, questions[], expiresAt, traceId }`

- `POST /public-trial/submissions`
  - Body: `{ trialSetId, answers[] }`
  - Controller delegates to: `TrialSubmitAnswers(...)`
  - Response: `{ score, passed, traceId }`

- `POST /public-trial/events`
  - Body: `{ eventType, clientSessionId?, trialSetId?, certId?, firmId?, properties? }`
  - Controller delegates to: `TrialIngestEvent(...)`
  - Response: `{ accepted: true, traceId }`

## Database Collection Design (Updated)

### 1) Prisma-backed primary DB (read/validate source only)

Used for public catalog lookup and request validation only in MVP.

- `Certification`
  - `id` (string, PK)
  - `slug` (string, unique)
  - `name` (string)
  - `isPublic` (boolean)
  - `isActive` (boolean)
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

#### `public_trial_question_sets` (reusable cache)

Document ID: `{certId}_{firmId}_v{version}`

- `trialSetId`
- `certId` (Prisma reference only)
- `firmId` (Prisma reference only)
- `version`
- `status` (`active` | `regenerating` | `failed`)
- `questionIds` (array of IDs)
- `questionCount`
- `createdAt`
- `expiresAt`
- `lastServedAt` (optional)
- `generationMeta` (optional)
- `traceId` (optional)

#### `public_trial_questions` (relational-like entity)

Document ID: `{questionId}`

- `questionId`
- `trialSetId`
- `certId`
- `firmId`
- `prompt`
- `version`
- `order`
- `correctOptionId` (server-only handling)
- `createdAt`

#### `public_trial_question_options` (relational-like entity)

Document ID: `{optionId}`

- `optionId`
- `questionId`
- `trialSetId`
- `text`
- `order`
- `createdAt`

#### `public_trial_submissions` (minimal metadata)

Document ID: auto-id

- `submissionId`
- `trialSetId`
- `certId`
- `firmId`
- `questionCount`
- `answeredCount`
- `clientSessionId` (optional/non-authoritative)
- `submittedAt`
- `resultSummary` (e.g., band or passed boolean)
- `traceId`

#### `public_trial_answers` (optional, ephemeral/minimal)

Document ID: auto-id

- `submissionId`
- `questionId`
- `selectedOptionId`
- `receivedAt`
- `traceId`

MVP rule: if retained at all, apply strict short retention and do not store correctness/exact score derivations.

#### `public_trial_events`

Document ID: auto-id

- `eventId`
- `eventType`
- `source` (`frontend` | `api`)
- `clientSessionId` (optional)
- `trialSetId` (optional)
- `certId` (optional)
- `firmId` (optional)
- `submissionId` (optional)
- `eventAt`
- `traceId`
- `properties` (sanitized)

## Data Flow (Updated)

### A) Question retrieval and regeneration flow

1. Frontend calls `GET /public-trial/questions?certId={id}&firmId={id}`.
2. API validates `certId`/`firmId` via Prisma public active entities.
3. API checks Firestore cache key `{certId}_{firmId}_v{version}`.
4. If active and not expired, return question set + question/options materialization.
5. If missing/expired:
   - Acquire transactional lock.
   - Generate set via isolated `public_trial/genkit` pipeline.
   - Write `question_sets`, `questions`, `question_options`.
   - Mark set `active`.
6. On failure:
   - Return controlled error with `traceId` if no valid fallback exists.
   - Emit failure event.

### B) Submission and scoring flow

1. Frontend sends `POST /public-trial/submissions` with `{ trialSetId, answers[] }`.
2. API loads trial questions/options from Firestore by `trialSetId`.
3. API computes score/pass server-side.
4. API writes minimal submission metadata.
5. API returns `{ score, passed, traceId }`.
6. API emits `submission_processed`.

### C) Isolation guarantee

- Trial runtime does not depend on Prisma trial tables.
- Firestore remains the operational store for trial entities.
- Prisma is used only for cert/firm eligibility and display metadata.
- Trial business/generation logic remains isolated in `public_trial` domain modules.
- Trial entry-point function naming remains prefixed with `Trial`.

## Operational lifecycle flow

1. Scheduled job (or on-read policy) scans expired question sets.
2. Expired sets are marked for regeneration on next request (lazy refresh).
3. Optional cleanup:
   - prune old events beyond retention window,
   - prune `public_trial_answers` aggressively if enabled,
   - retain submission metadata per compliance window.
4. Dashboards track:
   - cache hit ratio,
   - regeneration success/failure,
   - endpoint latency p95,
   - trial funnel conversion.

## MVP Acceptance Checklist (NEW)

- [ ] Trial generation is isolated from registered-user generation modules.
- [ ] All trial service entry points follow `Trial*` naming.
- [ ] `public_trial` domain folder contains controllers/services/repositories/genkit/types.
- [ ] Express controllers are thin and call Trial-prefixed services.
- [ ] No Prisma trial-domain persistence is introduced.
- [ ] Firestore cache + TTL + lock regeneration behavior works per spec.
- [ ] Controlled errors include `traceId`.
