Spec-Driven Development in Open Source: Traditional SDD and Spec-First AI-Oriented Kanban

## Introduction

Spec-Driven Development (SDD) has become a recognizable pattern in AI-assisted software delivery. In open source, it helps address recurring issues: context drift, undocumented assumptions, and uneven contributor handoffs.

At the same time, many mainstream SDD implementations are intentionally linear and phase-gated. That works well for single-threaded feature work, but open-source projects often operate with parallel tasks, asynchronous contributor availability, and long-lived backlogs.

This post compares two approaches in that context:

- **Traditional SDD** (phase-gated, CLI-centered workflows)
- **Spec-First AI-Oriented Kanban** (spec gate + parallel board operations)

My goal is not to declare a winner, but to provide a fair operating guide based on how teams are practicing these methods today.

## What Community Adoption Looks Like Right Now

From current open-source patterns, adoption usually clusters into three practical tiers:

1. **Lightweight spec-first (common in smaller repos)**
   - Minimal Markdown specs, low formal gating, fast iteration.
2. **Standard phased SDD (common in growing teams)**
   - Formal requirement/spec/plan/implementation stages, usually tool-enforced.
3. **Spec-as-system-of-record (common in compliance-heavy projects)**
   - Specs drive code, tests, and docs with strict synchronization expectations.

These tiers are directional, not absolute. Most projects are hybrids in practice.

## Core Workflow Differences

### Traditional SDD

A serial flow generally follows:

1. Requirement draft
2. Spec formalization and review
3. Architecture planning
4. Task breakdown
5. Implementation
6. Merge/release review

Strength: focused, disciplined progression for one feature at a time.

### Spec-First AI-Oriented Kanban

A parallel board flow generally follows:

Backlog → Spec Review (hard gate) → Planning → Implementation → Code Review → Validation → Archive

Strength: concurrent visibility across many cards while preserving spec discipline per card.

## Comparative Assessment

### Where Spec-First Kanban Often Excels

1. **Parallel contributor coordination**
   - Better visibility for maintainers triaging multiple in-flight items.
2. **Context reuse for AI sessions**
   - Card-level specs reduce re-deriving context from scratch.
3. **Operational transparency**
   - Bottlenecks become visible at lane level (spec review, QA, merge queue).
4. **Contributor onboarding**
   - Public, standardized card templates reduce ambiguity for external PRs.

### Where Spec-First Kanban Can Struggle

1. **Initial setup complexity**
   - Templates, automation, and board conventions take effort to tune.
2. **Review bandwidth pressure**
   - Parallel spec inflow can overload maintainers.
3. **Integration overhead**
   - Boards, CI checks, and AI assistants may drift without stewardship.

### Where Traditional SDD Still Has Strong Advantages

1. **Tight end-to-end tooling**
   - Single-tool workflows can be easier to adopt quickly.
2. **Hard compliance gates**
   - CLI-enforced phase transitions reduce process bypass risk.
3. **Deep-focus execution**
   - Serial development helps with high-risk core-module refactors.

### Where Traditional SDD Is Weaker in Open Source

1. **Limited parallel throughput** for community-heavy repos.
2. **Uniform process burden** across tiny and large tasks.
3. **Weaker backlog visualization** compared with board-based operations.
4. **Higher onboarding friction** for occasional external contributors.

## My Perspective on What Works Best by Project Type

### Small solo repositories

Use lightweight SDD: short specs + implementation notes. Keep ceremony minimal.

### Mid/large community projects

Use Spec-First Kanban as the primary operating model, with a hard spec-review lane and clear contributor templates.

### Compliance-critical infrastructure

Use a hybrid: board-based coordination for throughput, plus strict phased SDD gates for high-risk/core modules.

## Forward-Looking Recommendations (2026+)

Based on current ecosystem behavior, these upgrades are likely high impact:

1. **Tiered spec templates**
   - Different templates for hotfixes, standard features, and architectural changes.
2. **Pre-review automation**
   - Spec linters and lightweight AI checks for ambiguity/incompleteness before human review.
3. **One-click board scaffolding**
   - Lower setup friction for maintainers launching spec-first workflows.
4. **Contributor-friendly web editors**
   - Reduce dependency on local CLI setup for first-time contributors.
5. **Indexed spec libraries**
   - Reuse proven constraints and acceptance criteria across future cards.

## Conclusion

Traditional SDD and Spec-First Kanban solve different coordination problems.

- Traditional SDD is excellent for disciplined, linear delivery.
- Spec-First Kanban is excellent for parallel, community-driven delivery.

My opinion is that open-source teams should choose based on contributor topology, not methodology branding. In most active community projects, a hybrid model—spec gate discipline with kanban-level parallelism—offers the most practical balance between speed, quality, and maintainability.
