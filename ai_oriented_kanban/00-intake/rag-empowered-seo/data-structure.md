# Data Structure Design: RAG + Visitor Trial System

## Overview

This document specifies the exact database modifications, Pinecone indexing architecture, and OpenAI integration required to implement the public RAG-powered trial system while keeping visitor data completely isolated from authenticated user data.

---

## 1. Prisma Schema Additions (PostgreSQL)

All new tables are **visitor-specific** with **zero foreign keys to `User`, `ExamAttempt`, or user-owned tables**.

### 1.1 Migration File Naming Convention

```
functions/prisma/migrations/YYYYMMDDHHMMSS_public_trial_visitor_setup/migration.sql
```

Example: `functions/prisma/migrations/20260513140000_public_trial_visitor_setup/migration.sql`

---

### 1.2 Full Schema Definition

Add to `functions/prisma/schema.prisma`:

```prisma
// ============================================================================
// PUBLIC TRIAL VISITOR SCHEMA (Completely isolated from User ecosystem)
// ============================================================================

/// Anonymous visitor fingerprint (no PII, no User FK)
model TrialVisitor {
  /// Unique visitor ID (cuid)
  visitor_id        String    @id @default(cuid())

  /// SHA256(IP:UserAgent) or similar fingerprint for lightweight tracking
  /// @guaranteed
  anonymous_token   String    @unique @db.VarChar(255)

  /// Optional IP hash for rate-limiting (never expose raw IP)
  /// @optional
  ip_hash           String?   @db.VarChar(255)

  /// User-agent fingerprint for device consistency
  /// @optional
  ua_hash           String?   @db.VarChar(255)

  /// Whether this visitor explicitly consented to tracking (future expansion)
  /// @guaranteed
  tracking_consented Boolean  @default(false)

  /// When visitor first appeared
  /// @guaranteed
  created_at        DateTime  @default(now())

  /// Last activity timestamp (for cleanup queries)
  /// @guaranteed
  last_activity_at  DateTime  @updatedAt

  /// Retention cutoff (90 days by default, soft-delete marker)
  /// @guaranteed
  expires_at        DateTime  @default(dbgenerated("now() + interval '90 days'"))

  /// Session relationship (1:N)
  sessions          TrialSession[]

  /// Indexes for analytics queries
  @@index([created_at])
  @@index([expires_at])
  @@unique([anonymous_token])
}

/// A visitor's trial session for a specific certification
model TrialSession {
  /// Unique session ID
  session_id        String    @id @default(cuid())

  /// FK to TrialVisitor (NOT User)
  /// @guaranteed
  visitor_id        String

  /// FK to Certification.cert_id (read-only join for cert name/slug)
  /// @guaranteed
  cert_id           Int

  /// When session started
  /// @guaranteed
  started_at        DateTime  @default(now())

  /// When session completed (NULL if still in progress or abandoned)
  /// @optional
  completed_at      DateTime?

  /// Snapshot counts (updated as events arrive)
  /// @guaranteed
  questions_viewed  Int       @default(0)
  questions_answered Int      @default(0)
  questions_correct Int       @default(0)

  /// Denormalized reference to the TrialQuestionSet used in this session
  /// (allows later retrieval of all questions shown)
  /// @optional
  question_set_id   String?   @db.VarChar(25)

  /// Session metadata
  created_at        DateTime  @default(now())

  /// Relationships
  visitor           TrialVisitor @relation(fields: [visitor_id], references: [visitor_id], onDelete: Cascade)
  events            TrialSessionEvent[]

  /// Indexes for funnel queries
  @@index([visitor_id, created_at])
  @@index([cert_id, created_at])
  @@index([cert_id, completed_at]) // For completion rate queries
  @@index([created_at]) // For time-based aggregation
}

/// Event stream within a trial session (append-only log)
model TrialSessionEvent {
  /// Unique event ID
  event_id          String    @id @default(cuid())

  /// FK to TrialSession
  /// @guaranteed
  session_id        String

  /// FK to TrialQuestionItem (null for non-question events like "trial_exit")
  /// @optional
  trial_question_id String?   @db.VarChar(25)

  /// Event type: question_viewed | answered | skipped | trial_completed | trial_exit
  /// @guaranteed
  event_type        String    @db.VarChar(50)

  /// Selected answer (A, B, C, D) — only populated if event_type = 'answered'
  /// @optional
  selected_option   String?   @db.VarChar(1)

  /// Whether answer was correct (NULL if not answered yet)
  /// @optional
  is_correct        Boolean?

  /// Milliseconds spent on this question
  /// @optional
  elapsed_ms        Int?

  /// Timestamp of event
  /// @guaranteed
  created_at        DateTime  @default(now())

  /// Relationships
  session           TrialSession @relation(fields: [session_id], references: [session_id], onDelete: Cascade)

  /// Indexes for event stream processing and analytics
  @@index([session_id, created_at])
  @@index([trial_question_id]) // For question-level event aggregation
  @@index([event_type]) // For filtering by event type
}

/// Generated trial question set (published content, no user data)
model TrialQuestionSet {
  /// Unique set ID
  set_id            String    @id @default(cuid())

  /// FK to Certification.cert_id
  /// @guaranteed
  cert_id           Int

  /// FK to RagGenerationRun.run_id (audit trail)
  /// @optional
  generation_run_id String?

  /// Requested question count
  /// @guaranteed
  question_count    Int

  /// Lifecycle status: draft | published | archived
  /// @guaranteed
  status            String    @db.VarChar(50) @default("draft")

  /// When set was created (may be BEFORE publication)
  created_at        DateTime  @default(now())

  /// When set was published (first made available to visitors)
  /// @optional
  published_at      DateTime?

  /// When set was archived (no longer served to new sessions)
  /// @optional
  archived_at       DateTime?

  /// Relationships
  questions         TrialQuestionItem[]

  /// Indexes for content discovery
  @@index([cert_id, published_at])
  @@index([status, published_at]) // For finding "currently active" sets
}

/// Individual trial question (content, no user PII)
model TrialQuestionItem {
  /// Unique question ID
  question_id       String    @id @default(cuid())

  /// FK to TrialQuestionSet
  /// @guaranteed
  set_id            String

  /// Denormalized cert_id for query speed (avoid JOINs on hot path)
  /// @guaranteed
  cert_id           Int

  /// Question stem/prompt
  /// @guaranteed
  question_text     String    @db.Text

  /// Explanation (why answer is correct, exam tips)
  /// @optional
  explanation       String?   @db.Text

  /// Topic/domain from exam blueprint (e.g., "Architecture", "Security")
  /// @optional
  topic             String?   @db.VarChar(255)

  /// Difficulty: EASY | ADVANCED | EXPERT
  /// @guaranteed
  difficulty        String    @db.VarChar(50)

  /// Answer options (denormalized for performance)
  /// @guaranteed
  option_a          String    @db.Text
  option_b          String    @db.Text
  option_c          String    @db.Text
  option_d          String    @db.Text

  /// Correct answer: A | B | C | D
  /// @guaranteed
  correct_option    String    @db.VarChar(1)

  /// RAG sources as JSON array (denormalized for easy access)
  /// Schema: [{ "source": "AWS Docs", "url": "https://...", "relevance": 0.87 }]
  /// @optional
  rag_sources       Json?

  /// When question was generated/added to set
  created_at        DateTime  @default(now())

  /// Relationships
  question_set      TrialQuestionSet @relation(fields: [set_id], references: [set_id], onDelete: Cascade)

  /// Indexes for lookup and analytics
  @@index([set_id])
  @@index([cert_id])
  @@index([difficulty])
  @@index([topic])
}

/// RAG generation run (metadata, not user-specific)
model RagGenerationRun {
  /// Unique run ID
  run_id            String    @id @default(cuid())

  /// FK to Certification.cert_id
  /// @guaranteed
  cert_id           Int

  /// Admin/user ID who triggered generation (not a trial visitor)
  /// @guaranteed
  triggered_by      String    @db.VarChar(255)

  /// RAG mode: off | gen_only | hybrid
  /// @guaranteed
  rag_mode          String    @db.VarChar(50)

  /// Number of retrieval queries performed
  /// @guaranteed
  retrieval_count   Int       @default(0)

  /// OpenAI token cost (for cost tracking)
  /// @guaranteed
  generation_cost_tokens Int @default(0)

  /// Pinecone retrieval cost estimate (queries × price per query)
  /// @guaranteed
  retrieval_cost_estimate Float @default(0.0)

  /// Lifecycle: pending | in_progress | success | failed
  /// @guaranteed
  status            String    @db.VarChar(50)

  /// Error message (only if status = failed)
  /// @optional
  error_message     String?   @db.Text

  /// When run started
  created_at        DateTime  @default(now())

  /// When run started/resumed (for timeout tracking)
  started_at        DateTime  @default(now())

  /// When run completed
  /// @optional
  completed_at      DateTime?

  /// Indexes for audit and cost analysis
  @@index([cert_id, created_at])
  @@index([status, created_at]) // For finding pending/failed runs
  @@index([triggered_by, created_at]) // For user audit trail
}

/// RAG metadata: retrieval chunks stored alongside generated questions
model RagRetrievalChunk {
  /// Unique chunk ID
  chunk_id          String    @id @default(cuid())

  /// FK to RagGenerationRun (links chunk to generation event)
  /// @guaranteed
  generation_run_id String

  /// Source document/artifact (e.g., "AWS Exam Blueprint", "Official Study Guide")
  /// @guaranteed
  source_name       String    @db.VarChar(255)

  /// URL to source (if available)
  /// @optional
  source_url        String?   @db.Text

  /// Full text of retrieved chunk
  /// @guaranteed
  chunk_text        String    @db.Text

  /// Pinecone similarity score (0.0–1.0)
  /// @guaranteed
  similarity_score  Float

  /// Which question(s) this chunk informed (JSON array of question_ids)
  /// @optional
  informed_question_ids Json?

  /// When chunk was retrieved
  created_at        DateTime  @default(now())

  @@index([generation_run_id])
  @@index([source_name])
}

// ============================================================================
// INDEXES FOR HIGH-VOLUME ANALYTICS QUERIES
// ============================================================================

// TrialSession compound indexes (already listed above, but documenting intent):
// - (visitor_id, created_at): For "all sessions by visitor"
// - (cert_id, created_at): For "visitor funnel by cert, time-ordered"
// - (cert_id, completed_at): For "completion rate metric"
// - (created_at): For "daily active session count"

// TrialSessionEvent indexes (already listed above):
// - (session_id, created_at): For "event log replay, ordered"
// - (trial_question_id): For "question-level event aggregation"
// - (event_type): For "filter by event type"
```

---

### 1.3 Migration File Content

File: `functions/prisma/migrations/20260513140000_public_trial_visitor_setup/migration.sql`

```sql
-- CreateTable TrialVisitor
CREATE TABLE "TrialVisitor" (
    "visitor_id" TEXT NOT NULL PRIMARY KEY,
    "anonymous_token" VARCHAR(255) NOT NULL UNIQUE,
    "ip_hash" VARCHAR(255),
    "ua_hash" VARCHAR(255),
    "tracking_consented" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '90 days')
);

CREATE INDEX "TrialVisitor_created_at_idx" ON "TrialVisitor"("created_at");
CREATE INDEX "TrialVisitor_expires_at_idx" ON "TrialVisitor"("expires_at");

-- CreateTable TrialSession
CREATE TABLE "TrialSession" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "visitor_id" TEXT NOT NULL,
    "cert_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "questions_viewed" INTEGER NOT NULL DEFAULT 0,
    "questions_answered" INTEGER NOT NULL DEFAULT 0,
    "questions_correct" INTEGER NOT NULL DEFAULT 0,
    "question_set_id" VARCHAR(25),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrialSession_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "TrialVisitor"("visitor_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TrialSession_visitor_id_created_at_idx" ON "TrialSession"("visitor_id", "created_at");
CREATE INDEX "TrialSession_cert_id_created_at_idx" ON "TrialSession"("cert_id", "created_at");
CREATE INDEX "TrialSession_cert_id_completed_at_idx" ON "TrialSession"("cert_id", "completed_at");
CREATE INDEX "TrialSession_created_at_idx" ON "TrialSession"("created_at");

-- CreateTable TrialSessionEvent
CREATE TABLE "TrialSessionEvent" (
    "event_id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "trial_question_id" VARCHAR(25),
    "event_type" VARCHAR(50) NOT NULL,
    "selected_option" VARCHAR(1),
    "is_correct" BOOLEAN,
    "elapsed_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrialSessionEvent_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "TrialSession"("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TrialSessionEvent_session_id_created_at_idx" ON "TrialSessionEvent"("session_id", "created_at");
CREATE INDEX "TrialSessionEvent_trial_question_id_idx" ON "TrialSessionEvent"("trial_question_id");
CREATE INDEX "TrialSessionEvent_event_type_idx" ON "TrialSessionEvent"("event_type");

-- CreateTable TrialQuestionSet
CREATE TABLE "TrialQuestionSet" (
    "set_id" TEXT NOT NULL PRIMARY KEY,
    "cert_id" INTEGER NOT NULL,
    "generation_run_id" TEXT,
    "question_count" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3)
);

CREATE INDEX "TrialQuestionSet_cert_id_published_at_idx" ON "TrialQuestionSet"("cert_id", "published_at");
CREATE INDEX "TrialQuestionSet_status_published_at_idx" ON "TrialQuestionSet"("status", "published_at");

-- CreateTable TrialQuestionItem
CREATE TABLE "TrialQuestionItem" (
    "question_id" TEXT NOT NULL PRIMARY KEY,
    "set_id" TEXT NOT NULL,
    "cert_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "explanation" TEXT,
    "topic" VARCHAR(255),
    "difficulty" VARCHAR(50) NOT NULL,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct_option" VARCHAR(1) NOT NULL,
    "rag_sources" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrialQuestionItem_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "TrialQuestionSet"("set_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TrialQuestionItem_set_id_idx" ON "TrialQuestionItem"("set_id");
CREATE INDEX "TrialQuestionItem_cert_id_idx" ON "TrialQuestionItem"("cert_id");
CREATE INDEX "TrialQuestionItem_difficulty_idx" ON "TrialQuestionItem"("difficulty");
CREATE INDEX "TrialQuestionItem_topic_idx" ON "TrialQuestionItem"("topic");

-- CreateTable RagGenerationRun
CREATE TABLE "RagGenerationRun" (
    "run_id" TEXT NOT NULL PRIMARY KEY,
    "cert_id" INTEGER NOT NULL,
    "triggered_by" VARCHAR(255) NOT NULL,
    "rag_mode" VARCHAR(50) NOT NULL,
    "retrieval_count" INTEGER NOT NULL DEFAULT 0,
    "generation_cost_tokens" INTEGER NOT NULL DEFAULT 0,
    "retrieval_cost_estimate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" VARCHAR(50) NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3)
);

CREATE INDEX "RagGenerationRun_cert_id_created_at_idx" ON "RagGenerationRun"("cert_id", "created_at");
CREATE INDEX "RagGenerationRun_status_created_at_idx" ON "RagGenerationRun"("status", "created_at");
CREATE INDEX "RagGenerationRun_triggered_by_created_at_idx" ON "RagGenerationRun"("triggered_by", "created_at");

-- CreateTable RagRetrievalChunk
CREATE TABLE "RagRetrievalChunk" (
    "chunk_id" TEXT NOT NULL PRIMARY KEY,
    "generation_run_id" TEXT NOT NULL,
    "source_name" VARCHAR(255) NOT NULL,
    "source_url" TEXT,
    "chunk_text" TEXT NOT NULL,
    "similarity_score" DOUBLE PRECISION NOT NULL,
    "informed_question_ids" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "RagRetrievalChunk_generation_run_id_idx" ON "RagRetrievalChunk"("generation_run_id");
CREATE INDEX "RagRetrievalChunk_source_name_idx" ON "RagRetrievalChunk"("source_name");
```

---

## 2. Pinecone Indexing Architecture

### 2.1 Index Configuration

**Index Name**: `certifai-public-trial-v1`

**Settings**:

```json
{
  "dimension": 1536,
  "metric": "cosine",
  "spec": {
    "serverless": {
      "cloud": "aws",
      "region": "us-east-1"
    }
  },
  "metadata_config": {
    "indexed": ["cert_id", "cert_slug", "source_type", "chunk_index"]
  }
}
```

**Rationale**:

- `dimension: 1536` — matches OpenAI `text-embedding-3-small` output
- `metric: cosine` — standard for text similarity
- `serverless` — cost-efficient, scales on-demand
- `metadata_config.indexed` — enables filtering by cert without scanning all vectors

---

### 2.2 Namespace Strategy

Each certification gets its own **namespace** for logical isolation:

```
Namespace Convention:  cert_{cert_id}_{cert_slug}
Examples:
  - cert_1_cka
  - cert_2_cissp-issmp
  - cert_3_hashicorp-terraform-associate
```

**Why namespacing**:

- Supports per-cert RAG mode toggles (e.g., disable CI for one cert)
- Cleaner cost allocation (Pinecone pricing by namespace)
- Easy cleanup (delete namespace when retiring cert)
- Prevents accidental cross-cert contamination

---

### 2.3 Vector Metadata Schema

Each vector in Pinecone carries metadata:

```json
{
  "cert_id": 1,
  "cert_slug": "cka",
  "source_type": "exam_blueprint | study_guide | official_docs | community_resource",
  "source_name": "AWS Exam Blueprint",
  "source_url": "https://...",
  "chunk_index": 0,
  "chunk_text": "Full text of the chunk (for reference, not searchable)",
  "content_hash": "sha256(chunk_text)",
  "created_at": "2026-05-13T10:00:00Z",
  "indexed_at": "2026-05-13T10:05:00Z",
  "version": "1"
}
```

---

### 2.4 Backfill & Indexing Pipeline

#### Phase 1: One-Time Backfill (Manual Trigger)

**Trigger**: Admin CLI command or internal endpoint

```bash
# Example CLI command
node scripts/indexPinecone.ts --cert-slug cka --rag-mode hybrid --dry-run
```

**Process**:

1. Read allowed certs from `trial-certs.json`
2. For each cert, collect certified artifacts:
   - Official exam blueprint (PDF → text chunks)
   - Published study guides (markdown → text chunks)
   - Community-vetted resource links
3. Chunk documents with **overlap strategy**:
   - Chunk size: 500 tokens (≈2000 characters)
   - Overlap: 100 tokens for context
4. Generate embeddings via OpenAI API:
   - Batch size: 20 chunks (to stay under rate limits)
   - Model: `text-embedding-3-small`
   - Cost: ≈$0.02 per million tokens
5. Upsert vectors to Pinecone with metadata
6. Log retrieval counts and cost to `RagGenerationRun` table

#### Phase 2: Incremental Updates (Manual Trigger)

When source documents are updated:

```bash
node scripts/indexPinecone.ts --cert-slug cka --action update --source "exam_blueprint"
```

**Process**:

1. Detect changed files (checksum comparison)
2. Delete vectors with `source_type == "exam_blueprint"` for that cert
3. Re-chunk and re-embed changed content
4. Upsert new vectors
5. Log as new `RagGenerationRun` entry

---

### 2.5 Retrieval Strategy (Query Time)

#### Query Pattern:

```python
# Pseudocode for backend retrieval service
def retrieve_grounding_chunks(
    cert_id: int,
    cert_slug: str,
    question_topic: str,
    top_k: int = 3
) -> List[RetrievalChunk]:
    """Retrieve top-k relevant chunks from Pinecone."""

    # Generate query embedding
    query_embedding = openai_embed(f"{question_topic} {cert_slug}")

    # Search in cert-specific namespace
    namespace = f"cert_{cert_id}_{cert_slug}"
    results = pinecone_index.query(
        vector=query_embedding,
        top_k=top_k,
        namespace=namespace,
        include_metadata=True,
        filter={
            "source_type": {
                "$in": ["exam_blueprint", "official_docs", "study_guide"]
            }
        }
    )

    # Return chunks with provenance
    return [
        RetrievalChunk(
            chunk_text=match.metadata['chunk_text'],
            source_name=match.metadata['source_name'],
            source_url=match.metadata['source_url'],
            similarity_score=match.score
        )
        for match in results.matches
    ]
```

**Cost**: ≈$0.001 per query (Pinecone serverless pricing)

---

## 3. OpenAI Integration

### 3.1 Embedding Model

**Model**: `text-embedding-3-small`

**Configuration**:

```typescript
// Service file: functions/src/services/openai/embeddingService.ts

export const embeddingConfig = {
  model: "text-embedding-3-small",
  dimensions: 1536,
  encoding_format: "float",
  // Batch processing
  rate_limit: 8000, // Requests per minute
  max_batch_size: 100, // Vectors per API call
  timeout_ms: 30000,
  retry_policy: {
    max_retries: 3,
    backoff_ms: 1000,
  },
};

// Cost per 1M tokens: $0.02
// Typical cert docs: 50K–100K tokens = $1–2 per cert
```

---

### 3.2 Question Generation Model

**Model**: `gpt-4o-mini` or `gpt-4` (depending on quality requirements)

**System Prompt**:

```
You are an expert certification exam question generator. Your task is to create high-quality,
exam-accurate multiple-choice questions based on provided reference materials.

GUIDELINES:
- Questions must reflect the exact exam format and difficulty
- Each question should have one unambiguously correct answer
- Distractors should be plausible but clearly incorrect
- Include detailed explanations that reference source materials
- Never invent facts; ground all content in provided references

CITATION FORMAT:
For each question, cite the source material:
- Source: [Official Study Guide, p. 42]
- Relevance: [96%] (similarity score from retrieval)
```

**Request Template**:

```typescript
// Service file: functions/src/services/openai/questionGenerationService.ts

export async function generateTrialQuestions(
  cert_id: number,
  cert_slug: string,
  topic: string,
  ragSources: RetrievalChunk[],
  count: number,
) {
  const systemPrompt = `[... as above ...]`;

  const userPrompt = `
Generate ${count} exam-quality questions about "${topic}" for the ${cert_slug} certification.

REFERENCE MATERIALS:
${ragSources
  .map(
    (chunk, i) => `
[Source ${i + 1}] ${chunk.source_name} (Relevance: ${(chunk.similarity_score * 100).toFixed(0)}%)
${chunk.chunk_text}
`,
  )
  .join("\n---\n")}

Output JSON array with fields: { question_text, option_a, option_b, option_c, option_d, correct_option, explanation, sources }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content;
}
```

**Cost**: ≈$0.15–0.30 per generated question (5-10 questions per cert per generation run)

---

### 3.3 Cost Controls

**Monthly Budget Allocation**:

```
Initial 5-cert pilot:
  - Embeddings (backfill): $10/month reserve
  - Embeddings (incremental): $5/month
  - Question generation (5 runs × 5 questions): $7.50–15/month
  - Pinecone queries (visitors): $2–5/month
  ---
  Total: $24.50–35/month (pilot phase)

Rollout to 12 certs:
  - Similar ratios scale; estimated $50–70/month at steady state
```

**Kill switches**:

- Global `RAG_ENABLED` flag (disable all RAG immediately)
- Per-cert `RAG_MODE` toggle (switch from `hybrid` to `off` for problematic certs)
- `MAX_GENERATION_RUNS_PER_MONTH` hard limit (prevent accidental bulk runs)

---

## 4. Data Flow Diagrams

### 4.1 Admin: Index/Generate Flow

```
Admin triggers:
  node scripts/indexPinecone.ts --cert-slug cka
    ↓
  Fetch cert artifacts (docs, blueprints) → Split into chunks
    ↓
  Batch embed chunks via OpenAI (text-embedding-3-small)
    ↓
  Upsert vectors to Pinecone (namespace: cert_1_cka)
    ↓
  Log RagGenerationRun { status: 'success', retrieval_count: N, cost_tokens: M }
    ↓
Admin CLI outputs cost estimate: "$1.23 spent, 50K tokens"
```

### 4.2 Admin: Generate Trial Questions Flow

```
Admin triggers:
  POST /api/admin/trial/generate-questions
  { cert_id: 1, count: 5, rag_mode: 'hybrid' }
    ↓
  Create RagGenerationRun { status: 'in_progress' }
    ↓
  For each topic in cert curriculum:
    Retrieve top-3 chunks from Pinecone
      ↓
    Generate question via GPT-4o-mini + chunks
      ↓
    Save to TrialQuestionItem with rag_sources metadata
      ↓
  Create TrialQuestionSet { status: 'draft', questions: [...] }
    ↓
  Update RagGenerationRun { status: 'success', generation_cost_tokens: M }
    ↓
Admin reviews questions (quality gate), publishes set
  POST /api/admin/trial/publish-set
  { set_id: '...', status: 'published' }
```

### 4.3 Visitor: Trial Flow (No RAG at Runtime)

```
Visitor arrives at /certs/cka public page
    ↓
SPA frontend calls:
  POST /api/public/trial/visitor/init
    ↓
Backend creates TrialVisitor { anonymous_token: hash(IP:UA) }
    ↓
Backend creates TrialSession { visitor_id, cert_id }
    ↓
Backend queries TrialQuestionSet WHERE cert_id = 1 AND status = 'published'
    ↓
Return 5 questions (already generated, from database, NO runtime RAG)
    ↓
Visitor sees questions, starts answering
    ↓
For each answer/skip:
  POST /api/public/trial/{session_id}/event
  { event_type: 'answered', trial_question_id: '...', selected_option: 'A' }
    ↓
Backend appends to TrialSessionEvent, updates TrialSession counters
```

**Key**: No Pinecone calls during visitor interaction (all RAG is pre-generation by admin)

---

## 5. Query Patterns & Analytics

### 5.1 Funnel Query (Visitor Session Analytics)

```sql
-- Daily funnel for cert_id = 1 (CKA) over last 7 days
SELECT
  DATE(ts.created_at) as date,
  COUNT(DISTINCT ts.session_id) as sessions_started,
  COUNT(DISTINCT CASE WHEN ts.questions_answered > 0 THEN ts.session_id END) as answered_any,
  COUNT(DISTINCT CASE WHEN ts.completed_at IS NOT NULL THEN ts.session_id END) as sessions_completed,
  AVG(ts.questions_answered) as avg_questions_answered,
  AVG(ts.questions_correct) as avg_questions_correct
FROM TrialSession ts
WHERE ts.cert_id = 1
  AND ts.created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(ts.created_at)
ORDER BY date DESC;

-- Result:
-- date       | sessions_started | answered_any | sessions_completed | avg_questions_answered | avg_questions_correct
-- 2026-05-13 | 42               | 28           | 8                  | 3.7                    | 1.2
```

### 5.2 Drop-Off Analysis

```sql
-- Which question causes the most drop-offs?
SELECT
  tse.trial_question_id,
  tqi.question_text,
  COUNT(DISTINCT tse.session_id) as viewed_count,
  COUNT(DISTINCT CASE WHEN tse.event_type = 'answered' THEN tse.session_id END) as answered_count,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN tse.event_type = 'answered' THEN tse.session_id END)
    / COUNT(DISTINCT tse.session_id), 2) as answer_rate
FROM TrialSessionEvent tse
LEFT JOIN TrialQuestionItem tqi ON tse.trial_question_id = tqi.question_id
WHERE tse.event_type IN ('viewed', 'answered', 'skipped')
GROUP BY tse.trial_question_id, tqi.question_text
ORDER BY answer_rate ASC;
```

### 5.3 Cost Auditing

```sql
-- Monthly RAG cost breakdown
SELECT
  DATE_TRUNC('month', rg.created_at) as month,
  c.name as certification,
  SUM(rg.generation_cost_tokens) as total_gen_tokens,
  ROUND(SUM(rg.generation_cost_tokens) * 0.00002, 2) as gen_cost_usd,
  SUM(rg.retrieval_count) as retrieval_queries,
  ROUND(SUM(rg.retrieval_cost_estimate), 2) as retrieval_cost_usd,
  ROUND(SUM(rg.generation_cost_tokens) * 0.00002 + SUM(rg.retrieval_cost_estimate), 2) as total_cost_usd
FROM RagGenerationRun rg
JOIN Certification c ON rg.cert_id = c.cert_id
WHERE rg.status = 'success'
GROUP BY DATE_TRUNC('month', rg.created_at), c.name
ORDER BY month DESC, total_cost_usd DESC;
```

---

## 6. Isolation Verification Queries

Run these periodically to ensure visitor data never touches user data:

### 6.1 Foreign Key Verification

```sql
-- Should return empty result (no FKs from trial tables to User tables)
SELECT constraint_name, table_name, column_name, foreign_table_name
FROM information_schema.key_column_usage
WHERE (table_name LIKE 'Trial%' OR table_name LIKE 'Rag%')
  AND foreign_table_name IN ('User', 'ExamAttempt', 'ExamUserAnswer', 'UserCertification')
ORDER BY table_name;

-- Expected output: (empty)
```

### 6.2 Data Contamination Prevention

```sql
-- Should return 0 (no TrialSessions with User FKs)
SELECT COUNT(*) as contamination_count
FROM TrialSession
WHERE visitor_id IN (SELECT user_id FROM User);

-- Should be 0
```

### 6.3 Completeness Check

```sql
-- Verify all published trial question sets have no null critical fields
SELECT COUNT(*) as incomplete_count
FROM TrialQuestionItem tqi
JOIN TrialQuestionSet tqs ON tqi.set_id = tqs.set_id
WHERE tqs.status = 'published'
  AND (tqi.question_text IS NULL
    OR tqi.correct_option IS NULL
    OR tqi.option_a IS NULL
    OR tqi.option_b IS NULL
    OR tqi.option_c IS NULL
    OR tqi.option_d IS NULL);

-- Should be 0
```

---

## 7. Implementation Sequence

### Step 1: Apply Schema Migration

```bash
cd functions
npx prisma migrate dev --name public_trial_visitor_setup
```

### Step 2: Set Up Pinecone Index

```bash
# Via Pinecone console or API
POST https://api.pinecone.io/indexes
{
  "name": "certifai-public-trial-v1",
  "dimension": 1536,
  "metric": "cosine",
  "spec": { "serverless": { "cloud": "aws", "region": "us-east-1" } }
}
```

### Step 3: Backfill Pinecone (Manual, Cert by Cert)

```bash
node functions/scripts/indexPinecone.ts --cert-slug cka --rag-mode hybrid
```

### Step 4: Test Generation (Manual)

```bash
POST /api/admin/trial/generate-questions
{ cert_id: 1, count: 5, rag_mode: 'hybrid' }
# Review, then publish via:
# POST /api/admin/trial/publish-set { set_id: '...', status: 'published' }
```

### Step 5: Test Visitor API (Manual)

```bash
POST /api/public/trial/visitor/init
# Get visitor_id and session_id
POST /api/public/trial/{session_id}/event { event_type: 'answered', ... }
```

### Step 6: Verify Isolation

```bash
# Run verification queries from Section 6
```

---

## 8. Monitoring & Alerts

### 8.1 Key Metrics

| Metric                       | Threshold | Action                  |
| ---------------------------- | --------- | ----------------------- |
| Monthly RAG cost             | > $100    | Alert team lead         |
| Retrieval latency            | > 500ms   | Check Pinecone quota    |
| Generation success rate      | < 95%     | Page on-call            |
| Visitor session dropout rate | > 80%     | Review question quality |
| Foreign key contamination    | > 0       | Page SRE immediately    |

### 8.2 Logging

All RAG operations log to CloudLogging with structured fields:

```json
{
  "timestamp": "2026-05-13T10:30:00Z",
  "operation": "rag_generation",
  "cert_id": 1,
  "cert_slug": "cka",
  "run_id": "...",
  "status": "success",
  "generation_cost_tokens": 2345,
  "retrieval_count": 5,
  "retrieval_cost_usd": 0.005,
  "triggered_by": "admin@certifai.com",
  "duration_seconds": 45
}
```

---

## Summary

This design:
✓ Completely isolates visitor data from authenticated users  
✓ Reuses existing PostgreSQL, Firestore, RTDB infrastructure  
✓ Introduces Pinecone only for RAG retrieval (not visitor transactional data)  
✓ Uses OpenAI only for generation (admin-triggered, not visitor real-time)  
✓ Provides clear query patterns for analytics and auditing  
✓ Defines cost controls and monitoring thresholds  
✓ Implements verification queries to prevent data contamination
