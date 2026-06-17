# Spec-First AI Kanban: Product-Focused Open-Source Strategy

## Governance Infrastructure for AI-Native Software Teams

---

## 1. Executive Summary

**Product**: `spec-kanban` — a git-native governance system for AI-assisted and autonomous engineering workflows

**Positioning**: _"The missing governance layer between AI coding tools and software delivery outcomes."_

**Primary users**: open-source maintainers, startup engineering teams, and compliance-minded technical leads

**Core thesis**:
AI tools accelerate implementation, but most teams still lack a durable way to preserve intent, decisions, and rollout context. `spec-kanban` addresses this with structured templates, a protocol contract, and workflow integrations that make governance lightweight enough for daily use.

**Success definition**:
Teams can consistently answer three questions for any AI-generated change:

1. Why did we do this?
2. Which sources of truth justified the decision?
3. Can another engineer (or agent) replay the rollout from docs alone?

---

## 2. Problem & Opportunity

### 2.1 The Missing Layer in AI Engineering Stacks

| Layer          | Typical Tools                          | Persistent Gap                               |
| -------------- | -------------------------------------- | -------------------------------------------- |
| **Execution**  | Cursor, Claude Code, Devin, Copilot    | Fast output, weak alignment memory           |
| **Safety**     | Guardrails, policy filters, evals      | Rule enforcement without contextual intent   |
| **Governance** | Jira/Linear + ad-hoc docs + tribal ops | No standard protocol for AI-era traceability |

### 2.2 Core Pain Patterns

1. **Session Context Loss**: each AI cycle re-learns product/architecture context
2. **Decision Drift**: rationale gets detached from implementation over time
3. **Parallel Agent Collision**: multiple contributors optimize locally, misalign globally
4. **Audit Friction**: evidence trails are reconstructed after incidents instead of built in

### 2.3 Why This Is a Good OSS Wedge

- Governance conventions are highly reusable and benefit from community standardization
- Markdown + Git lowers adoption barriers and encourages contribution
- Protocol-first products gain defensibility through trust and repeatable outcomes, not lock-in

---

## 3. Product Definition (Feature-Centric)

### 3.1 Product Surface

```
spec-kanban/
├── templates/
│   ├── tiers/
│   │   ├── lightweight/
│   │   └── standard/
│   ├── kanban-lanes/
│   │   ├── 4-lane-minimal.md
│   │   └── 6-lane-complete.md
│   └── card-templates/
│       ├── feature-spec.md
│       ├── hotfix-spec.md
│       └── adr-template.md
├── protocol/
│   └── spec-first-protocol.md
└── integrations/
     ├── github/
     │   ├── issue-templates/
     │   ├── pr-checklist.md
     │   └── validation-workflows/
     └── vscode/
          └── snippets.json
```

### 3.2 Core Product Features

#### A) Spec Cards as Operational Units

- Moves from generic task tickets to **decision-aware delivery cards**
- Requires pre-implementation doc references (not just acceptance criteria)
- Captures "same-rollout remediation" when implementation discovers undocumented constraints

#### B) 6-Rule Protocol Contract (Core IP)

1. Docs-First Mandate
2. Docs Needed Declaration
3. Decision Evidence Log
4. Controlled Fallback Scans
5. Same-Rollout Remediation
6. Docs-Only Simulation Gate

#### C) Governance-by-Default Integrations

- PR checklist enforces spec linkage and evidence completion
- Issue templates scaffold spec-first intake
- Editor snippets reduce authoring friction for cards and ADR links

#### D) Tiered Adoption Model

- **Lightweight**: minimal lanes + minimal ceremony for solo/small teams
- **Standard**: full evidence and remediation flow for multi-contributor repos
- Teams can start simple and scale rigor progressively

### 3.3 User Outcomes (What Improves in Practice)

| Outcome                 | Baseline (Without spec-kanban) | With spec-kanban                          |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| PR review clarity       | Reviewer asks "why" repeatedly | Rationale and evidence attached up front  |
| Onboarding speed        | Tribal context transfer        | Reconstructable decision trail from docs  |
| AI agent consistency    | Prompt-dependent behavior      | Protocol-constrained execution behavior   |
| Incident retrospectives | Forensic, after-the-fact       | Built-in traceability across cards + ADRs |
| Compliance readiness    | Retroactive artifacts          | Continuous evidence collection            |

---

## 4. Differentiation & Positioning

### 4.1 Against Existing Alternatives

| Alternative                        | Strength                   | Limitation vs `spec-kanban`                      |
| ---------------------------------- | -------------------------- | ------------------------------------------------ |
| Cursor + GitHub Projects           | Fast implementation flow   | Weak governance memory and decision traceability |
| Linear/Jira                        | Strong task management     | Not AI-native, no docs-first behavioral contract |
| ADR-only workflows                 | Good architectural history | Weak linkage to day-to-day execution             |
| Custom internal markdown templates | Flexible for one team      | Hard to standardize, share, and evolve at scale  |

### 4.2 Positioning Message

`spec-kanban` is not a PM replacement. It is a **governance substrate** that plugs into your existing Git workflow and makes autonomous execution auditable and collaborative.

### 4.3 Messaging Soundbites

- **"Execution tools write code; spec-kanban preserves intent."**
- **"If your AI can ship it, your team should be able to explain it."**
- **"From tribal knowledge to replayable delivery."**

---

## 5. Product Priorities (Instead of Time-Heavy Planning)

### 5.1 Must-Have Product Capabilities

| Capability                    | Why It Matters                                | Acceptance Signal                                |
| ----------------------------- | --------------------------------------------- | ------------------------------------------------ |
| Template library (tiered)     | Fast onboarding with low setup friction       | Teams can start with copy/paste and succeed      |
| Protocol spec (clear + short) | Shared behavioral contract for contributors   | Referenced in PRs and contributor docs           |
| GitHub validation surfaces    | Turns governance into default workflow checks | PRs fail when evidence or spec links are missing |
| Dogfooding example repo       | Proves practical, non-theoretical usability   | External users replicate pattern with low effort |

### 5.2 High-Leverage Expansion Features

| Feature                          | Strategic Benefit                                     |
| -------------------------------- | ----------------------------------------------------- |
| CLI (`skb init`, `skb validate`) | Standardizes setup and compliance checks              |
| Docs-only simulation utility     | Validates whether docs are implementation-complete    |
| Cursor rules export              | Bridges governance docs into AI tool behavior         |
| Template pack ecosystem          | Community-led verticalization (fintech, health, etc.) |

### 5.3 Explicit Non-Goals (Current Product Scope)

- Hosted dashboard as primary interface
- Real-time collaborative editor
- Workflow complexity that requires training before first use

### 5.4 Implementation Phases (GTM MVP → Advanced)

| Phase                                      | Goal                                      | Feature Focus                                                                                                                   | Exit Criteria                                                                 |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Phase 1: Quick GTM MVP**                 | Launch fast with clear governance value   | Basic template library, minimum viable card, protocol quickstart, GitHub PR checklist                                          | First external teams complete real PRs with valid spec + evidence links       |
| **Phase 2: Validation + Special Features** | Improve adoption in real contributor flows | Basic features hardened + special features (maintainer quick-view, governance score output, contributor onboarding examples)   | Repeat usage across multiple repos and measurable improvement in review clarity |
| **Phase 3: Post-Validation Expansion**     | Add advanced capabilities responsibly      | Advanced automation (`skb validate` depth checks), docs-only simulation utility, vertical template packs, deeper tool adapters | Market validation confirms demand and maintenance capacity for advanced scope  |

### 5.5 Current Stage Focus (Now)

At this stage, product execution should focus on **basic features** and a small set of **special features** that directly improve day-to-day PR quality and reviewer confidence.

**Basic features to prioritize now**:

- Tiered templates (lightweight + standard)
- Clear protocol wording (6-rule contract)
- GitHub-native validation surfaces (issue/PR scaffolding)
- Dogfooding repository with complete governance trail

**Special features to prioritize now**:

- Minimum viable card mode (low-ceremony onboarding)
- Early governance scoring output for quick feedback
- Maintainer quick-view summary for OSS review efficiency

Advanced features remain intentionally open and should be expanded **after market validation** confirms which workflows create durable value.

---

## 6. Adoption Strategy Focused on Feature Discovery

### 6.1 Distribution Through Product Utility

1. **GitHub-first discoverability**: templates, examples, and issue/PR assets
2. **Proof through dogfooding**: the project itself runs on spec-kanban
3. **Case-study led credibility**: publish before/after deltas (review speed, rework, onboarding)
4. **Integration-led pull**: make it useful inside existing dev tools, not adjacent to them

### 6.2 Activation Loop

1. Install templates
2. Run one real feature via spec card
3. Observe better review quality + decision traceability
4. Standardize in contributor guide
5. Expand to additional repos/teams

### 6.3 Opinionated GTM Suggestion

Prioritize one strong wedge: **"GitHub-native governance templates for AI PR quality"**. Avoid broad platform messaging early. Win with one crystal-clear use case, then expand.

---

## 7. KPI Framework (Product Behavior Over Vanity Metrics)

### 7.1 North-Star Metric

**Governed Change Ratio** =
$\frac{\text{AI-generated PRs with valid spec + evidence links}}{\text{all AI-generated PRs}}$

### 7.2 Product-Quality Indicators

| Indicator                            | Why It Matters                                  |
| ------------------------------------ | ----------------------------------------------- |
| Spec card completion rate            | Measures workflow adoption, not stars           |
| Decision evidence completeness score | Signals governance quality depth                |
| Docs-only simulation pass rate       | Measures replayability and documentation health |
| Same-rollout remediation frequency   | Reveals hidden-doc debt being actively reduced  |
| Time-to-context for new contributor  | Captures onboarding value directly              |

### 7.3 Ecosystem Health Indicators

- Community-contributed template packs
- Number of repos that run validation checks by default
- External references in CONTRIBUTING guides and PR templates

---

## 8. Risks and Product-Level Mitigations

| Risk                               | Product Mitigation                                                   |
| ---------------------------------- | -------------------------------------------------------------------- |
| "This is too heavy" perception     | Keep lightweight tier to one-file start and progressive rigor path   |
| Contributor drop-off               | Reduce writing burden via snippets, autofill scaffolds, and examples |
| Tool ecosystem churn               | Keep protocol tool-agnostic; integrations remain adapters            |
| Quality inconsistency in templates | Introduce template versioning + compatibility notes                  |
| Low long-term maintainability      | Establish lightweight governance model and public RFC process        |

---

## 9. Prospective Opinions & Strategic Suggestions

### 9.1 Where the Project Can Win Big

1. **Standardize the language of governance** before larger players formalize their own closed standards.
2. **Own the PR-quality conversation**: make spec-linked evidence an expected norm for AI-generated changes.
3. **Become the interoperability layer** between docs, PM tools, and AI coding agents.

### 9.2 Product Suggestions (Opinionated)

1. **Add a "minimum viable card" mode**
   - Three required fields only: scope, docs-needed, decision evidence.
   - Reduces perceived ceremony while preserving governance intent.

2. **Ship a score-based validator early**
   - `skb validate` should output a simple governance score (e.g., 0-100).
   - Scores are easier to socialize than pass/fail rules alone.

3. **Create vertical starter packs**
   - Fintech, healthcare, and B2B SaaS variants with domain-specific evidence checklists.
   - Shortens path from generic templates to real team workflows.

4. **Bundle a "maintainer mode" for OSS**
   - Reviewer quick-view summary: linked docs, decision table, unresolved gaps.
   - Targets the highest-pain persona directly.

5. **Define a compatibility promise**
   - Version templates and protocol semantics clearly.
   - Teams need confidence that adopting now will not create migration churn later.

### 9.3 Tactical Next Actions (Feature-Driven)

- Finalize canonical template set and protocol wording
- Publish one high-quality dogfooding repository with full governance trail
- Add GitHub validation checks that enforce spec-link + evidence requirements
- Release lightweight CLI for init/validate/new-card
- Collect and publish 3 deep feature-focused case studies

---

## 10. Conclusion

`spec-kanban` has strong product potential because it addresses a real and under-served layer in AI-native development: **governance continuity**.

The strongest path forward is to stay product-led:

- make feature value immediately visible in PR quality,
- reduce workflow friction with tiered adoption,
- and prove repeatable outcomes through dogfooding and measurable governance behavior.

If execution tools are the "muscles" of AI software delivery, `spec-kanban` can become the **memory and intent system**.

---

## Appendix A: Competitive Landscape Map

```
                          HIGH AUTONOMY
                                    │
            Devin, AutoCoder  │  ❌ "Just let AI run"
            (Execution-only)  │    (No governance memory)
                                    │
                                    │
     ───────────────────────┼────────────────────────
     TOOL-CENTRIC           │           PROCESS-CENTRIC
                                    │
     Cursor, Copilot        │    ✅ SPEC-FIRST KANBAN
     (Editor-native)        │    (Governance substrate)
                                    │
                                    │
            Traditional SDD   │  Linear, Jira
            (Phase-gated)     │  (Generic PM systems)
                                    │
                          LOW AUTONOMY
```

**Niche**: process-centric governance for high-autonomy teams.

---

## Appendix B: Template Preview (Standard Tier)

See `templates/standard/` for complete examples. Reference card:

```markdown
---
card_id: KAN-0042
lane: Active
owner: @alice
created: 2026-06-17
spec_first_verified: true
---

## Feature: OAuth2 Google Login

### 1. Docs Needed (Pre-Implementation)

- [x] `docs/security/auth-patterns.md` — OAuth flow requirements
- [x] `docs/api/auth.md` — Token envelope contract
- [ ] ADR-0012 — Provider selection rationale (pending)

### 2. Decision Evidence Log

| Decision      | Rationale           | Evidence                 |
| ------------- | ------------------- | ------------------------ |
| Use PKCE flow | Mobile app security | ADR-0012, OAuth 2.1 spec |

### 3. Implementation Notes

_[Filled during Active lane]_

### 4. Same-Rollout Remediation

_[If code discovery happens, document here and update linked docs]_
```
