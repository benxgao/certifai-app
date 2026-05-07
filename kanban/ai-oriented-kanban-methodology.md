# AI-Oriented Kanban: The Workflow That Stops AI Context Loss (and Speeds Delivery)

If your team is using AI coding assistants, the pattern is probably familiar: a task begins with clear intent, then context fragments, decisions disappear into chat history, and progress slowly turns into archaeology.

This post outlines a practical solution: an AI-oriented Kanban flow shaped by real delivery work and optimized for both human-in-the-loop execution and AI context retrieval. The goal is simple — preserve momentum, make decisions traceable, and prevent “what happened here?” from becoming a recurring team ritual.

For teams building AI-first products such as [Certestic](https://certestic.com), this style of Kanban creates a stronger operational backbone: faster iteration cycles, reusable context, clearer handoffs, and significantly less rework.

---

## Why this Kanban style works better with AI

Classic Kanban is excellent for visualizing work. But AI-assisted engineering introduces a second problem: **context continuity**.

Traditional boards answer:

- What are we doing now?
- What is blocked?
- What is done?

AI-oriented Kanban also answers:

- What exact context should the agent read first?
- What decision is final, and what is still open?
- Where is the canonical source for each phase?
- How can another human or agent resume instantly tomorrow?

---

## Core methodology (practical, not theoretical)

### 1) One initiative, many micro-phases

Start from one initiative (example: type enforcement, onboarding hardening, billing reliability), then split into phase-sized chunks that can be completed in short cycles.

Each phase should define:

- Objective
- In-scope / out-of-scope
- Risks and assumptions
- Acceptance checks
- Rollback note

This makes each step small enough for AI agents to execute reliably and for humans to review quickly.

### 2) Separate strategic docs from execution docs

A big source of confusion is mixing intent and execution in one long document.

Use clear doc roles:

- **Initiative brief** (why + expected outcomes)
- **Phase plan** (what this phase changes)
- **Progress tracker** (what is done now)
- **Lessons file** (what future phases must remember)

### 3) Treat “done” as evidence, not opinion

“Done” should mean:

- work shipped,
- acceptance checks passed,
- tracker updated,
- key decisions documented.

No evidence = not done yet.

### 4) Archive for retrieval, not nostalgia

Completion archives are not trophies; they are retrieval assets. A future engineer or AI agent should be able to answer in minutes:

- What changed?
- Why?
- What should not be changed back?

### 5) Design artifacts so both solo builders and teams can scale

Your structure should work when one person wears every hat and still scale when ownership is distributed across architecture, delivery, QA, and operations.

---

## A better folder/file structure for AI-oriented Kanban flow

### Recommended structure

```text
kanban/
  00-intake/
    ideas/
      <initiative-slug>.md
    triage-log.md

  10-planned/
    <initiative-id>-<initiative-slug>/
      initiative-brief.md
      scope-map.md
      risk-register.md
      decision-log.md
      phase-index.md

  20-active/
    <initiative-id>-<initiative-slug>/
      progress-tracker.md
      handoff.md
      phases/
        phase-01.md
        phase-02.md
        phase-03.md
      evidence/
        validations.md
        release-notes-draft.md

  30-review/
    <initiative-id>-<initiative-slug>/
      qa-summary.md
      architecture-signoff.md
      unresolved-items.md

  40-archive/
    <initiative-id>-<initiative-slug>/
      README.md
      final-summary.md
      lessons-learned.md
      migration-guide.md
      timeline.md

  templates/
    initiative-brief.template.md
    phase.template.md
    handoff.template.md
    lessons.template.md
```

### Why this structure is actionable

- `00-intake` keeps raw ideas from polluting active delivery.
- `10-planned` forces pre-flight clarity before execution.
- `20-active` is the operational cockpit.
- `30-review` separates “implemented” from “accepted.”
- `40-archive` preserves reusable knowledge for future initiatives.

---

## Sample files that make AI handoffs dramatically easier

### `phase-02.md` sample skeleton

- Goal in one sentence
- In-scope / out-of-scope
- Dependencies
- Risks
- Step checklist
- Acceptance checklist
- Rollback note
- “What future phases must know”

### `handoff.md` sample skeleton

- Current state summary (5 bullets max)
- Open decisions
- Immediate next step
- Do-not-change notes
- Linked evidence

### `lessons-learned.md` sample skeleton

- Mistake pattern
- Detection signal
- Prevention rule
- Reusable guideline

---

## Solo developer mode vs team mode

The same methodology works for both; the cadence and ownership are what change.

### Solo developer mode

Best when you are moving fast and context-switching often.

**How to run it:**

- Keep one active initiative max.
- Keep phase docs short and concrete.
- Update `handoff.md` at the end of every focused block.
- Use weekly archive reviews to extract reusable patterns.

**Big win:** you stop losing your own context between sessions.

### Team mode

Best when multiple contributors and stakeholders interact with the same initiative.

**How to run it:**

- Assign explicit phase owners.
- Use a lightweight decision log for architecture calls.
- Require acceptance evidence before moving from `20-active` to `30-review`.
- Use `unresolved-items.md` to prevent hidden work from disappearing.

**Big win:** fewer “I thought this was decided” moments.

---

## How this maps to Claude Code skills and popular AI agent approaches

AI-oriented Kanban doesn't exist in isolation. Several popular patterns in the Claude Code ecosystem share the same underlying insight: **explicit structure beats implicit assumption when working with AI agents.** Here's how they compare and connect.

---

### Claude Code's CLAUDE.md — the persistent convention layer

[CLAUDE.md](https://code.claude.com/docs/en/memory) is loaded at the start of every Claude Code session and gives the agent persistent facts about the project: build commands, code style rules, branch conventions, architectural decisions, and environment quirks.

**Relationship to AI-oriented Kanban:**

- `CLAUDE.md` acts as the **always-on project foundation** — equivalent to the initiative brief and architectural constraints layers of your Kanban structure.
- Where Kanban artifacts are scoped per initiative, `CLAUDE.md` is scoped to the repository lifetime.

**Best combined usage:**

Keep `CLAUDE.md` for stable, cross-initiative facts. Reference Kanban phase docs from it using the `@` import syntax so agents can load phase context on demand without bloating every session.

```md
# CLAUDE.md (example cross-reference)

See active initiative context: @kanban/20-active/current/handoff.md
```

---

### Claude Code's SKILL.md — reusable, on-demand workflows

[Skills](https://code.claude.com/docs/en/skills) are domain-specific knowledge files or repeatable workflow scripts stored under `.claude/skills/`. Claude applies them automatically when relevant, or you invoke them explicitly with `/skill-name`.

**Relationship to AI-oriented Kanban:**

- Skills are horizontal knowledge — patterns that apply across multiple initiatives (e.g., "how we write API proxy routes," "how we audit type drift").
- Kanban phase plans are vertical execution — scoped to one initiative's current phase.

The two are complementary: a SKILL defines "how we do this kind of work"; a phase plan defines "what we are doing right now."

**Example pattern:**

```
.claude/skills/type-enforcement/SKILL.md  → "how we audit and fix type drift in this repo"
kanban/20-active/type-hardening/phases/phase-02.md  → "the specific drift list for Phase 2"
```

When starting a phase, you invoke the skill for procedure, and load the phase doc for scope. The agent gets both without confusion.

---

### Claude Code's Subagents — isolated context for investigation

Claude Code [subagents](https://code.claude.com/docs/en/sub-agents) run specialized tasks in their own context windows, then report back. This avoids polluting the main conversation with discovery noise.

**Relationship to AI-oriented Kanban:**

Subagents map directly to the **intake and planning stages** of your Kanban flow:

- "Use a subagent to explore all files affected by this drift and summarize what needs to change" → maps to producing a phase-01 scope document.
- "Use a subagent to verify that Phase 2 changes have no consumer breakage" → maps to the acceptance check stage.

The output of a subagent investigation becomes the input of your next phase doc.

---

### Plan Mode (Explore → Plan → Implement → Commit)

Claude Code's [Plan Mode](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode) enforces a clean separation between reading/understanding and writing/changing:

1. Explore (read only)
2. Plan (create implementation plan)
3. Implement (execute against plan)
4. Commit (atomic change with message)

**Relationship to AI-oriented Kanban:**

This four-step loop is the micro-version of AI-oriented Kanban phases. You can think of each Kanban phase as a "Plan Mode cycle at scale":

| Plan Mode step | Kanban artifact equivalent                |
| -------------- | ----------------------------------------- |
| Explore        | `scope-map.md`, source-of-truth citations |
| Plan           | Phase doc (objective, steps, acceptance)  |
| Implement      | Active execution, tracker updates         |
| Commit         | Phase closure with evidence               |

---

### GitHub Copilot's `.github/copilot-instructions.md` — a similar-but-narrower cousin

GitHub Copilot's [copilot-instructions.md](https://docs.github.com/en/copilot/how-tos/best-practices/best-practices-for-using-github-copilot-in-your-project) works similarly to `CLAUDE.md`: injected context that shapes agent behavior. But it is typically limited to code style and review conventions, with no built-in skill or subagent system.

**Comparison:**

| Feature                    | Claude Code                           | GitHub Copilot            |
| -------------------------- | ------------------------------------- | ------------------------- |
| Persistent project context | `CLAUDE.md`                           | `copilot-instructions.md` |
| Reusable workflows         | `SKILL.md` + skills system            | Not natively supported    |
| Isolated investigation     | Subagents                             | Not natively supported    |
| Plan before code           | Plan Mode                             | Inline suggestions only   |
| Session management         | Named sessions, `/rewind`, compaction | Per-file context          |

Both benefit from AI-oriented Kanban structure, but Claude Code has more native infrastructure to exploit it.

---

### Cursor's Rules system — another parallel

[Cursor's Rules](https://docs.cursor.com/context/rules) (`.cursorrules` or project rules) are contextual prompts injected based on file patterns or directory. They share the same DNA as `CLAUDE.md` — persistent context that shapes agent output.

**Where AI-oriented Kanban adds value over Cursor rules alone:**

Rules tell the agent _how to behave_; Kanban tells the agent _what it is doing right now_. Teams using Cursor Rules still benefit from well-structured `handoff.md` and phase docs to give current-task context that rules cannot provide.

---

### How to use AI-oriented Kanban directly in Claude Code

Here's the practical mapping for a Claude Code session:

**At session start:**

```
@kanban/20-active/<initiative>/handoff.md
@kanban/20-active/<initiative>/phases/phase-03.md
```

This loads current state and phase scope into context without reading dozens of source files first.

**During a phase:**

Use `/skill <your-domain-skill>` to inject reusable procedure knowledge, then stay focused on the phase plan for scope boundaries.

**At phase end:**

Have Claude:

1. Update `progress-tracker.md` with completion notes and evidence.
2. Update `handoff.md` with next-phase context.
3. Commit atomically with a descriptive message.
4. Run `/clear` before the next phase to avoid context bleed.

**For investigations:**

```
Use a subagent to read all files in scope for phase-04 and produce a summary of affected contracts.
Save the summary to kanban/20-active/<initiative>/phases/phase-04-discovery.md
```

This keeps your main context clean and produces a durable artifact for future sessions.

---

## What to improve next as AI memory gets better

As copilots evolve from short-context assistants to memory-native collaborators, your Kanban should evolve too:

1. Add metadata headers to every phase file (`owner`, `status`, `depends_on`, `updated_at`).
2. Auto-build initiative dashboards from tracker files.
3. Add trust scores to archived docs (freshness + verification confidence).
4. Run periodic “context linting” to flag stale assumptions and orphan docs.

Think of this as moving from **documents** to a lightweight **delivery knowledge graph**.

---

## Author Note

This article was written using a human-led, AI-assisted workflow.

The core methodology, Kanban structure, and delivery practices originated from the author’s hands-on development experience. AI was used to help organize ideas, improve readability, and accelerate content refinement.

This reflects the same principle discussed throughout the article itself: humans provide intent, judgment, and system design; AI accelerates execution and iteration.
