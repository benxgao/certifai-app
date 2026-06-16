Spec-First AI-Oriented Kanban: A Pragmatic, Auditable Alternative to Loop & Harness Engineering
 
Building AI-assisted development workflows that cut token waste, align multi-agent teams, and avoid permanent documentation debt
 
AI-assisted software development has evolved far beyond inline code completion. Today, teams are experimenting with multi-agent systems that promise to build entire features overnight — but the reality rarely lives up to the hype.
 
The industry has coalesced around two dominant paradigms for managing AI coding:
 
- Loop Engineering: Autonomous, test-driven cycles where AI writes code, runs tests, and iterates until all checks pass.
- Harness Engineering: Runtime guardrails that sandbox AI execution, limit file access, and cap resource usage.
 
Both solve real problems, but both have blind spots. Loop systems burn through tokens on endless corrective cycles, accumulate undocumented technical debt, and suffer from cascading errors in multi-agent setups. Harness tools keep AI safe but cannot stop it from writing logically incorrect code — and they offer no framework for planning, collaboration, or traceability.
 
After months of testing on production projects, I’ve developed a third approach: Spec-First AI-Oriented Kanban. It turns your kanban board from a simple task tracker into a durable context system, with enforceable docs-first rules that anchor all AI work to canonical specifications.
 
In this post, I’ll break down how it works, how it stacks up against loop and harness engineering, and where it fits in your AI development stack.
 
 
 
What Is Spec-First AI-Oriented Kanban?
 
This methodology combines two tightly integrated components: a behavioral contract for AI execution (the Spec-First Protocol) and a structured kanban workflow that standardizes context, decision-making, and archival.
 
Core Pillar 1: The Spec-First Protocol
 
This is the enforceable rule set that eliminates “code-first guessing” by AI agents. Every rollout, feature, or refactor must follow these mandatory policies:
 
1. Docs-first mandate: AI must consult canonical specification documents before reading any code.
2. Docs Needed declaration: No implementation starts without an explicit list of required reference docs and their purpose.
3. Decision evidence logging: Every major architectural or business decision must cite its source docs and rate their sufficiency.
4. Controlled fallback scans: Code scanning is allowed only when docs are missing, ambiguous, contradictory, or outdated.
5. Same-rollout remediation: Any fallback code scan requires a corresponding documentation update in the same PR — or an assigned owner with a firm due date.
6. Docs-only simulation gate: No rollout is considered complete until it can be fully reproduced using only documentation, with no code reading allowed.
 
Core Pillar 2: The AI-Oriented Kanban System
 
Traditional kanban only answers “what’s in progress, blocked, or done.” This system adds answers to:
 
- What is the canonical context for this phase?
- Which decisions are final vs. open?
- What evidence proves this work is complete?
- How can a new person (or agent) resume work in minutes?
 
Work flows through six standardized lanes, each with structured artifacts that persist as reusable project assets:
 
1. Intake: Capture ideas, triage risk, and define phase boundaries.
2. Planned: Finalize initiative briefs, scope maps, risk registers, and Docs Needed lists.
3. Active: Execute in short, verifiable micro-phases, with live decision logging and progress tracking.
4. Review: Validate acceptance criteria, run docs-only simulations, and resolve gaps.
5. Archive: Store final summaries, lessons learned, and migration guides for future retrieval.
6. Report: Publish executive summaries and cross-project insights for stakeholders.
 
The methodology is built on five core principles:
 
- Split work into independently verifiable micro-phases
- Separate strategy (why) from execution (how)
- Define “done” by evidence, not implementation status
- Treat archives as operational assets, not dead storage
- Remain tool- and model-agnostic, so workflows outlast individual AI platforms
 
 
 
Core Advantages Over Conventional AI Coding Workflows
 
1. Cuts hallucinations and wasted token spend at the source
 
Loop systems waste 40–70% of token budget on rework: generating incorrect code, running tests, and iterating to fix self-inflicted errors. The spec-first approach eliminates most of this waste by locking down business rules and architectural constraints upfront. AI agents build to a known standard instead of guessing and correcting — reducing both hallucinations and unnecessary token burn.
 
2. Aligns multi-agent teams on a single source of truth
 
Multi-agent setups suffer from a “telephone game effect”: context degrades as it passes between planning, coding, and review agents, leading to inconsistent code styles, conflicting business logic, and group hallucinations. This methodology gives every agent the same canonical spec and decision log, eliminating alignment drift and cutting code review rework dramatically.
 
3. Delivers full auditability for compliance and debugging
 
Loop and harness systems only retain code and runtime logs — they don’t track why a decision was made. The spec-first kanban system maintains a complete evidence chain for every change: which docs were cited, what tradeoffs were made, and when fallback code scans were used. This is irreplaceable for regulated industries (finance, healthcare, government) and makes post-incident debugging far more actionable.
 
4. Integrates natively with existing agile teams
 
Fully autonomous loop systems feel like a black box to traditional Scrum/Kanban teams, with no clear human intervention points. This workflow is designed for human-AI collaboration: it adds structured checkpoints where human reviewers validate scope, decisions, and outcomes, fitting seamlessly into existing sprint and kanban rhythms.
 
5. Prevents permanent documentation debt
 
Left to their own devices, AI coding systems accelerate the classic “code moves faster than docs” problem, creating a growing wall of implicit logic that becomes unmanageable over time. The mandatory same-rollout remediation rule closes this loop: every gap found in documentation gets fixed immediately, keeping your knowledge base aligned with your codebase long-term.
 
 
 
Head-to-Head Comparison: vs. Loop Engineering vs. Harness Engineering
 
No single paradigm is perfect. Here’s how spec-first AI-oriented kanban stacks up on the dimensions that matter most for engineering teams.
 
vs. Loop Engineering
 
Loop engineering excels at autonomous, fast iteration on small, well-bounded tasks — but struggles with scale, consistency, and long-term maintainability.
 
Advantages over Loop Engineering
 
- Far less wasted token spend from corrective rework cycles
- Consistent alignment across multi-agent teams, with no cascading context loss
- Full decision traceability and compliance readiness
- Proactive management of documentation debt, rather than accelerating it
- Clear human governance points that fit traditional agile workflows
 
Disadvantages vs. Loop Engineering
 
- Higher upfront process overhead; poorly suited for 10-minute hotfixes or trivial config changes
- No built-in automated closed-loop test-and-repair pipeline (requires CI integration)
- Delivers maximum value only when baseline documentation is already in place
 
vs. Harness Engineering
 
Harness engineering provides critical runtime safety and cost control — but it is purely a defensive tool, not a delivery framework.
 
Advantages over Harness Engineering
 
- Constrains business logic and design intent, not just file access and runtime behavior
- Includes a complete end-to-end delivery workflow for planning, execution, review, and knowledge management
- Scales to multi-agent teams without complex per-agent sandbox configuration
- Proactively improves documentation quality over time, rather than ignoring it entirely
 
Disadvantages vs. Harness Engineering
 
- No native runtime hard isolation, file access whitelisting, or high-risk action blocking
- No built-in hard caps on token usage, execution time, or loop count
- Cannot physically prevent unauthorized code changes if human review is bypassed
 
Side-by-Side Summary Table
 
Dimension Loop Engineering Harness Engineering Spec-First AI-Oriented Kanban 
Constraint timing Post-hoc corrective cycles Runtime enforcement Pre-implementation specification 
Core strength Autonomous speed for small tasks Runtime safety & cost hard limits Hallucination reduction, auditability, multi-agent alignment 
Token overhead High (endless rework cycles) Controllable (hard throttling) Moderate (fewer cycles, no built-in throttling) 
Multi-agent compatibility Poor (no shared truth, cascading errors) Poor (complex per-agent sandboxing) Excellent (unified spec baseline) 
Compliance & auditability Weak (no decision trail) Weak (only runtime logs) Excellent (full evidence chain) 
Small hotfix efficiency Very high High Low (heavy process overhead) 
Large feature delivery Mixed (prone to logical drift) Moderate (safe but unguided) Excellent (fewer reworks, consistent output) 
Documentation debt impact Worsens debt over time No impact (ignores docs) Reduces debt via mandatory remediation 
Agile team integration Weak (black-box autonomy) None (pure infrastructure) Native fit for Kanban/Scrum 
Security guardrails Weak Excellent Weak (business logic only) 
 
 
 
The Optimal Stack: All Three Paradigms Work Better Together
 
You don’t have to choose one. The most robust AI development stacks use all three paradigms in layered, complementary roles:
 
1. Top layer: Spec-First AI-Oriented Kanban — governs scope, requirements, decisions, and traceability. This is the system of record for what you’re building and why.
2. Bottom layer: Harness Engineering — provides runtime sandboxing, token/resource limits, file access controls, and high-risk operation blocking as a safety backstop.
3. In-cycle layer: Loop Engineering — deployed only within the active coding phase, as short, bounded auto-correction loops. AI generates code, runs tests, and iterates a limited number of times before escalating to human review — no infinite cycles.
 
Recommended Stack by Team Type
 
- Enterprise / compliance-heavy teams: Kanban-first foundation, with harness guardrails as mandatory infrastructure, and limited loop cycles for coding-phase test refinement.
- Fast-moving startups / small product teams: Loop-first for rapid iteration, with lightweight spec docs for core features, and basic harness tooling for cost control.
- High-security platforms (finance, data infrastructure): Harness as the non-negotiable base layer, with spec-first kanban for business logic governance, and strictly restricted loop usage.
 
 
 
Limitations: Where This Workflow Is Not a Good Fit
 
This is a specialized methodology for durable, collaborative software projects. It is not a one-size-fits-all solution.
 
- Tiny, one-off changes: For 5-minute hotfixes, config tweaks, or minor UI polish, the process overhead outweighs the benefits.
- Teams with no existing documentation: If your codebase has zero canonical specs, you will see limited value until you build a baseline documentation foundation.
- Very small teams (3–5 people): The full archival and reporting lanes add unnecessary overhead for tiny teams. A simplified version — just the core spec-first rules and basic phase tracking — is a better starting point.
 
 
 
Getting Started
 
You don’t have to roll out the entire system at once. I recommend a phased rollout:
 
1. Adopt the core spec-first rules first: Mandate docs before code, require decision evidence logs for major changes, and fix documentation gaps in the same PR. This delivers 60% of the value with 20% of the effort.
2. Roll out a simplified kanban structure: Start with Intake → Planned → Active → Review. Skip the full Archive and Report lanes until the core workflow sticks.
3. Add harness tooling: Layer in runtime safety, token limits, and file access controls to prevent cost overruns and risky behavior.
4. Introduce bounded loop cycles: Add short, capped test-and-repair loops to the coding phase only, with strict maximum iteration limits.
5. Expand gradually: Add archival, reporting, and docs-only simulation drills as your team and documentation maturity grow.
 
 
 
Final Thoughts
 
The future of AI-assisted development isn’t fully autonomous “fire and forget” systems — and it isn’t locking AI in a sandbox so tight it can barely do useful work.
 
The spec-first AI-oriented kanban approach takes the middle path: it unlocks the productivity gains of AI and multi-agent systems, while retaining human control, traceability, and long-term maintainability. It’s not flashy, but it works for real-world teams building real, durable software.
 
If you’re tired of runaway token bills, inconsistent multi-agent output, and growing documentation debt, it’s worth trying the core spec-first rules on your next feature.