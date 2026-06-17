Spec-First AI-Oriented Kanban: A Practical Governance Layer for Loop and Harness Workflows

How teams are using docs-first execution to reduce rework, improve multi-agent alignment, and keep technical context auditable over time

AI-assisted development has moved well beyond autocomplete. Teams now run autonomous coding loops, multi-agent pipelines, and runtime safety harnesses in production-like environments. The results are promising, but uneven.

Across current community practice, two patterns are common:

- **Loop engineering**: AI writes code, runs checks, and iterates until tests pass or a loop cap is reached.
- **Harness engineering**: runtime controls restrict tool access, risky commands, and resource consumption.

Both approaches solve important problems. Loop workflows improve execution speed; harnesses improve operational safety. But many teams still report recurring issues: high corrective rework, decision traceability gaps, and weak shared context when several contributors or agents are involved.

This is where I position **Spec-First AI-Oriented Kanban**: not as a replacement for loop or harness patterns, but as a governance layer that sits above them.

## What Spec-First AI-Oriented Kanban Adds

The model has two parts: a behavioral protocol for AI work and a kanban structure that preserves context as a project asset.

### 1) Spec-First Protocol (behavioral contract)

The protocol defines entry criteria before implementation begins:

1. **Docs-first mandate**: read canonical specs before code.
2. **Docs Needed declaration**: list required docs and why each is needed.
3. **Decision evidence log**: cite sources for major tradeoffs.
4. **Controlled fallback scans**: allow code scans only when docs are insufficient.
5. **Same-rollout remediation**: if fallback scans are used, update docs in the same PR (or assign an accountable owner/date).
6. **Docs-only simulation gate**: verify the rollout can be understood and replayed from docs alone.

### 2) AI-Oriented Kanban (operating system)

Traditional boards answer _status_. This system also tracks _context quality_: what is final, what remains ambiguous, and what evidence supports completion.

Typical lanes:

1. Intake
2. Planned
3. Active
4. Review
5. Archive
6. Report

The practical outcome is faster handoffs and less context reassembly for new contributors or fresh AI sessions.

## Where It Performs Well (Based on Current Team Patterns)

In my view, this approach is strongest in environments with parallel workstreams and frequent handoffs:

1. **Multi-agent or multi-contributor delivery**
   - Shared specs and decision logs reduce “telephone-game” drift.
2. **Regulated or audit-sensitive domains**
   - Evidence trails matter as much as passing tests.
3. **Long-lived product teams**
   - Documentation debt is managed continuously rather than deferred.
4. **Hybrid human + AI workflows**
   - Review checkpoints are explicit and compatible with Scrum/Kanban rituals.

## Where It Is Weaker

A fair assessment: this is not ideal for every task.

- **Tiny hotfixes**: process overhead can outweigh value.
- **Docs-poor repos**: benefits are delayed until baseline documentation exists.
- **Very small teams**: full archival/reporting lanes can feel heavy initially.

## Comparison in Practice: Loop vs Harness vs Spec-First Kanban

| Dimension                  | Loop Engineering                     | Harness Engineering                      | Spec-First AI-Oriented Kanban             |
| -------------------------- | ------------------------------------ | ---------------------------------------- | ----------------------------------------- |
| Primary control point      | Post-generation correction           | Runtime constraints                      | Pre-implementation alignment              |
| Core strength              | Fast autonomous iteration            | Safety and policy enforcement            | Context quality and decision traceability |
| Typical failure mode       | Correct-but-costly rework cycles     | Safe execution of wrong intent           | Process overhead if over-applied          |
| Multi-agent coordination   | Often fragile without shared context | Operationally safe but not collaborative | Strong when docs are maintained           |
| Compliance/audit readiness | Limited unless extended              | Runtime logs only                        | High with evidence logging                |
| Small-task efficiency      | High                                 | High                                     | Low to moderate                           |

## My Forward-Looking View (2026+)

Based on how teams are currently adopting AI delivery practices, I expect a **layered default architecture** to become standard:

1. **Governance layer**: Spec-First Kanban (scope, rationale, evidence).
2. **Safety layer**: Harness controls (permissions, risk limits, budget guardrails).
3. **Execution layer**: Bounded loop automation (test-and-repair within strict iteration caps).

The strategic shift is simple: raw model capability is improving faster than organizational coordination. So execution gets easier, while governance gets more valuable.

## Practical Rollout Path

If you want to trial this without heavy disruption:

1. Start with three non-negotiables: docs-before-code, decision evidence, same-PR docs remediation.
2. Use only four lanes first: Intake → Planned → Active → Review.
3. Add harness controls for high-risk actions and spend visibility.
4. Keep loops bounded and escalation-friendly (no infinite auto-correction).
5. Introduce archive/reporting once the core habit is stable.

## Closing Perspective

Loop and harness engineering are useful, and both will remain foundational. My perspective is that teams now need a durable governance surface above those layers—especially when multiple humans and agents collaborate over months, not hours.

Spec-First AI-Oriented Kanban is one pragmatic way to provide that surface: fair to existing agile practice, auditable for serious environments, and flexible enough to evolve as model behavior changes.
