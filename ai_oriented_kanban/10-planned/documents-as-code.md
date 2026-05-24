# Systematic Documentation Architecture Standard v1.0

## Docs-as-Code Architecture for Large Repositories

---

## TL;DR

**Core principle**: Documentation is not a static asset; it is an executable system that shares the same lifecycle as code.
**Key metrics**: New team members should understand system boundaries within 30 minutes, run the project locally within 1 day, and submit an effective PR within 1 week.
**Technical anchors**: MkDocs/Material + Mermaid + ADR + OpenAPI + Repo Map for AI.

---

## 1. Problem Diagnosis: Why Documentation Fails Over Time

Traditional documentation fails not because teams write too little, but because the architecture behind the documentation is flawed:

| Failure Mode      | Symptom                                 | Root Cause                                |
| ----------------- | --------------------------------------- | ----------------------------------------- |
| **Drift**         | Architecture diagrams diverge from code | Docs and code are stored separately       |
| **Blackhole**     | README grows to 500+ lines              | No layered classification system          |
| **Archaeology**   | No one knows "why this was designed"    | Missing decision context                  |
| **Irrelevant**    | API docs are auto-generated but unread  | No Single Source of Truth (SSOT)          |
| **AI Blind Spot** | LLMs cannot effectively assist reviews  | Missing machine-consumable semantic layer |

**Conclusion**: Effective documentation governance is about building a **lifecycle management mechanism**, not increasing document volume.

---

## 2. Layered Documentation Architecture (The 6-Layer Model)

Use semantic layering instead of a flat, ad hoc file pile:

```
docs/
├── 01-product/          # Business semantics layer (Why)
├── 02-architecture/     # System design layer (How)
├── 03-adr/              # Decision records layer (Why → How)
├── 04-api/              # Contract interface layer (What)
├── 05-operations/       # Operations execution layer (Run)
└── 06-ai/               # Machine-consumable layer (LLM-ready)
```

### 2.1 Product Layer (Business Semantics)

This layer explains why the system exists and prevents technical decisions from drifting away from business outcomes.

```yaml
Location: /docs/product/
Files:
  - vision.md # North Star metrics and value proposition
  - business-context.md # Domain boundaries and business rules
  - user-scenarios.md # Key user journeys
  - glossary.md # Ubiquitous Language
```

**AI value**: Provides business context for LLMs and reduces hallucinated code generation.

### 2.2 Architecture Layer (System Design)

Use the **C4 Model** as the standard representation method:

| Level         | Scope                            | Recommended Tool          | Frequency             |
| ------------- | -------------------------------- | ------------------------- | --------------------- |
| **Context**   | System and external interactions | Mermaid (Markdown-native) | With business changes |
| **Container** | Application/service boundaries   | Structurizr DSL           | Quarterly review      |
| **Component** | Module/class level               | PlantUML                  | With code refactoring |
| **Code**      | Class diagrams / ER diagrams     | IDE auto-generation       | Real-time             |

**Mandatory**: All architecture diagrams must be verifiable in CI (including link validity checks).

### 2.3 ADR Layer (Architecture Decision Records)

Document the **decision process**, not just the final result.

**Format standard** (MADR spec):

```markdown
# ADR-0012: Adopt Event Sourcing

## Status

Accepted (2024-03-15) | Supersedes ADR-0009

## Context

- Audit traceability is required
- The current CRUD model cannot satisfy time-series queries

## Decision

Use Event Sourcing + CQRS, with PostgreSQL as the Event Store

## Consequences

- ✅ Full historical state can be reconstructed
- ⚠️ Event schema evolution requires version control (see schema/evolution.md)
- ❌ Steep team learning curve; training is required
```

**Numbering rule**: Use 4-digit, zero-padded IDs; keep ADR history permanently; and indicate replacement relationships using `Status: Superseded`.

---

## 3. Docs-as-Code Technology Stack

### 3.1 Solution Selection Matrix

| Scale                            | Stack                       | Suitable Scenario                          |
| -------------------------------- | --------------------------- | ------------------------------------------ |
| **Small** (< 50k LOC)            | MkDocs + Material + Mermaid | Python/AI projects, fast startup           |
| **Medium** (microservices)       | Docusaurus + OpenAPI Plugin | JS/TS ecosystem, needs versioning          |
| **Large** (platform engineering) | Backstage TechDocs          | Multi-repo setups, needs service discovery |

### 3.2 Quality Gates

Every documentation PR must pass:

```yaml
ci:
  - markdown-lint # formatting standards
  - link-check # dead link detection (lycheeverse/lychee)
  - mermaid-render-test # diagram syntax validation
  - openapi-validate # API contract validation
  - vale-linter # writing style (Microsoft/Google style)
```

---

## 4. Single Source of Truth (SSOT) Mapping

Manual copy-paste is prohibited. All documentation must be **generated from system sources**:

| Information Type       | Source of Truth        | Documentation Generation Method |
| ---------------------- | ---------------------- | ------------------------------- |
| API contracts          | OpenAPI Spec           | `redoc-cli build`               |
| Data models            | Protobuf / JSON Schema | `protoc-gen-doc`                |
| Infrastructure         | Terraform              | `terraform-docs`                |
| Dependency graph       | Package Manager        | `nx graph` / `monorepo-deps`    |
| Runbooks               | Helm Charts + Values   | Auto-extracted annotations      |
| Architecture decisions | Git History + ADR      | `adr-log` auto-generated index  |

---

## 5. AI-Era Enhancements: LLM-Ready Documentation

2025+ standard: Documentation must serve both human developers and AI agents.

### 5.1 Repo Map

Located at `/docs/ai/repo-map.md`, this file provides global context for Claude Code / Cursor / Copilot:

```markdown
# Repo Map

## System Boundary

- **Entrypoints**: `cmd/api/main.go`, `services/web/server.ts`
- **Core domain**: `internal/domain/` (Order aggregate root)
- **Anti-corruption layer**: `adapters/external/`

## Critical Invariants

1. The order state machine must be controlled exclusively by `OrderAggregate`
2. Payment callbacks must be idempotent (validated via the `idempotency-key` header)
3. Direct cross-service database access is forbidden

## Dangerous Areas ⚠️

- `pkg/utils/legacy.go`: Contains global state and is not concurrency-safe
- `migrations/v1/`: Frozen; modification is prohibited
- `config/production.yml`: Contains sensitive secret placeholders

## Test Strategy

- Unit: `*_test.go` (fast)
- Integration: `tests/integration/` (requires Docker)
- E2E: `tests/e2e/` (requires staging environment)
```

### 5.2 Semantic File Naming

Use semantic names to improve AI retrieval and context assembly:

```
# Recommended
/docs/architecture/01-context-system.mmd
/docs/adr/0012-event-sourcing.md
/docs/ai/invariants-payment.md

# Avoid
/docs/misc/stuff.md
/docs/old/README_backup(2).md
```

---

## 6. Implementation Roadmap

### Phase 1: Infrastructure (Week 1-2)

- [ ] Establish the `docs/` directory structure
- [ ] Configure MkDocs/Docusaurus + CI pipeline
- [ ] Migrate existing README content into layered structure
- [ ] Add Markdown lint and link checks

### Phase 2: Core Documentation (Week 3-4)

- [ ] Write `product/vision.md` and `architecture/context.mmd`
- [ ] Create ADR-0001 (recording "why this documentation standard was adopted")
- [ ] Generate API documentation (OpenAPI → static site)
- [ ] Create `ai/repo-map.md`

### Phase 3: Automation and Governance (Week 5+)

- [ ] Implement a "documentation impact checklist" PR template
- [ ] Configure Terraform/OpenAPI auto-sync
- [ ] Establish documentation freshness metrics (last updated timestamps)
- [ ] Integrate semantic search (MkDocs Insiders / Algolia)

---

## 7. PR Checklist Template

All Pull Requests must explicitly declare documentation impact:

```markdown
## Documentation Impact Assessment

- [ ] **No changes** (pure refactor, no behavior changes)
- [ ] **README updated** (affects quick-start flow)
- [ ] **ADR required** (introduces new architecture decisions)
  - ADR number: \_\_\_
- [ ] **API changes** (OpenAPI spec has been synchronized)
- [ ] **Architecture diagrams** (C4 diagrams have been updated)
- [ ] **AI context** (Repo Map has been updated)
- [ ] **Deprecations** (deprecated features marked with migration path)

### Verification

- [ ] `make docs-serve` local preview runs without errors
- [ ] `make docs-lint` passes
- [ ] Dead link checks pass
```

---

## 8. Success Metrics

| Metric                      | Target Value                                            | Measurement Method       |
| --------------------------- | ------------------------------------------------------- | ------------------------ |
| **Cognitive Load**          | New team members can run the local environment on Day 1 | Onboarding time tracking |
| **Documentation Freshness** | > 90% of pages updated within 90 days                   | Git history analytics    |
| **API Coverage**            | 100% of public endpoints documented                     | OpenAPI lint             |
| **Decision Traceability**   | Key design choices all have ADRs                        | ADR index coverage       |
| **AI Adoption Rate**        | 80% of developers actively use AI coding assistants     | Survey results           |

---

## 9. Future Concepts (3-5 Year Horizon)

**Knowledge Graph as Documentation**: Current documentation is two-dimensional (a file tree). The next generation will be graph-structured: entities (services, APIs, decisions) become nodes, while dependencies, evolution, and replacement relationships become edges. With GraphRAG, AI can answer complex questions such as "What is the downstream impact of changing X on Y?" rather than relying only on keyword retrieval.

**Executable Specifications**: BDD (Behavior-Driven Development) is integrated with documentation. Given-When-Then scenarios become first-class documentation sections, and each CI run validates them—creating a closed loop where "documentation is tests, and tests are documentation."

---

## References and Inspiration

1. **MADR** - Markdown Architecture Decision Records (adr.github.io/madr)
2. **C4 Model** - Simon Brown's architecture visualization approach (c4model.com)
3. **Docs-as-Code** - Write the Docs community best practices
4. **Backstage TechDocs** - Spotify's docs-like-code implementation for microservices
5. **Claude Code Repo Map** - Anthropic's AI-assisted coding context strategy

**Inspiration**: _The best documentation lets readers decide in 30 seconds whether something is relevant to their task—instead of discovering 30 minutes later they took the wrong path._
