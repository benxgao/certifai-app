# Executive Report: Canonical Docs Migration for Engineering

**Date:** 2026-05-25
**Audience:** Engineering (Frontend, Backend, Platform, DX)
**Scope:** Documentation architecture and AI retrieval reliability (no runtime code changes)

## Executive Summary

This rollout successfully migrated critical operational knowledge from `doc_archived/` into canonical, domain-owned documentation under `docs/`, then aligned AI navigation so assistants and engineers can reliably retrieve the right context during implementation and debugging.

The core engineering outcome: **we eliminated split-brain documentation for auth/signup/marketing workflows and established a cleaner source-of-truth model**.

---

## Why this mattered

Before this effort, high-value workflow details were trapped in out-of-tree docs (`doc_archived/signin.md`, `doc_archived/signup.md`, `doc_archived/marketing.md`). That created three practical engineering risks:

1. **Low retrieval reliability** for assistant-supported debugging.
2. **Drift risk** from duplicate guidance across archived vs canonical docs.
3. **Operational ambiguity** about where future updates should land.

---

## What was delivered

### 1) Canonical workflow docs created

- `docs/security/signin-workflow.md`
- `docs/security/signup-workflow.md`
- `docs/api/marketing-subscription-workflow.md`

These now hold deep, procedural content (state transitions, lifecycle sequencing, edge cases, troubleshooting, monitoring, and testing guidance).

### 2) Parent docs re-scoped to invariants

- `docs/security/auth-patterns.md`
- `docs/api/api-connection.md`

Parent docs now stay concise and invariant-focused, with links to deeper workflow docs instead of duplicating step-by-step details.

### 3) AI navigation and retrieval updated

- `docs/ai/assistant-context-index.md`
- `docs/ai/guide.md`

New workflow docs are indexed and routable for assistant task selection.

### 4) Legacy archive sources retired

- Removed: `doc_archived/signin.md`, `doc_archived/signup.md`, `doc_archived/marketing.md`

Decision finalized: **fully remove archived copies** to prevent future divergence.

---

## Engineering Outcomes

### ✅ Outcome 1: Single source of truth for critical workflows

Auth and marketing workflow knowledge is now domain-aligned under `docs/security/` and `docs/api/`, reducing ambiguity during incident response and feature changes.

### ✅ Outcome 2: Better assistant-first debugging quality

By indexing the new docs in `assistant-context-index.md` and routing via `guide.md`, likely prompt-to-doc matching is significantly improved for:

- signup verification stuck states
- signin token/session edge cases
- marketing subscription pipeline debugging

### ✅ Outcome 3: Lower maintenance overhead and drift

The “invariants in parent docs / procedures in workflow docs” layering model provides clear ownership boundaries and lowers the chance of contradictory updates.

### ✅ Outcome 4: Verified migration completeness

Migration included explicit verification checkpoints across all phases, including:

- heading coverage mapping for archived docs
- metadata presence checks (`Source of truth`, `Last reviewed`, `Owner`)
- placeholder scans (`TODO|FIXME|TBD`)
- archive-reference checks to ensure no stale links

---

## Improvements Introduced (Process + Architecture)

1. **Documentation layering contract (practical, enforced by structure)**
   - Parent docs: invariants and guardrails
   - Workflow docs: lifecycle, timeline, troubleshooting

2. **Canonical-by-domain placement**
   - Security workflows under `docs/security/`
   - Marketing/API workflow under `docs/api/`

3. **Index-first discoverability discipline**
   - New docs are not considered complete until indexed in AI navigation docs.

4. **Verification-gate rollout model**
   - Each phase closed only after independent checks, reducing hidden migration debt.

---

## Delivered File Changes (High-level)

### Created

- `docs/security/signin-workflow.md`
- `docs/security/signup-workflow.md`
- `docs/api/marketing-subscription-workflow.md`
- `ai_oriented_kanban/20-active/260525-improve-ai-raedy-docs.md` (follow-up rollout)

### Updated

- `docs/security/auth-patterns.md`
- `docs/api/api-connection.md`
- `docs/ai/assistant-context-index.md`
- `docs/ai/guide.md`
- `ai_oriented_kanban/30-review/260525-review-docs-as-code-app.md` (this executive report conversion)

### Removed

- `doc_archived/signin.md`
- `doc_archived/signup.md`
- `doc_archived/marketing.md`

---

## Remaining Gaps and Next Engineering Actions

Follow-up execution plan already created in:

- `ai_oriented_kanban/20-active/260525-improve-ai-raedy-docs.md`

Priority actions for engineering process hardening:

1. Add explicit docs layering contract to `docs/operations/docs-maintenance.md`.
2. Add a “new-doc registration” checklist (index + guide + metadata requirements).
3. Introduce manual AI retrieval smoke tests for key prompts.
4. Add recurring docs topology reviews (quarterly) to catch drift early.

---

## Final Status for Engineering Leadership

- **Rollout status:** Completed (Phases 1–7 closed with verification)
- **Risk posture:** Improved (duplicate-source risk substantially reduced)
- **Operational impact:** Positive for onboarding, troubleshooting, and assistant-supported implementation
- **Code/runtime impact:** None (documentation-only change)

In short: we moved from “important knowledge exists, but hard to reliably find” to “important knowledge is canonical, indexed, and operationally maintainable.”
