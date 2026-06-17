Product Analysis & Implementation Plan: Skill-Like CLI Markdown Integrated Spec-First AI Kanban Workflow

Executive Summary

This document presents a native workflow enhancement: integrating skill-like CLI markdown rule systems into the Spec-First AI-Oriented Kanban workflow. The core objective is to embed standardized, executable specification governance, workflow automation, and AI execution rules as human-readable, Git-trackable markdown skill files.

By replacing rigid proprietary client-side tooling with repo-native skill-based command definitions, the solution delivers structured spec-driven development capabilities, unified AI execution standards, and visual collaborative governance — while preserving the flexibility, parallel collaboration, and open-source friendliness of the kanban workflow.

This analysis focuses purely on the integrated product capability, core architecture, functional value, phased implementation, and optimization strategies, with no comparative analysis against external CLI tools.

1. Core Product Concept

1.1 Definition of Skill-Like CLI Markdown System

A skill-like CLI markdown system is a schema-standardized, executable rule repository stored natively within the code repository. Each markdown file acts as a declarative “command skill” that defines standardized workflow logic, including scaffolding rules, specification templates, validation criteria, stage gate definitions, and AI execution prompts.

Key characteristics:

- All workflow rules are written in readable markdown with unified  DO / DON’T / RULES  schema
- No local client installation, no binary dependencies, no environment version locking
- Fully Git-versioned, reviewable, traceable, and collaborative editable
- Parseable by CI workflows and kanban automation bots for automated execution

  1.2 Integrated Workflow Positioning

The integration builds a two-layer governance system on top of the original Spec Kanban workflow:

1. Visual collaboration layer: Kanban board swimlanes for parallel task tracking, iteration management, and community contribution coordination
2. Rule execution layer: Skill-like CLI markdown files for standardized spec enforcement, automated validation, and AI workflow orchestration

The combination realizes visual management + declarative rule governance + AI-native automation in a single unified workflow.

2. Core Functional Capabilities

The integrated solution delivers complete end-to-end spec-driven development capabilities through markdown skill commands, covering project initialization, spec authoring, quality verification, task decomposition, stage gating, and merge compliance control.

2.1 Project Scaffolding Skill

A standardized initialization skill file defines the official repository specification directory structure, baseline project invariants, default specification templates, and team coding constraints.

- Automatically generate standardized spec directories and baseline rule sets for new projects
- Unify project-level architectural boundaries, security constraints, and quality standards
- Provide out-of-the-box specification governance baseline for all subsequent iterations

  2.2 Multi-Tier Spec Template Generation Skill

Structured markdown skill templates support adaptive specification generation for different task types:

- Lightweight templates for bug fixes, minor optimizations, and trivial adjustments
- Complete formal templates for new features, module iterations, and architectural changes
- Architecture-level rigorous templates for core framework refactoring and infrastructure upgrades

The system automatically matches template specifications based on kanban card task attributes, balancing development efficiency and specification completeness.

2.3 Spec Static Validation & Quality Gate Skill

Declarative validation rules embedded in markdown enable automated specification quality inspection:

- Detect ambiguous scope definition, missing acceptance criteria, and incomplete boundary description
- Verify compliance with project invariant constraints (architecture, performance, security)
- Identify logical conflicts, unresolved risks, and undefined technical prerequisites

All validation rules are editable and iterable, supporting continuous optimization of specification quality standards.

2.4 Kanban Stage Gate Enforcement Skill

Custom workflow gate skills define mandatory pass criteria for each kanban swimlane, realizing standardized phase control:

- Block card flow if pre-stage specification requirements are unfulfilled
- Force risk review and unresolved problem closure before entering implementation
- Ensure quality verification compliance before entering testing and archiving stages

The skill-based gate mechanism standardizes team iteration rhythm without rigid serial pipeline limitations.

2.5 AI Task Decomposition & Execution Skill

Unified markdown prompt rules standardize AI-assisted development behavior for all kanban tasks:

- Guide LLM to decompose complete specs into atomic implementable subtasks
- Restrict AI coding behavior according to project invariant rules and task-specific constraints
- Unify code style, test standards, and documentation output specifications

It eliminates inconsistent AI generation quality caused by different personal prompting habits.

2.6 PR Merge Compliance Skill

Repository-level merge rule skills link kanban task status with code merging permissions:

- Prohibit merging pull requests unbound to valid, reviewed spec cards
- Verify spec consistency between final code and accepted task specification
- Block iterations with unresolved specification defects and quality violations

Realize closed-loop traceability from requirement specification to code delivery.

3. Product Core Advantages

3.1 Zero-Dependency Community Collaboration

All workflow rules and command skills are repo-native markdown files. External contributors and team members can comply with standardized spec-driven processes without installing any local tools, solving the threshold problem of standardized process adoption in open and multi-person collaborative scenarios.

3.2 Fully Traceable & Iterable Workflow Rules

Traditional workflow logic is usually solidified in tools or team conventions and cannot be version managed. The markdown skill system enables:

- Rule modification via standard Git PR review process
- Complete historical traceability of workflow standard evolution
- Continuous refinement of specification rules with project iteration

  3.3 Adaptive Governance for Multi-Scale Tasks

The skill system supports conditional rule switching, realizing differentiated process governance:

- Lightweight and efficient process for small-scale fixes and minor iterations
- Rigorous and complete specification governance for core feature development
  No redundant process overhead, no standard omission.

  3.4 Native Compatibility with Parallel Kanban Iteration

All markdown skill commands are executed per kanban card context. Multiple parallel tasks in the kanban board can independently trigger specification validation, task decomposition, and gate checks, perfectly adapting to multi-task concurrent iteration and asynchronous distributed collaboration.

3.5 Unified AI-Native Development Standard

Centralized skill rule sets form the project’s exclusive AI development operating specification. All AI code generation, task decomposition, and review behaviors follow unified declarative rules, greatly improving the consistency, robustness, and maintainability of AI-generated code.

4. Overall Technical Architecture Design

4.1 Double-Layer Rule Architecture

Layer 1: Global Static Skill Library (.spec_skills/commands/)

Store all reusable public command skills, including init, template generation, validation, gate check, task split, and PR compliance rules.

- Strict PR review required for modification
- Effective for all kanban tasks globally
- Used as the fixed baseline of project specification governance

Layer 2: Card-Level Dynamic Rule Overlay

Each kanban card carries lightweight task-specific dynamic rules (scope boundary, individual risks, temporary quality constraints).

- Inherit all global static skills
- Support independent task-level fine-grained constraint adjustment
- Avoid global rule pollution and file redundancy

  4.2 Automation Execution Architecture

  1. Standardized Markdown Schema Layer: All skill files follow unified frontmatter metadata + DO/DON’T/RULES block schema
  2. Unified Parser Layer: Lightweight custom CI parser automatically identifies and executes markdown skill logic
  3. Kanban Bot Linkage Layer: Trigger skill rule verification synchronously when card status and swimlane change
  4. Result Feedback Layer: Automatically block abnormal processes, mark blocked status, and output standardized defect reports

5. Phased Implementation Roadmap

Phase 1: Foundation Deployment (Low Risk, Quick Win)

- Build standardized  .spec_skills  directory and core basic command templates
- Access basic spec template generation and manual specification quality inspection capabilities
- Align team specification writing standards

Phase 2: Automated Governance Landing

- Access CI automatic parsing and validation of skill rules
- Realize automatic quality check of specs before entering development stage
- Complete basic linkage between skill rules and kanban card status

Phase 3: Full Workflow Closed Loop

- Enable full swimlane stage gate automatic interception
- Realize AI automatic task decomposition based on skill prompts
- Complete PR merge compliance automatic blocking mechanism

Phase 4: Intelligent Optimization & Experience Upgrade

- Build automatic archiving and reuse mechanism of historical spec skills
- Support one-click generation of task rules and intelligent rule recommendation
- Form a self-evolving spec-driven development system

  5.1 Prospective Product Opinion: Treat the CLI as the Workflow Entry Point

To maximize adoption and reduce prompt-friction, the next implementation should position a lightweight `spec-kanban` CLI as the single interaction layer for both humans and agents. The CLI should not replace markdown skills; it should operationalize them.

Recommended principle:

- Markdown skill files remain the source of truth
- CLI commands become deterministic executors of those skills
- AI prompts become optional accelerators, not required operational dependencies

This direction turns "remembering how to ask" into "running a known command", which is the key usability leap for multi-contributor teams.

5.2 Proposed Command Surface (MVP to V1)

The following command set can cover most current manual, prompt-driven operations:

- `spec-kanban init`
  - Bootstrap `.spec_skills/`, kanban folders, baseline templates, and project invariants
  - Detect missing required docs and create starter files

- `spec-kanban new --type <bug|feature|arch> --card <id>`
  - Generate the right spec template based on task type
  - Pre-fill metadata from card context (owner, risks, acceptance criteria placeholders)

- `spec-kanban validate [--card <id>] [--strict]`
  - Run static rule checks against one card or whole board
  - Output machine-readable and human-readable reports
  - Return non-zero exit code for CI gating

- `spec-kanban fix [--card <id>] [--safe|--aggressive]`
  - Apply rule-based automatic fixes for format/schema issues
  - Suggest patch blocks for ambiguous content rather than silently rewriting intent
  - Keep a change summary for reviewer traceability

- `spec-kanban gate check --stage <plan|active|review|archive> --card <id>`
  - Evaluate stage-entry criteria and blocking issues
  - Produce explicit pass/fail reasons tied to skill rule IDs

- `spec-kanban split --card <id> [--max-points <n>]`
  - Decompose approved spec into atomic implementation tasks
  - Generate subtasks with dependency order and test expectations

- `spec-kanban pr verify --pr <number|branch>` - Confirm PR↔card binding, spec/code consistency, unresolved risk status - Provide merge verdict and required remediation steps

  5.3 Validation + Auto-Fix Strategy (Critical for Real Adoption)

The biggest value is not only "check" but "check + repair guidance". Validation output should always include:

- Rule violated
- Why it matters
- Minimal fix example
- Optional one-command auto-fix path

Suggested severity model:

- Error: blocks stage movement or merge
- Warning: non-blocking but quality-degrading
- Info: recommendation for continuous improvement

For trust and control, auto-fix should be constrained by policy:

- Safe mode: formatting, headings, metadata normalization only
- Assisted mode: proposes semantic text patches, requires confirmation
- No hidden rewrites of requirements or acceptance criteria

  5.4 Human + Agent Collaboration Model

The CLI should standardize both human execution and agent execution:

- Humans run commands directly in local/CI workflows
- Agents invoke the same commands before/after edits
- Both paths produce identical artifacts and validation reports

This eliminates divergence between "what an engineer does" and "what an AI assistant does", improving reproducibility and review confidence.

5.5 Recommended Delivery Sequence

Practical landing order:

1. `init`, `new`, `validate` (baseline usability)
2. `fix` with safe mode (reduce manual doc cleanup)
3. `gate check` + CI integration (enforce process)
4. `split` + `pr verify` (closed-loop automation)

This sequence provides quick wins early while preserving architectural extensibility.

6. Risk Analysis & Optimization Solutions

6.1 Risk: Increased Repository File Complexity

Optimization
Adopt layered lightweight design: retain only core invariant rules for small projects and simple tasks; enable full skill rules only for medium and large iteration tasks, avoiding excessive file redundancy.

6.2 Risk: Manual Bypass of Process Rules

Optimization
Build dual insurance of automation + permission control:

- CI strictly blocks non-compliant merging
- Restrict manual cross-swimlane movement permissions of blocked cards
- Set multi-person review mechanism for emergency rule override scenarios

  6.3 Risk: Parser Maintenance Overhead

Optimization
Solidify unified markdown skill schema standards, realize universal parsing logic, avoid customized development for each command file, and reduce long-term maintenance costs.

6.4 Risk: New Contributor Learning Cost

Optimization
Add simplified official interpretation documents for all skill commands, map skill functions to intuitive workflow behaviors, hide underlying complex schema logic, and reduce user understanding threshold.

7. Final Product Value Conclusion

The integration of skill-like CLI markdown system and Spec-First AI Kanban workflow forms a lightweight, open, traceable, AI-native, collaborative-friendly specification-driven development solution.

It completely solidifies team specification standards and workflow constraints into repo-native readable rules, realizes the standardization capabilities of professional spec-driven development, retains the visual collaboration and parallel iteration advantages of kanban, and perfectly adapts to AI-native development, multi-person team collaboration, and open-source community iteration scenarios.

This integrated architecture balances rigidity of specification governance and flexibility of iterative development, forming a more adaptable and sustainable workflow system for modern AI software development.
