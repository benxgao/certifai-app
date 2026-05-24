# SEO Trial Generation with RAG-First Rollout

## Overview

Certifai cert detail pages for selected rare certifications need SEO optimization and dynamic trial question rotation to drive targeted organic traffic and better conversion intent. This document outlines a cost-effective, phased RAG strategy without exploding inference costs.

**Challenge**: Deliver high-quality trial experiences for a small rare-cert list while proving RAG value safely and incrementally.

**Solution**: Combine a **rare-cert allowlist**, **RAG-first phased implementation**, **manual-trigger generation** (no automated AI pipeline), and lightweight visitor activity tracking.

---

## Core Cost-Control Design Principles

### Config-File-Driven Trial Enablement

Only a curated list of rare certs should generate trial questions. A central config file (`trial-certs.config.ts` or `trial-certs.json`) explicitly lists which cert IDs/slugs are enabled for public trial content. This:

- Prevents runaway AI generation costs from bulk automation
- Lets you stage rollout (start with 5-12 rare certs, expand gradually)
- Makes enablement reviewable via git diff

**Example config** (`certifai-api/src/config/trial-certs.json`):

```json
{
  "enabled": ["hashicorp-terraform-associate", "cka", "cissp-issmp"],
  "defaultQuestionCount": 5,
  "rotationSets": 3,
  "defaultRagMode": "hybrid"
}
```

### Manual-Trigger Generation (No Automation)

AI content generation for trial questions is **never triggered automatically**. There is no scheduled job or event-driven pipeline. Instead:

- A CLI script or admin endpoint triggers generation per cert
- Engineer reviews output before it goes live
- Re-generation is explicit opt-in, not background automation

This eliminates the risk of accidental bulk regeneration (e.g., from a migration or re-deploy).

---

## Rare-Cert-First Strategy (Replace 100+ Scope)

Instead of scaling across 100+ certs, we will focus on a **small rare-cert target list** where SEO competition is lower and differentiation is higher.

### Targeting Rule

- Keep a curated allowlist of rare certs only (start with 5-12 certs)
- Selection criteria: lower search volume but high intent, weaker competitor content, clear exam blueprint
- Expansion is manual and evidence-driven (traffic + conversion + generation quality)

**Example config** (`certifai-api/src/config/trial-certs.json`):

```json
{
  "enabled": ["hashicorp-terraform-associate", "cka", "cissp-issmp"],
  "defaultQuestionCount": 5,
  "rotationSets": 3,
  "defaultRagMode": "hybrid",
  "certOverrides": {
    "cka": { "ragMode": "hybrid" },
    "cissp-issmp": { "ragMode": "gen_only" }
  }
}
```

---

## Recommended Delivery Plan (RAG-First, Mixed into Every Phase)

RAG is now high priority and integrated from the start, not deferred to late phases.

### Phase 1: Rare-Cert Allowlist + RAG Indexing Foundation (Week 1)

**Deliverables**:

- Finalize rare-cert list in `trial-certs.json` config (5-12 certs)
- Set up Pinecone index (`certifai-public-trial-v1`) with per-cert namespacesand OpenAI embedding pipeline
- Backfill/index existing cert artifacts for allowlisted certs only via `POST /api/admin/trial/index-cert`
- Add per-cert `ragMode` controls: `off | gen_only | hybrid`

**Data & Integration**: See [data-structure.md §2](./data-structure.md#2-pinecone-indexing-architecture) (Pinecone setup and indexing pipeline)

**API Design**: See [api-design.md §2.1-2.2](./api-design.md#21-list-allowed-trial-certs) (Admin config + indexing endpoints)

**Acceptance**:

- Only listed rare certs are eligible for trial (allowlist enforced at API level)
- Pinecone index contains vectors for all listed certs in separate namespaces
- Indexing can be re-run idempotently for a single cert (incremental updates work)
- Cost for backfill estimated and logged per cert

---

### Phase 2: Manual Generation with Retrieval Grounding (Week 1-2)

**Deliverables**:

- Implement admin CLI/endpoint: `POST /api/admin/trial/generate-questions`
- Upgrade to retrieve top-$k$ chunks from Pinecone before calling GPT
- Persist citations/provenance in `rag_sources` JSON field
- Admin can review before publishing (status: draft → published)

**API Design**: See [api-design.md §2.3](./api-design.md#23-generate-trial-questions)

**Acceptance**:

- Generation for listed cert includes citation metadata (source, relevance score)
- If retrieval fails, displays clear error; graceful fallback if `ragMode=off`
- Cost + token + retrieval counts logged per run in `RagGenerationRun`

---

### Phase 3: Public Trial API + Simple Visitor Activity Tracking (Week 2)

**Deliverables**:

- Implement public endpoints:
  - `POST /api/public/trial/visitor/init` — anonymous session init
  - `POST /api/public/trial/session/start` — start trial for cert
  - `POST /api/public/trial/session/:session_id/event` — record answer/skip/exit
  - `GET /api/public/trial/session/:session_id/summary` — final results
- Database tables: `TrialVisitor`, `TrialSession`, `TrialSessionEvent`
- Track event types: `question_viewed`, `answered`, `skipped`, `trial_completed`, `trial_exit`

**API Design**: See [api-design.md §1](./api-design.md#1-public-trial-endpoints) (Public Trial Endpoints)

**Acceptance**:

- New anonymous session created on `visitor/init` (no auth, no PII)
- Events are append-only and queryable per session
- Can reconstruct basic funnel: started → answered → completed/exited
- Visitor data completely isolated from user data (separate tables, zero FK)

---

### Phase 4: SEO Serving + Analytics Loop (Week 2-3)

**Deliverables**:

- Enable ISR + CDN cache for rare-cert pages only
- Add daily aggregation job: `POST /api/internal/trial/metrics/aggregate-daily`
- Implement admin analytics endpoint: `GET /api/admin/trial/analytics`
- Compute metrics: start rate, completion rate, avg questions answered, drop-off analysis
- Feed metrics back into generation refresh priority

**API Design**: See [api-design.md §2.6](./api-design.md#26-view-trial-analytics) (Admin Analytics) and [api-design.md §3.2](./api-design.md#32-aggregate-daily-metrics-cron-job) (Aggregation Job)

**Acceptance**:

- Public pages built only for rare-cert allowlist
- Trial funnel metrics available by cert slug via admin dashboard
- Regeneration priority uses both SEO ranking + trial engagement data
- Nightly aggregation populates Firestore `public_trial/daily_metrics/{cert_slug}/{date}`

---

### Phase 5: Controlled Expansion (Ongoing)

- Expand cert list only when a rare cert proves traction or quality
- Continue RAG-first defaults for new certs
- Keep kill switch: force `ragMode=off` globally if quality/cost regress

---

## Cost Model (Rare-Cert + RAG-First)

| Scenario                                 | Embedding Cost | Generation Cost | Retrieval Cost | Total/Month    |
| ---------------------------------------- | -------------- | --------------- | -------------- | -------------- |
| **Initial 5 rare certs (backfill only)** | $5–10          | $0              | $0             | $5–10          |
| **Monthly: 1 generation run per cert**   | $2–3           | $7.50–15        | $2–5           | $11.50–23      |
| **Monthly: 5 cert runtimes (visitors)**  | —              | —               | $3–8           | $3–8           |
| **Add 1 new rare cert**                  | $2             | —               | —              | $2 (amortized) |

**Cost Assumptions** ([detailed in data-structure.md §3](./data-structure.md#3-openai-integration)):

- OpenAI embeddings (`text-embedding-3-small`): $0.02 per 1M tokens
- OpenAI generation (`gpt-4o-mini`): ~$0.03–0.06 per question
- Pinecone serverless: ~$0.001 per query, ~$1/month base + usage
- Initial cert artifacts: 50K–100K tokens = $1–2 per cert

**Rollout commitment**: Stay under $100/month for first 12 certs (pilot phase)

---

## Reference Documentation

- **Full API Specifications** (endpoints, payloads, auth): [api-design.md](./api-design.md)
- **Complete Data Schema** (Prisma, Pinecone, migrations, queries): [data-structure.md](./data-structure.md)
- **Backend Architecture Context**: [../../../docs/architecture/database-design.md](../../../docs/architecture/database-design.md)

---

## Data Architecture (Visitor Isolation + Infrastructure Reuse)

**See [data-structure.md](./data-structure.md) for complete details: exact schema, migration SQL, Pinecone/OpenAI integration, query patterns, and monitoring.**

### Core Principle: Visitor ≠ User

Public trial visitors are **never** created as `User` records. They remain completely anonymous, ensuring zero pollution of authenticated user tables, zero PII without explicit signup, and clean API/auth separation.

### Three-Layer Data Model

**Layer 1 — Authenticated Users** (unchanged):

- Tables: `User`, `ExamAttempt`, `ExamUserAnswer`, `UserCertification`
- API: `/api/users/...` (requires auth)
- Zero changes from trial system

**Layer 2 — Public Trial Visitors** (new, isolated):

- Tables: `TrialVisitor`, `TrialSession`, `TrialSessionEvent`, `TrialQuestionSet`, `TrialQuestionItem`
- API: `/api/public/trial/...` (no auth required)
- Zero foreign keys to user tables
- Anonymous identity via IP:UA hash

**Layer 3 — External Services**:

- Pinecone: RAG retrieval index (separate namespaces per cert)
- OpenAI: Content generation (admin-triggered, no user data)

### Conversion Path: Visitor → User

When visitor signs up:

- Create new `User` record (separate from trial data)
- Visitor's trial sessions remain in `TrialSession` (for analytics)
- New authenticated exams use `ExamAttempt` (separate from trial)

## Migration & Integration Notes

**See [data-structure.md](./data-structure.md) for complete schema, queries, and implementation details.**

### Migration Strategy

1. **Schema-additive migrations only** (nullable/default-safe)
   - All new tables (`TrialVisitor`, `TrialSession`, `TrialSessionEvent`, etc.) have **zero foreign keys to `User`, `ExamAttempt`, or `UserCertification`**
   - Existing user data is never touched
   - Rollback: drop new tables; existing user data remains intact

2. **Backfill Protocol** (manual, per-cert)
   - Run indexing script per rare cert: `node scripts/indexPinecone.ts --cert-slug cka`
   - Pinecone gets separate namespaces per cert: `cert_{cert_id}_{cert_slug}`
   - Cost audited before publication (estimate shown to admin)

3. **Event tracking parallel rollout**
   - TrialSession/TrialSessionEvent tables are write-only from new `/api/public/trial/*` endpoints
   - No interference with existing `/api/users/exams/*` endpoints
   - Both can coexist indefinitely

4. **Cert-by-cert activation**
   - Add cert to `trial-certs.json` allowlist
   - Generate questions (manual trigger)
   - Mark `TrialQuestionSet.status = 'published'`
   - Frontend shows trial on public cert page
   - Admin can unpublish without code changes (status toggle)

5. **Rollback & Kill Switches**
   - Global RAG: Set `RAG_ENABLED=false` env var (disables all generation/retrieval)
   - Per-cert cutover: Set `trial-certs.json` `ragMode = 'off'` for problematic certs
   - Visitor data: Always independent; can be archived after 90 days or by manual cleanup
   - User data: Never modified by trial system

---

## Data Architecture Summary (Visitor Isolation)

**Three Core Principles**:

1. **Visitor ≠ User**: Public trial visitors are never created as `User` records. They remain completely anonymous.
2. **Schema Isolation**: New `Trial*` tables have no foreign keys to user-owned tables (`User`, `ExamAttempt`, `ExamUserAnswer`).
3. **Infrastructure Reuse**: PostgreSQL, Firestore, RTDB are reused for visitor aggregates; Pinecone/OpenAI are new external services for RAG only.

### Visitor Ecosystem

- `TrialVisitor`: Anonymous fingerprint (IP:UA hash), no PII
- `TrialSession`: Visitor + cert + metrics (no user link)
- `TrialSessionEvent`: Append-only event stream (views, answers, skips)
- `TrialQuestionSet`, `TrialQuestionItem`: Generated content (no user data)
- `RagGenerationRun`, `RagRetrievalChunk`: RAG audit trail (not user-specific)

### Authenticated User Ecosystem (Unchanged)

- `User`, `ExamAttempt`, `ExamUserAnswer`, `UserCertification`
- Zero changes; zero interference from trial system
- Separate API paths (`/api/users/...` requires auth)

### Isolation Verification

- Run periodic queries (SQL in data-structure.md §6) to verify no contamination
- Foreign key relationships audit (should return empty)
- Data contamination check (should return 0)

---

## Migration & Integration Strategy

**See [data-structure.md §1](./data-structure.md#1-prisma-schema-additions-postgresql) for exact schema and migration SQL.**

### Key Implementation Patterns

1. **Schema-additive only**: New `Trial*` tables; zero FKs to user/exam tables; existing data untouched
2. **Separate Pinecone namespaces**: Per-cert namespace (`cert_{cert_id}_{cert_slug}`) for isolation and cost tracking
3. **Manual-trigger generation**: Admin CLI/endpoint controls all RAG work; no scheduled jobs
4. **Parallel API routes**: `/api/public/trial/...` (no auth) coexists with `/api/users/exams/...` (requires auth)
5. **Fast rollback**: Toggle features via config (< 5 min, no code deploy needed)

### Cert-by-Cert Activation

1. Add cert to `trial-certs.json` allowlist
2. Run indexing: `node scripts/indexPinecone.ts --cert-slug cka` → backfills Pinecone
3. Generate questions: `POST /api/admin/trial/generate-questions` → creates `TrialQuestionSet` (draft)
4. Review & publish: Update set status to `published`
5. Frontend displays trial on public cert page

### Kill Switches

- **Global**: Set `RAG_ENABLED=false` env var (disables all generation/retrieval, no code deploy)
- **Per-cert**: Set `trial-certs.json` `ragMode = 'off'` for problematic cert (immediate effect)
- **Data cleanup**: Visitor data auto-deletes after 90 days; user data never modified

---

| Decision           | Choice                                                              |
| ------------------ | ------------------------------------------------------------------- |
| Scope              | Rare-cert allowlist (5-12), not 100+                                |
| RAG priority       | High — starts in Phase 1 and persists across phases                 |
| Generation trigger | Manual only (no scheduled background jobs)                          |
| Runtime retrieval  | Pre-generation (all RAG at admin time); zero RAG at visitor runtime |
| Visitor identity   | Anonymous token (IP:UA hash), never converted to `User` record      |
| Data storage       | PostgreSQL (separate `Trial*` tables), zero FK to user tables       |
| Visitor retention  | 90 days auto-delete (configurable)                                  |
| Success signal     | SEO traffic + trial funnel quality (start/completion/drop-off)      |
| Rollback speed     | < 5 min (toggle `trial-certs.json`, no deploy needed)               |

---

## AI-Oriented Phased-Rollout Plan Instruction

This section defines how execution should start when you ask to implement a specific phase.

### Trigger Rule

When user input contains:

- `implement phase 1`
- `implement phase 2`
- `implement phase <n>`

the first action is to create a phase rollout plan document in:

- `kanban/backlogs/`

before any implementation edits.

### Required Output Artifact

- File naming convention:
  - `kanban/backlogs/public-trial-rag-phase-0<n>-rollout.md`
  - Example: `kanban/backlogs/public-trial-rag-phase-01-rollout.md`

### Rollout Plan Template (Minimum)

Each phase rollout file must include:

1. **Objective** (single-phase goal)
2. **In Scope / Out of Scope**
3. **Dependencies** (services, env vars, data contracts)
4. **Implementation Steps** (checklist)
5. **Acceptance Checks** (verifiable evidence)
6. **Rollback Plan**
7. **Open Questions**
8. **Handoff Notes** (what next phase must know)

### Operational Rules

- Keep each rollout plan phase-specific (do not combine multiple phases in one file)
- Update plan status as work proceeds (`not started`, `in progress`, `completed`, `blocked`)
- Record key decisions and assumptions directly in the rollout file
- If `kanban/backlogs/` does not exist, create it first

### Mapping to This Document

- `implement phase 1` → create plan for **Phase 1: Rare-Cert Allowlist + RAG Indexing Foundation**
- `implement phase 2` → create plan for **Phase 2: Manual Generation with Retrieval Grounding**
- `implement phase 3` → create plan for **Phase 3: Public Trial API + Visitor Activity Tracking**
- `implement phase 4` → create plan for **Phase 4: SEO Serving + Analytics Loop**
- `implement phase 5` → create plan for **Phase 5: Controlled Expansion**

---

## Next Steps

1. Finalize rare-cert allowlist and add `ragMode` defaults
2. Implement Pinecone/OpenAI indexing for allowlisted certs only
3. Upgrade manual generation script to retrieval-grounded mode
4. Add trial session start + event ingestion endpoints
5. Add daily funnel aggregation and cert-level reporting
6. Launch first 3-5 rare-cert pages and review metrics before expansion
