# RAG-Powered Public Trial System — Documentation Index

This index guides you through the three complementary documentation files that define the complete system design.

---

## Document Organization

### 1. **rollout-plan.md** (399 lines) — High-Level Strategy & Roadmap

**Best for**: Product managers, stakeholders, implementation planning

**Contains**:

- ✓ Overview and business justification
- ✓ Core cost-control design principles
- ✓ Rare-cert-first strategy (5-12 certs, not 100+)
- ✓ 5-phase delivery roadmap with high-level acceptance criteria
- ✓ Cost model and budget estimates
- ✓ Implementation decisions table
- ✓ Phased-rollout plan instructions

**What it delegates to other docs**:

- Specific API endpoints → [api-design.md](./api-design.md)
- Exact database schema → [data-structure.md](./data-structure.md)
- Detailed migration SQL → [data-structure.md §1.3](./data-structure.md#13-migration-file-content)

**Key Sections**:

- [Core Cost-Control Design Principles](#core-cost-control-design-principles)
- [Recommended Delivery Plan (Phase 1-5)](#recommended-delivery-plan-rag-first-mixed-into-every-phase)
- [Implementation Decisions](#implementation-decisions-updated)

---

### 2. **data-structure.md** (1,078 lines) — Database & Infrastructure Design

**Best for**: Backend engineers, database architects, DevOps

**Contains**:

- ✓ Complete Prisma schema additions (8 new tables with JSDoc)
- ✓ Exact migration file naming and SQL content (copy-paste ready)
- ✓ Pinecone indexing architecture (namespacingindex config, vector metadata schema)
- ✓ Backfill & incremental update procedures
- ✓ Retrieval strategy (query patterns) with Python pseudocode
- ✓ OpenAI integration (embedding model config, generation system prompt)
- ✓ Cost controls and kill switches
- ✓ Data flow diagrams (indexing, generation, visitor flows)
- ✓ Query patterns with exact SQL samples
- ✓ Isolation verification queries (prevent user data contamination)
- ✓ Analytics SQL patterns (visitor funnels, drop-off analysis)
- ✓ Implementation sequence (step-by-step)
- ✓ Monitoring & alerts (metrics, logging format)

**Three Core Principles**:

1. **Visitor ≠ User**: Public trial visitors never become `User` records
2. **Schema Isolation**: New `Trial*` tables have zero FKs to user/exam tables
3. **Infrastructure Reuse**: PostgreSQL, Firestore, RTDB for aggregates; Pinecone/OpenAI external only

**Key Sections**:

- [§1: Prisma Schema Additions](./data-structure.md#1-prisma-schema-additions-postgresql)
- [§2: Pinecone Indexing Architecture](./data-structure.md#2-pinecone-indexing-architecture)
- [§3: OpenAI Integration](./data-structure.md#3-openai-integration)
- [§5: Query Patterns & Analytics](./data-structure.md#5-query-patterns--analytics)
- [§6: Isolation Verification Queries](./data-structure.md#6-isolation-verification-queries)

---

### 3. **api-design.md** (701 lines) — REST API Specification

**Best for**: Frontend engineers, API consumers, integration partners

**Contains**:

- ✓ Public Trial Endpoints (no auth):
  - `POST /api/public/trial/visitor/init` — create anonymous visitor
  - `POST /api/public/trial/session/start` — start trial for cert
  - `POST /api/public/trial/session/:session_id/event` — answer/skip/exit
  - `GET /api/public/trial/session/:session_id/questions` — pagination
  - `GET /api/public/trial/session/:session_id/summary` — final results
- ✓ Admin RAG Management Endpoints (auth + admin role):
  - `GET /api/admin/trial/config` — list enabled certs
  - `POST /api/admin/trial/index-cert` — trigger Pinecone indexing
  - `POST /api/admin/trial/generate-questions` — trigger generation with RAG
  - `PATCH /api/admin/trial/question-set/:set_id` — publish/archive
  - `GET /api/admin/trial/rag-runs` — audit log
  - `GET /api/admin/trial/analytics` — visitor funnel metrics
- ✓ Internal Analytics Endpoints (service auth):
  - `POST /api/internal/trial/metrics/aggregate-daily` — nightly aggregation
  - `POST /api/internal/trial/cleanup/expired-visitors` — data retention
- ✓ Complete request/response payloads with examples
- ✓ Error handling and status codes
- ✓ Authentication & authorization rules
- ✓ Rate limiting headers
- ✓ Implementation checklist by phase

**Key Sections**:

- [§1: Public Trial Endpoints](./api-design.md#1-public-trial-endpoints)
- [§2: Admin RAG Management Endpoints](./api-design.md#2-admin-rag-management-endpoints)
- [§3: Internal Analytics Endpoints](./api-design.md#3-internal-analytics-endpoints)
- [§4: Data Contracts & Error Responses](./api-design.md#4-data-contracts--error-responses)
- [§6: Implementation Checklist](./api-design.md#6-implementation-checklist)

---

## How to Use These Docs

### If you're planning the rollout:

1. Read **rollout-plan.md** overview + phases to understand strategy
2. Reference cost table for budgeting
3. Check implementation decisions table for high-level architecture choices
4. Use "AI-Oriented Phased-Rollout Plan Instruction" to trigger phase-specific execution

### If you're building the backend:

1. Read **data-structure.md** to understand full data model
2. Copy migration SQL from **§1.3** into `functions/prisma/migrations/`
3. Implement Pinecone setup from **§2** (namespace strategy, config, backfill procedure)
4. Reference **api-design.md §2** for endpoint signatures
5. Use query patterns from **data-structure.md §5** for analytics

### If you're building the frontend:

1. Read **api-design.md §1** for public endpoint specs
2. Understand anonymous visitor flow: `visitor/init` → `session/start` → `event` → `summary`
3. Check error codes and rate limiting headers from **§4**
4. Implement cookie-based `trial_visitor_id` persistence (HttpOnly)

### If you're doing operational work (admin features):

1. Reference **api-design.md §2** for admin endpoints
2. Follow steps in **rollout-plan.md** Migration & Integration Strategy
3. Use **data-structure.md** cost tracking queries to audit RAG spending
4. Implement nightly aggregation job from **api-design.md §3.2**

### If you need monitoring/debugging:

1. Use **data-structure.md §6** isolation verification queries (weekly audit)
2. Check **data-structure.md §8** monitoring & alerts table
3. Reference **api-design.md §4** error codes when debugging issues

---

## Document Cross-References

### rollout-plan.md → others

- Phase 1 Pinecone setup → [data-structure.md §2](./data-structure.md#2-pinecone-indexing-architecture)
- Phase 2 generation endpoint → [api-design.md §2.3](./api-design.md#23-generate-trial-questions)
- Phase 3 public API → [api-design.md §1](./api-design.md#1-public-trial-endpoints)
- Phase 4 analytics → [api-design.md §2.6](./api-design.md#26-view-trial-analytics)
- Cost model → [data-structure.md §3.1-3.3](./data-structure.md#3-openai-integration)

### api-design.md → others

- Data model for requests/responses → [data-structure.md §1.2](./data-structure.md#12-full-schema-definition)
- Pinecone namespace strategy → [data-structure.md §2.2](./data-structure.md#22-namespace-strategy)
- Query isolation patterns → [data-structure.md §5.1](./data-structure.md#51-funnel-query-visitor-session-analytics)

### data-structure.md → others

- Migration SQL integration → Phase 1 rollout-plan.md
- Admin endpoints for generation/indexing → [api-design.md §2](./api-design.md#2-admin-rag-management-endpoints)
- Query patterns for analytics → [api-design.md §2.6](./api-design.md#26-view-trial-analytics)

---

## Key Design Decisions Summary

| Aspect           | Choice                                                   | Reference                                                                       |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Scope            | 5-12 rare certs (allowlist), not 100+                    | [rollout-plan.md](./rollout-plan.md#rare-cert-first-strategy-replace-100-scope) |
| Data Isolation   | Visitor ≠ User (separate tables, zero FK)                | [data-structure.md](./data-structure.md#core-principle-visitor--user)           |
| Admin Workflow   | Manual triggers only (no scheduled jobs)                 | [api-design.md §2.2](./api-design.md#22-trigger-pinecone-indexing)              |
| RAG at Runtime   | Pre-generation (admin-time), zero visitor-time RAG calls | [api-design.md §1.2](./api-design.md#12-start-trial-for-cert)                   |
| Visitor Identity | Anonymous token (IP:UA hash), HttpOnly cookie            | [data-structure.md](./data-structure.md#lightweight-anonymous-id)               |
| Cost Controls    | Per-cert Pinecone namespaces, kill switches              | [rollout-plan.md](./rollout-plan.md#kill-switches)                              |
| Rollback Time    | < 5 min (config toggle, no code deploy)                  | [rollout-plan.md](./rollout-plan.md#kill-switches)                              |

---

## Delivery Phases at a Glance

| Phase | Duration | Focus                      | API Endpoints                              | Database Tables                                     |
| ----- | -------- | -------------------------- | ------------------------------------------ | --------------------------------------------------- |
| **0** | —        | Feature flag + logging     | —                                          | —                                                   |
| **1** | Week 1   | Pinecone setup & indexing  | `GET /api/admin/trial/config`              | `RagGenerationRun`                                  |
| **2** | Week 1-2 | Manual generation with RAG | `POST /api/admin/trial/generate-questions` | `TrialQuestionSet`, `TrialQuestionItem`             |
| **3** | Week 2   | Public trial API           | `POST /api/public/trial/*`, events         | `TrialVisitor`, `TrialSession`, `TrialSessionEvent` |
| **4** | Week 2-3 | Analytics & aggregation    | `GET /api/admin/trial/analytics` + cron    | Firestore `public_trial/*`                          |
| **5** | Ongoing  | Expansion & monitoring     | Same as phases 1-4                         | Same as phases 1-4                                  |

---

## Files in This Directory

```
rag-empowered-seo/
  rollout-plan.md              (← You are here) High-level strategy
  data-structure.md            ← Database & Pinecone design
  api-design.md                ← REST API specifications
  DOCUMENTATION_INDEX.md       ← This file
```

---

## Next Steps

1. **For immediate execution**: Read [rollout-plan.md](./rollout-plan.md) phases 1-3
2. **For implementation**: Start with [data-structure.md §1](./data-structure.md#1-prisma-schema-additions-postgresql) (schema) and [api-design.md §2.1-2.2](./api-design.md#21-list-allowed-trial-certs) (admin endpoints)
3. **For frontend integration**: Jump to [api-design.md §1](./api-design.md#1-public-trial-endpoints) (public endpoints)
4. **For cost tracking & monitoring**: Reference [data-structure.md §5.3](./data-structure.md#53-cost-auditing) (audit queries)

---

_Last updated: 2026-05-13_
_Status: Ready for Phase 1 implementation_
