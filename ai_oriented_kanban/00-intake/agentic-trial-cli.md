# Agentic Trial CLI — Architecture Design Proposal

**Status**: `draft` — Pending solution architect review
**Date**: 2026-05-13
**Dependencies**: Requires RAG-powered SEO public trial system (rollout-plan.md Phases 1–3) to be complete

---

## Overview

Once the RAG-powered trial API is live, this feature extends the trial experience to a **command-line interface (CLI)** and an **agentic loop** so that developers, DevOps engineers, and technical learners can practice certification questions without opening a browser. The CLI integrates with the same public trial REST API, with an optional agentic mode that uses an LLM to simulate exam dialogue, give hints, and explain answers in conversational style.

**Problem**: Browser-based trial is insufficient for developers who:

- Work entirely in the terminal (k8s, cloud engineers)
- Want to practice while deploying or reviewing code
- Prefer keyboard-driven, distraction-free quizzing
- Are evaluating Certestic from CI/CD pipelines or automation contexts

**Goal**: Deliver a standalone CLI tool (`certestic-trial`) that consumes the same public trial endpoints as the browser, plus an opt-in agentic mode that adds LLM-driven conversational explanations and adaptive hinting.

---

## Architecture Options

### Option A: Thin CLI Client (API Consumer Only)

```
┌─────────────────────────────────────────────────────────┐
│  Local CLI (certestic-trial)                            │
│  • Calls /api/public/trial/* endpoints directly         │
│  • Renders questions in terminal (TUI or plain text)     │
│  • Stores session state in ~/.certestic/session.json    │
│  • No LLM involvement                                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS REST
                       ▼
          ┌─────────────────────────┐
          │  Public Trial API       │
          │  (Phase 3 endpoints)    │
          │  /api/public/trial/*    │
          └─────────────────────────┘
```

**Pros**: Simple, fast, cheap, no new backend required
**Cons**: No conversational explanations; dry quiz experience; limited differentiation

---

### Option B: Agentic CLI with Embedded LLM (Offline Mode)

```
┌──────────────────────────────────────────────────────────────────┐
│  Local CLI (certestic-trial)                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Agentic Loop                                             │   │
│  │  1. Fetch questions from API                            │   │
│  │  2. Display question (TUI rendering)                    │   │
│  │  3. Await user answer or command                        │   │
│  │  4. If /hint → call local LLM (Ollama) for suggestion   │   │
│  │  5. If /explain → call LLM for post-answer breakdown    │   │
│  │  6. Submit answer to API, show next question            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Dependencies: Node.js, Ollama (optional), ~/.certestic/        │
└──────────────────────────────────────────────────────────────────┘
         │ HTTPS REST                  │ local TCP
         ▼                             ▼
   Public Trial API             Ollama or local LLM
   /api/public/trial/*          (llama3, phi3, etc.)
```

**Pros**: Works offline (for hints); richer UX; no cost for hints
**Cons**: Requires Ollama setup; inconsistent quality vs hosted LLM; cold start latency

---

### Option C: Agentic CLI with Backend Orchestration (Recommended)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Local CLI (certestic-trial)                                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Agentic Loop (thin orchestration in CLI)                            │   │
│  │  1. POST /api/public/trial/visitor/init → get visitor_id           │   │
│  │  2. POST /api/public/trial/session/start → get questions           │   │
│  │  3. Render question (readline / TUI)                               │   │
│  │  4. User answers normally → POST .../event "answered"              │   │
│  │  5. /hint command → POST /api/public/trial/agentic/hint            │   │
│  │  6. /explain command → POST /api/public/trial/agentic/explain      │   │
│  │  7. Session complete → GET .../summary                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
              │ HTTPS REST
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Extended Public Trial API (new agentic endpoints)                          │
│                                                                             │
│  Existing (Phase 3):                                                        │
│    POST /api/public/trial/visitor/init                                      │
│    POST /api/public/trial/session/start                                     │
│    POST /api/public/trial/session/:id/event                                 │
│    GET  /api/public/trial/session/:id/summary                               │
│                                                                             │
│  New (Agentic, Phase 6):                                                    │
│    POST /api/public/trial/agentic/hint        → LLM hint for question      │
│    POST /api/public/trial/agentic/explain     → Post-answer explanation    │
│    POST /api/public/trial/agentic/evaluate    → Adaptive question scoring  │
│                                                                             │
│  Each agentic endpoint:                                                     │
│    - Receives question context + visitor's partial answer/intent            │
│    - Calls Genkit flow → OpenAI/Anthropic (via server-managed key)          │
│    - Rate-limited per visitor_id (5 hints/session, 10 explains/session)    │
│    - Response streamed via SSE (server-sent events)                         │
└─────────────────────────────────────────────────────────────────────────────┘
              │ Firebase Genkit
              ▼
    OpenAI (gpt-4o-mini) or
    Anthropic (claude-haiku)
```

**Pros**: Consistent LLM quality; API keys managed server-side (safe); works without local setup; same endpoint usable by browser UI later
**Cons**: Increased backend complexity; LLM cost per CLI session; SSE streaming in CLI (manageable)

---

## Recommended Approach: Option C

Option C is recommended because:

1. **API key security**: No user ever sees OpenAI/Anthropic keys; all inference managed by backend
2. **Quality consistency**: Same model version for all users (browser or CLI)
3. **Cost visibility**: All LLM calls logged in `RagGenerationRun` or new `AgenticSessionEvent` table
4. **Reusable endpoints**: Future browser UI can call the same agentic endpoints
5. **Rate limiting**: Backend enforces per-visitor hint/explain limits to cap costs

---

## CLI Component Design

### Tool Name and Distribution

```
Package name:     certestic-trial   (npm global install)
Binary:           certestic-trial or ctrial
Install:          npm install -g certestic-trial
Runtime:          Node.js ≥ 20
Config:           ~/.certestic/config.json
Session state:    ~/.certestic/sessions/<session_id>.json
```

### CLI Command Structure

```
certestic-trial
  trial <cert-slug>          Start a new trial for a certification
    --questions <n>          Number of questions (default: 5, max: 10 in beta)
    --mode [basic|agentic]   basic = plain quiz, agentic = hints/explain enabled
    --format [tui|plain]     tui = interactive terminal UI, plain = stdout/stdin

  resume                     Resume latest incomplete session
  history                    List past sessions with scores

  config set-api-url <url>   Override backend API URL (for self-hosted)
  config show                Print current configuration

  --version                  Print version
  --help                     Print help
```

### Interactive Session Flow (TUI Mode)

```
╔══════════════════════════════════════════════════════════════════╗
║  certestic-trial | CKA | Question 1 of 5                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  What is the smallest deployable unit in Kubernetes?             ║
║                                                                  ║
║  A)  A container runtime                                         ║
║  B)  A deployment abstraction                                    ║
║  C)  A Pod                             ← user highlights         ║
║  D)  A Service                                                   ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  [A-D] Answer  [H] Hint  [S] Skip  [Q] Quit                     ║
╚══════════════════════════════════════════════════════════════════╝
```

After answer:

```
╔══════════════════════════════════════════════════════════════════╗
║  ✅ Correct! You selected C.                                     ║
║                                                                  ║
║  [E] Explain why  [N] Next question  [Q] Quit                   ║
╚══════════════════════════════════════════════════════════════════╝
```

Hint mode (streamed from agentic endpoint):

```
╔══════════════════════════════════════════════════════════════════╗
║  💡 Hint (from AI):                                              ║
║  Think about what Kubernetes schedules and manages as the        ║
║  atomic unit of workload. It contains one or more containers     ║
║  and shares network namespace...▌                               ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Backend Agentic Endpoints (New in Phase 6)

### POST /api/public/trial/agentic/hint

Generates a non-revealing hint for a question using LLM.

```
POST /api/public/trial/agentic/hint
X-Trial-Visitor-Id: c1a2b3d4...
Content-Type: application/json

Body:
{
  "session_id": "session_xyz...",
  "question_id": "q_1_...",
  "visitor_intent": "string, optional"  // What user typed before asking hint
}

Response (200 OK, chunked SSE stream or JSON):
{
  "hint": "Consider the atomic unit that Kubernetes schedules...",
  "hint_id": "hint_abc...",
  "hints_remaining_this_session": 4
}
```

**Logic**:

1. Validate visitor_id + session_id (same visitor)
2. Check hint quota (≤5 per session)
3. Fetch `TrialQuestionItem` for context (question_text + rag_sources)
4. Call Genkit flow with system prompt: "Give a hint WITHOUT revealing the answer or option letters"
5. Persist hint usage in `AgenticSessionEvent` table (for analytics)
6. Return hint text (stream if `Accept: text/event-stream`)

---

### POST /api/public/trial/agentic/explain

Generates full post-answer explanation after user submits an answer.

```
POST /api/public/trial/agentic/explain
X-Trial-Visitor-Id: c1a2b3d4...
Content-Type: application/json

Body:
{
  "session_id": "session_xyz...",
  "question_id": "q_1_...",
  "selected_option": "C",
  "is_correct": true
}

Response:
{
  "explanation": "A Pod is the smallest deployable unit in Kubernetes...",
  "correct_option": "C",
  "key_concepts": ["Pod", "Container", "Kubernetes scheduling"],
  "study_reference": "Kubernetes Official Docs - Pod Overview",
  "explains_remaining": 8
}
```

**Logic**:

1. Validate visitor owns session
2. Validate question was already answered in this session (no peeking pre-answer)
3. Check explain quota (≤10 per session)
4. Fetch `TrialQuestionItem` + `rag_sources` for grounding
5. Call Genkit flow: explain correct answer, reference source material
6. Log in `AgenticSessionEvent`

---

## New Database Tables

```prisma
/// Agentic interaction event (hint request, explanation request)
model AgenticSessionEvent {
  event_id          String    @id @default(cuid())
  session_id        String                           // FK to TrialSession
  visitor_id        String                           // Denormalized for query speed
  question_id       String                           // FK to TrialQuestionItem
  event_type        String    // hint_requested | explain_requested
  response_tokens   Int       @default(0)            // LLM tokens used
  model_used        String?                          // e.g., gpt-4o-mini
  latency_ms        Int?                             // Response latency
  created_at        DateTime  @default(now())

  @@index([session_id, created_at])
  @@index([visitor_id, created_at])
  @@index([event_type, created_at])
}
```

**Why a separate table** (not merged into `TrialSessionEvent`):

- LLM metadata (tokens, model, latency) irrelevant to base event log
- Can be disabled/deleted independently if agentic mode is killed
- Separate analytics pipeline for cost attribution

---

## Rate Limiting Design

| Limit                     | Value | Scope            | Enforcement                              |
| ------------------------- | ----- | ---------------- | ---------------------------------------- |
| Hints per session         | 5     | Per `session_id` | Backend count from `AgenticSessionEvent` |
| Explains per session      | 10    | Per `session_id` | Backend count from `AgenticSessionEvent` |
| Agentic requests per hour | 20    | Per `visitor_id` | Redis counter (TTL 1h) or in-memory      |
| Sessions per IP/day       | 10    | Per IP           | Existing trial rate limit                |

**Rationale**: Each hint/explain costs ~$0.001–0.003. 5 hints + 10 explains = max ~$0.045/session.
At 1,000 agentic sessions/month = ~$45/month; acceptable for pilot.

---

## Cost Model (Agentic Extension)

| Item                     | Cost per Unit | At 500 sessions/month | At 5,000 sessions/month |
| ------------------------ | ------------- | --------------------- | ----------------------- |
| Hint (1)                 | $0.001–0.003  | $2.50                 | $25                     |
| Explain (1)              | $0.002–0.005  | $5.00                 | $50                     |
| Max per session (5H+10E) | ≤$0.045       | $22.50                | $225                    |
| All agentic responses    | —             | ~$7.50/month          | ~$75/month              |

**Kill switch**: Set `AGENTIC_ENABLED=false` env var → hint/explain endpoints return 503; CLI falls back to basic mode.

---

## CLI Technical Stack

| Concern              | Choice                                                      | Rationale                                              |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| Runtime              | Node.js 20+                                                 | Consistent with certifai-api stack; TypeScript support |
| CLI framework        | [ink](https://github.com/vadimdemedes/ink) (React for CLIs) | TUI components, keyboard handling, render lifecycle    |
| HTTP client          | `node-fetch` or `undici`                                    | Lightweight; supports SSE streaming                    |
| Config storage       | `~/.certestic/config.json`                                  | Platform-agnostic; uses node:fs                        |
| Session storage      | `~/.certestic/sessions/*.json`                              | Resume sessions across terminal restarts               |
| Package distribution | npm registry + GitHub Releases                              | Standard npm install for developers                    |
| CI testing           | Jest + `@testing-library/react` (for ink components)        | Same test stack as certifai-app                        |

---

## Security Considerations

See [Concerns](#concerns--open-questions) section below for full risk analysis.

**Key security controls**:

1. **Anonymous, not authenticated**: CLI uses same `visitor_id` cookie pattern; no credentials in local files
2. **No API keys stored on client**: All LLM calls proxied through backend
3. **Rate limiting enforced server-side**: Client cannot bypass quota by modifying requests
4. **Correct answer not revealed until post-answer**: Enforced by backend (same as browser)

---

## Implementation Phasing

This work starts **after Phase 3 of rollout-plan.md** is complete (public trial API live).

### Phase 6A: CLI Basic Mode (thin client)

- `certestic-trial trial <cert-slug>` using Phase 3 endpoints only
- TUI rendering via ink
- Local session state for resume
- npm package published

**Acceptance**: Developer can install and take 5-question trial from terminal

### Phase 6B: Agentic Endpoints (backend)

- `AgenticSessionEvent` table + migration
- `POST /api/public/trial/agentic/hint` endpoint
- `POST /api/public/trial/agentic/explain` endpoint
- Rate limiting (per session + per visitor)
- SSE streaming support
- Genkit flow integration (reuse existing pattern from certSummaryGenerator)

**Acceptance**: Backend agentic endpoints work, cost logged per call

### Phase 6C: CLI Agentic Mode

- Wire `[H] Hint` and `[E] Explain` commands to Phase 6B endpoints
- SSE stream rendering in terminal
- Graceful fallback to basic mode if `AGENTIC_ENABLED=false`

**Acceptance**: Full e2e — developer types cert slug, answers 5 questions with hints, sees final score and explanations

---

## Integration with Existing Systems

### Reuse from Phase 3 (Public Trial API)

- All 4 base endpoints unchanged: `visitor/init`, `session/start`, `session/:id/event`, `session/:id/summary`
- Visitor isolation model: CLI creates same `TrialVisitor` records as browser (same table)
- Rate limiting: Existing IP-based rate limit applies to CLI too

### Reuse from Existing certifai-api

- Genkit flows pattern (reuse from `certSummaryGenerator.ts` and `knowledgePoolingGenerator.ts`)
- Express middleware for visitor_id header validation
- Prisma ORM + PostgreSQL (add one new table: `AgenticSessionEvent`)

### New Frontend Integration (Later)

- Agentic endpoints (`/hint`, `/explain`) are REST + SSE
- Browser UI can call same endpoints using `EventSource` API
- No separate browser-specific API needed

---

## Concerns & Open Questions

### 🔴 Critical (Must Resolve Before Phase 6B)

**C1: Streaming in CLI environments**
Concern: SSE (server-sent events) is designed for browsers with `EventSource`. CLI needs `fetch` streaming or a raw HTTP/chunked response handler. Node.js supports this via `undici` or `node-fetch` with stream readers, but error handling (network interruption mid-stream) is non-trivial.
Recommendation: Implement a fallback to non-streaming JSON response; use `Accept: application/json` if client doesn't set `Accept: text/event-stream`.

**C2: LLM response quality for hints (must not reveal answer)**
Concern: The hint system prompt must prevent answer leakage ("C is correct" or "Pod starts with P"). LLM models are known to occasionally violate this constraint. A single leaked answer invalidates the test experience and could undermine trust.
Recommendation: Add answer-validator post-processing step in the Genkit flow. If response contains option letters (A/B/C/D) verbatim, retry once or return a safe fallback hint.

**C3: Cost unpredictability at scale**
Concern: If CLI goes viral or a bot abuses hint/explain endpoints, cost could spike before rate limiting catches it. Current design uses PostgreSQL count queries to check quota — this could be slow at high volume.
Recommendation: Add Redis-based rate limiting with TTL (e.g., `visitor:hint_count:{visitor_id}:{date}`). Trigger cost-alert webhook if monthly `AgenticSessionEvent` tokens exceed threshold.

**C4: Session resume across network changes (IP:UA hash changes)**
Concern: CLI users often switch networks (home → office → VPN). Each network change creates a new `anonymous_token` (IP:UA hash changes) → new `TrialVisitor`. CLI tries to resume from `~/.certestic/sessions/*.json` but visitor_id may be invalidated.
Recommendation: Store `session_id` locally and support resuming by `session_id` directly (bypass visitor init). Backend must allow `GET /api/public/trial/session/:session_id` with any valid `X-Trial-Visitor-Id` header (i.e., session lookup by ID, not enforcing strict visitor match for resumes). This is a **security trade-off** that needs architect review.

**C5: npm package supply chain risk**
Concern: Publishing `certestic-trial` to npm creates a public package. A compromised dependency or typosquatted dependency (`certestic-trials`) could steal visitor tokens or inject malicious prompts into the agentic loop.
Recommendation:

- Lock all dependencies with exact version pinning (`package-lock.json`)
- Enable npm `provenance` attestation in CI
- Add `npm audit` gate in GitHub Actions
- Register defensive typos: `certestic-trial`, `certestictrials`, `certistic-trial` on npm

---

### 🟡 Important (Must Resolve Before Phase 6C / Public Launch)

**C6: Terminal output portability**
Concern: `ink` (React for CLIs) renders beautifully in modern terminals (iTerm2, Windows Terminal, VSCode). Falls back poorly in basic TTYs (like CI pipelines, GitHub Actions, or basic `xterm`). If developer runs `certestic-trial` in a pipeline, garbled TTY output could confuse them.
Recommendation: Auto-detect TTY mode (`process.stdout.isTTY`). If not a TTY, use `--format plain` mode automatically (plain stdout/stdin, no TUI). All features still work; just no ANSI-colored box drawing.

**C7: Explain endpoint trust — can visitor request explain before answering?**
Concern: A visitor who hasn't answered yet could call `/explain` to see the correct answer without the trial counting it.
Recommendation: Backend must validate that `TrialSessionEvent` contains an `answered` or `skipped` event for `question_id` before allowing `/explain`. If no answer event found → return 403.

**C8: Offline / firewalled environments**
Concern: Corporate networks may block outbound HTTPS to certestic.com API. Developer installs CLI but can't use it at work.
Recommendation: Support `--api-url` flag (already in CLI command spec) so teams can point to a self-hosted or internal proxy. Document this as a supported use case in README.

**C9: LLM latency in terminal context**
Concern: A 3-5 second wait for a GPT response is acceptable in browser (animated spinner). In CLI, it breaks the rhythm of a fast-paced quiz. Extended wait with no feedback causes uncertainty (is it hung?).
Recommendation: Show an animated progress indicator (spinner or animated ellipsis `thinking...`) immediately on hint/explain request. Stream token-by-token when possible for perceived performance improvement.

**C10: Rate limit UX — what happens when quota is exhausted?**
Concern: User exhausts 5 hints and asks for a 6th. The current design returns an error, but the UX is unclear.
Recommendation: CLI should proactively display remaining hint/explain counts (`[H] Hint (4 left)`) so user isn't surprised. On exhaustion, show: `You've used all hints for this session. Start a new trial to get more.`

---

### 🔵 Architecture Review Points (For Solution Architects)

**A1: Should CLI have its own dedicated API surface?**
This design reuses public trial endpoints (`/api/public/trial/*`) for CLI, plus adds `/api/public/trial/agentic/*`. Alternative: create a separate `cli/` API namespace with JWT-token-authenticated CLI sessions (revocable, trackable). Vote needed: anonymous vs identifiable CLI sessions.

**A2: Should agentic endpoints live under `/api/public/` or `/api/internal/`?**
Current design: `/api/public/trial/agentic/hint` — accessible to any client (browser or CLI).
Alternative: `/api/internal/trial/agentic/hint` — only callable by trusted backend (e.g., Next.js API route).
Consideration: If public, any third-party can abuse hint/explain at scale. If internal, CLI must route through a Next.js proxy, adding latency and coupling.

**A3: Rate limiting storage: PostgreSQL count vs Redis TTL?**
Current design counts `AgenticSessionEvent` rows in PostgreSQL for quota check. At low volume this is fine. At high volume, each hint request triggers a `COUNT(*)` query.
Question: Is Redis available in production? Checking certifai-api redis-cache.md. If Redis is live, use it for rate limiting counters. If not, PostgreSQL is acceptable for pilot.

**A4: Where does the CLI private package key live?**
If CLI is closed-source: npm `@certestic/trial` scoped package needs npm org + auth token.
If open-source: no token, just publish to public npm.
Architecture decision: Should users see/fork the CLI source? Brand transparency vs IP protection?

**A5: Genkit flow design for hint vs explain**
These are similar but distinct prompts. Options:

- One Genkit flow with `mode: hint | explain` parameter
- Two separate Genkit flows (more modular, easier to tune independently)
  Recommendation: Two flows initially (easier to tune prompts separately). Can consolidate later.

**A6: Self-hosted / enterprise deployment**
Should the CLI support a fully self-hosted backend (no certestic.com dependency)?
This would require shipping Genkit + Pinecone setup instructions alongside the CLI docs. Adds significant ops burden but enables enterprise sales.
Decision needed: Is enterprise self-hosting a target use case in current roadmap?

---

## Phased Decisions Summary

| Decision                   | Options                           | Recommended               | Needs Architect Approval |
| -------------------------- | --------------------------------- | ------------------------- | ------------------------ |
| Session auth model         | Anonymous visitor_id vs JWT token | Anonymous (reuse Phase 3) | A1                       |
| Agentic endpoint namespace | /public/ vs /internal/            | /public/ with rate limits | A2                       |
| Rate limit storage         | PostgreSQL vs Redis               | Check if Redis available  | A3                       |
| Package visibility         | Open-source vs scoped private     | Open-source               | A4                       |
| Genkit flow structure      | One flow vs two flows             | Two flows                 | A5                       |
| Enterprise self-hosting    | Yes vs No                         | No (out of scope)         | A6                       |

---

## Next Steps

1. **Solution architect review** of this document — resolve A1–A6 above
2. **Security review** of C1–C5 (critical concerns)
3. Wait for rollout-plan.md Phases 1–3 to complete
4. Create `kanban/backlogs/agentic-trial-cli-phase-6a-rollout.md` (thin CLI client)
5. Create `kanban/backlogs/agentic-trial-cli-phase-6b-rollout.md` (backend agentic endpoints)
6. Create `kanban/backlogs/agentic-trial-cli-phase-6c-rollout.md` (CLI agentic mode)

---

## References

- **Public trial API specs**: [kanban/WIP/rag-empowered-seo/api-design.md](../WIP/rag-empowered-seo/api-design.md)
- **Data structure & schema**: [kanban/WIP/rag-empowered-seo/data-structure.md](../WIP/rag-empowered-seo/data-structure.md)
- **RAG rollout plan**: [kanban/WIP/rag-empowered-seo/rollout-plan.md](../WIP/rag-empowered-seo/rollout-plan.md)
- **Redis cache architecture**: [docs/architecture/redis-cache.md](../../docs/architecture/redis-cache.md)
- **Genkit existing flows**: `functions/src/services/genkit/certSummaryGenerator.ts`, `knowledgePoolingGenerator.ts`
