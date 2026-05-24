# RAG Public Trial - Quick Reference Guide

This file is your companion while implementing. Use Ctrl+F to find patterns, gotchas, and code snippets.

---

## Quick Lookup Table

| Need                   | File                                | Section                         |
| ---------------------- | ----------------------------------- | ------------------------------- |
| Full API endpoints     | api-design.md                       | §1-3                            |
| Prisma schema          | data-structure.md                   | §1.2                            |
| Migration SQL          | data-structure.md                   | §1.3                            |
| Pinecone setup         | data-structure.md                   | §2                              |
| Why visitor ≠ user?    | rag-public-trial-decision-record.md | Decision #1                     |
| Implementation gotchas | rag-public-trial-implementation.md  | "Critical Gotchas"              |
| Phase checklist        | rag-public-trial-implementation.md  | "Testing Checklist per Phase"   |
| Cost tracking          | rag-public-trial-architecture.md    | "Cost Controls & Kill Switches" |
| Rollout phases         | rollout-plan.md                     | "Phase 1-5"                     |

---

## Phase 1 Checklist (Rare-Cert + Pinecone)

- [ ] Create `src/config/trial-certs.json` with 5-12 certs
- [ ] Set env vars: `PINECONE_API_KEY`, `OPENAI_API_KEY`
- [ ] Create Pinecone index `certifai-public-trial-v1` (serverless, 1536-dim, cosine)
- [ ] Implement `POST /api/admin/trial/config` endpoint
- [ ] Implement `POST /api/admin/trial/index-cert` endpoint
- [ ] Create `RagGenerationRun` table in Prisma
- [ ] Test: Index one cert, verify vectors in Pinecone, cost logged

**Success Criteria**:

- Pinecone namespace `cert_1_cka` exists with >1000 vectors
- Admin can call `POST /api/admin/trial/index-cert --cert-slug cka`
- Cost appears in PostgreSQL `RagGenerationRun` table

---

## Phase 2 Checklist (Generation)

- [ ] Create `TrialQuestionSet` and `TrialQuestionItem` tables (Prisma migration)
- [ ] Create `RagRetrievalChunk` table
- [ ] Implement `POST /api/admin/trial/generate-questions` endpoint
- [ ] Implement retrieval: Query Pinecone with `filter={cert_id: X}`
- [ ] Implement generation: Call `gpt-4o-mini` with RAG context + system prompt
- [ ] Implement `PATCH /api/admin/trial/question-set/:set_id` publish endpoint
- [ ] Test: Generate 5 questions, review quality, publish

**Success Criteria**:

- Admin can generate questions and review (status=draft)
- Questions include `rag_sources` JSON with citations
- Admin can publish (status changes to published)
- Cost logged in `RagGenerationRun` table

---

## Phase 3 Checklist (Public API)

- [ ] Create `TrialVisitor`, `TrialSession`, `TrialSessionEvent` tables
- [ ] Implement `POST /api/public/trial/visitor/init` endpoint
  - SHA256(IP + UA) → anonymous_token
  - Idempotent: same IP:UA → same visitor_id
- [ ] Implement `POST /api/public/trial/session/start` endpoint
  - Validate cert in trial-certs.json allowlist
  - Fetch published questions (status=published)
  - **Never return `correct_option`**
- [ ] Implement `POST /api/public/trial/session/:session_id/event`
  - Validate visitor_id header
  - Persist event (append-only)
  - Update session counters in same transaction
- [ ] Implement `GET /api/public/trial/session/:session_id/summary`
  - **Now return `correct_option`**
  - Calculate score, correctness flags
- [ ] Frontend: Store visitor_id in HttpOnly cookie `trial_visitor_id`

**Success Criteria**:

- Anonymous visitor can take 5-question trial without auth
- Questions not revealed until session complete
- Visitor data isolated (no FK to User tables)
- Event sequencing correct (answered → calculated is_correct)

---

## Phase 4 Checklist (Analytics)

- [ ] Create nightly cron: `POST /api/internal/trial/metrics/aggregate-daily`
  - Listen to TrialSession + TrialSessionEvent
  - Aggregate by cert_id + difficulty + drop-off-question
  - Write to Firestore `public_trial/daily_metrics/{cert_slug}/{date}`
- [ ] Implement `GET /api/admin/trial/analytics` endpoint
  - Read from Firestore + live PostgreSQL (for today)
  - Return: sessions_started, sessions_completed, completion_rate, drop_off analysis
- [ ] Implement cleanup cron: Delete TrialVisitor with `expires_at < NOW()`

**Success Criteria**:

- Admin sees daily funnel: 100 started → 20 completed
- Drop-off visible per question
- Nightly job runs without errors

---

## Common Mistakes to Avoid

### 1. Revealing `correct_option` too early

❌ Wrong:

```typescript
GET /api/public/trial/session/start
→ { "questions": [ { "correct_option": "C", ... } ] }
```

✓ Correct:

```typescript
GET /api/public/trial/session/start
→ { "questions": [ { "option_a": "...", "option_b": "...", ... } ] }

GET /api/public/trial/session/:id/summary
→ { "results": [ { "correct_option": "C", "is_correct": true, ... } ] }
```

### 2. Not validating visitor_id on event POST

❌ Wrong:

```typescript
POST /api/public/trial/session/:session_id/event
// No check: visitor_id from header vs session.visitor_id
→ Visitor A can answer Visitor B's questions
```

✓ Correct:

```typescript
const session = await prisma.trialSession.findUnique({
  where: { session_id },
  include: { visitor: true },
});
if (session.visitor_id !== headerVisitorId) {
  throw new UnauthorizedError("Visitor mismatch");
}
```

### 3. Updating counters outside transaction

❌ Wrong:

```typescript
await prisma.trialSessionEvent.create({ data: event });
await prisma.trialSession.update({
  where: { session_id },
  data: { questions_answered: { increment: 1 } },
});
// Race: event exists but count not updated
```

✓ Correct:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.trialSessionEvent.create({ data: event });
  await tx.trialSession.update({
    where: { session_id },
    data: { questions_answered: { increment: 1 } },
  });
});
```

### 4. Not setting expires_at on visitor creation

❌ Wrong:

```typescript
const visitor = await prisma.trialVisitor.create({
  data: { visitor_id, anonymous_token },
  // No expires_at → visitor lives forever
});
```

✓ Correct:

```typescript
const visitor = await prisma.trialVisitor.create({
  data: {
    visitor_id,
    anonymous_token,
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
});
```

### 5. Not filtering Pinecone by cert_id

❌ Wrong:

```typescript
const results = await pinecone.query(embedding, {
  topK: 3,
  // namespace: 'cert_1_cka'  // Forgot this!
});
// Returns chunks from all certs, mix of topics
```

✓ Correct:

```typescript
const results = await pinecone.query(embedding, {
  topK: 3,
  namespace: `cert_${cert_id}_${cert_slug}`,
});
// Only returns chunks from this cert
```

### 6. Anonymous token collision (IP only)

❌ Wrong:

```typescript
const anonymousToken = ip; // "203.0.113.42"
// Two users at same office → same visitor!
```

✓ Correct:

```typescript
const anonymousToken = crypto
  .createHash("sha256")
  .update(`${ip}:${userAgent}`)
  .digest("hex");
// Different users at same office → different tokens
```

### 7. Forgetting JSON response_format for GPT

❌ Wrong:

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Generate 5 questions as JSON..." }],
  // No response_format
});
// Parsing fails, returns text instead of structured JSON
```

✓ Correct:

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: { type: "json_object" },
  messages: [{ role: "user", content: "Generate 5 questions as JSON..." }],
});
// Guaranteed JSON structure
```

---

## Code Snippets to Copy-Paste

### Anonymous Token Generation

```typescript
import crypto from "crypto";

function generateAnonymousToken(ipAddress: string, userAgent: string): string {
  return crypto
    .createHash("sha256")
    .update(`${ipAddress}:${userAgent}`)
    .digest("hex");
}
```

### Visitor Upsert (Idempotent)

```typescript
const visitor = await prisma.trialVisitor.upsert({
  where: { anonymous_token },
  update: { last_activity_at: new Date() },
  create: {
    visitor_id: generateId(),
    anonymous_token,
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
});
```

### Event Persist + Counter Update (Transactional)

```typescript
await prisma.$transaction(async (tx) => {
  const event = await tx.trialSessionEvent.create({
    data: {
      event_id: generateId(),
      session_id,
      trial_question_id,
      event_type,
      selected_option,
      is_correct:
        event_type === "answered" ? selected_option === correctOption : null,
      elapsed_ms,
    },
  });

  if (event_type === "answered") {
    await tx.trialSession.update({
      where: { session_id },
      data: {
        questions_answered: { increment: 1 },
        ...(event.is_correct && {
          questions_correct: { increment: 1 },
        }),
      },
    });
  }

  return event;
});
```

### Pinecone Retrieval with Cert Filter

```typescript
async function retrieveContextChunks(
  certId: number,
  query: string,
  topK: number = 3,
): Promise<RetrievalChunk[]> {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const results = await pinecone.query({
    vector: embedding.data[0].embedding,
    topK,
    namespace: `cert_${certId}_${certSlug}`,
    includeMetadata: true,
  });

  return results.matches.map((match) => ({
    source: match.metadata.source_name,
    relevance: match.score,
    text: match.metadata.text,
  }));
}
```

---

## Environment Variables Required

```bash
# Pinecone
PINECONE_API_KEY=xxxx
PINECONE_INDEX_NAME=certifai-public-trial-v1

# OpenAI
OPENAI_API_KEY=xxxx
OPENAI_ORG_ID=xxxx (optional)

# Feature Toggles
RAG_ENABLED=true
RAG_COST_LIMIT_MONTHLY_CENTS=10000  # $100/month

# Database
DATABASE_URL=postgresql://...

# Firebase (for admin auth)
FIREBASE_PROJECT_ID=xxxx
FIREBASE_PRIVATE_KEY=xxxx
FIREBASE_CLIENT_EMAIL=xxxx
```

---

## Monitoring Queries (Copy to Observability)

### Daily Cost Check

```sql
SELECT
  DATE(created_at) as date,
  cert_id,
  SUM(generation_cost_tokens) as total_tokens,
  SUM(generation_cost_tokens) * 0.00002 as cost_usd
FROM RagGenerationRun
WHERE status = 'success'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), cert_id
ORDER BY date DESC, cost_usd DESC;
```

### Visitor Funnel (Daily)

```sql
SELECT
  ts.cert_id,
  c.name as cert_name,
  DATE(ts.created_at) as date,
  COUNT(DISTINCT ts.session_id) as sessions_started,
  COUNT(DISTINCT CASE WHEN ts.completed_at IS NOT NULL THEN ts.session_id END) as completed,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN ts.completed_at IS NOT NULL THEN ts.session_id END) / COUNT(DISTINCT ts.session_id), 1) as completion_rate_pct
FROM TrialSession ts
JOIN Certification c ON ts.cert_id = c.id
WHERE ts.created_at >= NOW() - INTERVAL '7 days'
GROUP BY ts.cert_id, c.name, DATE(ts.created_at)
ORDER BY date DESC, completion_rate_pct DESC;
```

### Data Contamination Check (Weekly Audit)

```sql
-- Should return 0 rows (no FKs from Trial to User)
SELECT COUNT(*) FROM TrialSession
WHERE visitor_id IN (SELECT user_id FROM User);

-- Should return 0 rows (no cross-contamination)
SELECT COUNT(*) FROM TrialSessionEvent tse
WHERE NOT EXISTS (
  SELECT 1 FROM TrialSession ts
  WHERE ts.session_id = tse.session_id
);
```

---

## Rollback Procedures

**If Phase 1 Pinecone breaks**:

```bash
# Delete problematic namespace
curl -X DELETE "https://api.pinecone.io/indexes/certifai-public-trial-v1/namespaces/cert_1_cka" \
  -H "Api-Key: $PINECONE_API_KEY"

# Re-index
POST /api/admin/trial/index-cert
{ "cert_slug": "cka", "action": "backfill" }
```

**If Phase 2 Generation quality is bad**:

```bash
# Set ragMode to off (fallback to non-RAG)
PATCH /api/admin/trial/config/cka
{ "ragMode": "off" }

# Or delete published set and regenerate
PATCH /api/admin/trial/question-set/:set_id
{ "status": "archived" }
```

**If Phase 3 visitor API breaks**:

```bash
# Set global kill switch
export RAG_ENABLED=false

# Or disable trial entirely
DELETE /api/admin/trial/config/:cert_id
```

---

## References

- **Detailed decisions**: See `rag-public-trial-decision-record.md`
- **Common gotchas**: See `rag-public-trial-implementation.md`
- **Overall architecture**: See `rag-public-trial-architecture.md`
- **Full API specs**: See `api-design.md`
- **Database schema**: See `data-structure.md`
- **Roadmap**: See `rollout-plan.md`
