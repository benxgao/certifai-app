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

- Finalize rare-cert list in `trial-certs.json`
- Set up Pinecone index (`certifai-public-trial-v1`) and OpenAI embedding pipeline
- Backfill/index existing cert artifacts for the rare-cert list only
- Add per-cert `ragMode` controls: `off | gen_only | hybrid`

**Acceptance**:

- Only listed rare certs are eligible for trial
- Pinecone contains vectors for all listed certs
- Indexing can be re-run idempotently for a single cert

---

### Phase 2: Manual Generation with Retrieval Grounding (Week 1-2)

**Deliverables**:

- Upgrade `generateTrialQuestions.ts` to retrieve top-$k$ chunks from Pinecone before generation
- Persist citations/provenance for each generated trial question
- Keep manual trigger only (no scheduler)

**Acceptance**:

- Generation for listed cert includes citation metadata
- If retrieval fails, script exits clearly (or falls back only if `ragMode=off`)
- Cost + token + retrieval counts logged per run

---

### Phase 3: Public Trial API + Simple Visitor Activity Tracking (Week 2)

When a visitor starts a trial, we capture lightweight progress events so we know what they actually did.

**Deliverables**:

- `POST /api/public/certs/:slug/trial/start`
  - Creates `trialSessionId` (anonymous)
  - Records `trial_started`
- `POST /api/public/trial/:trialSessionId/event`
  - Records simple events: `question_viewed`, `answered`, `skipped`, `trial_completed`, `trial_exit`
- `GET /api/public/certs/:slug/trial-questions`
  - Uses cert `ragMode`
  - `hybrid`: DB questions + small Pinecone refinement under deterministic seed

**Minimal event payload**:

```json
{
  "event": "answered",
  "questionId": "q_123",
  "choice": "B",
  "isCorrect": false,
  "elapsedMs": 18000
}
```

**Acceptance**:

- New anonymous session created on trial start
- Events are append-only and queryable per session
- We can reconstruct basic funnel: started → answered count → completed/exited

---

### Phase 4: SEO Serving + Analytics Loop (Week 2-3)

**Deliverables**:

- Keep ISR + CDN cache for rare-cert pages only
- Add daily aggregation job from session events:
  - start rate
  - completion rate
  - avg questions answered
  - drop-off question index
- Feed metrics back into generation refresh priority

**Acceptance**:

- Public pages built only for rare-cert allowlist
- Trial funnel metrics available by cert slug
- Regeneration priority uses both SEO + trial engagement data

---

### Phase 5: Controlled Expansion (Ongoing)

- Expand cert list only when a rare cert proves traction or quality
- Continue RAG-first defaults for new certs
- Keep kill switch: force `ragMode=off` globally if quality/cost regress

---

## Cost Model (Rare-Cert + RAG-First)

| Scenario                                | Generation Cost | Runtime Cost/Month | Notes                              |
| --------------------------------------- | --------------- | ------------------ | ---------------------------------- |
| **Initial 5 rare certs (RAG grounded)** | ~$3-8           | $1-3               | Includes embeddings + generation   |
| **Add 1 rare cert**                     | ~$0.70-1.80     | ~$0                | Index + generate only for one cert |
| **Hybrid runtime for 5 certs**          | —               | $2-6               | Pinecone query cost + API overhead |
| **Visitor event tracking**              | —               | Low                | Minimal writes to existing infra   |

This is still significantly safer than 100+ automated generation and gives better learning signal per dollar.

---

## Data Architecture: Reuse + Additions

### Reuse (unchanged)

- **Prisma/Postgres**: source-of-truth for trial sets, sessions, and event logs
- **Firestore**: optional denormalized analytics snapshots
- **RTDB**: optional real-time progress counters

### Additions (RAG + tracking)

- **Pinecone** for retrieval index
- **OpenAI embeddings** for indexing pipeline
- **New entities (additive only)**:
  - Prisma: `TrialQuestionSet`, `TrialQuestionItem`, `RagGenerationRun`, `TrialSession`, `TrialSessionEvent`
  - Firestore: `rag_trial_metrics`, `public_trial_funnel_daily`

---

## Migration & Integration Notes

1. Schema-additive migrations only (nullable/default-safe)
2. Backfill Pinecone index for rare-cert list first (not all certs)
3. Roll out event tracking in parallel with current API (no breaking change)
4. Cut over cert-by-cert via allowlist + `ragMode`
5. Rollback: set global `PUBLIC_TRIAL_RAG_MODE=off`, keep serving cached DB sets

---

## Implementation Decisions (Updated)

| Decision           | Choice                                                 |
| ------------------ | ------------------------------------------------------ |
| Scope              | Rare-cert allowlist (5-12), not 100+                   |
| RAG priority       | High — starts in Phase 1 and persists across phases    |
| Generation trigger | Manual only                                            |
| Runtime retrieval  | Per-cert mode (`off`, `gen_only`, `hybrid`)            |
| Visitor tracking   | Anonymous `trialSessionId` + simple event stream       |
| Success signal     | SEO + trial funnel quality (start/completion/drop-off) |

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
