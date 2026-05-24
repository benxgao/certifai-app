# API Design: Public Trial + Admin RAG System

This document specifies all REST endpoints for the RAG-powered public trial system. The API is organized into three groups:

1. **Public Trial Endpoints** (no auth, anonymous visitors)
2. **Admin RAG Management Endpoints** (requires auth + admin role)
3. **Analytics Endpoints** (internal service auth)

---

## 1. Public Trial Endpoints

All public endpoints are unauthenticated and rate-limited by IP/fingerprint.

### 1.1 Initialize Visitor Session

**Purpose**: Create or retrieve an anonymous visitor and return session token for cookies.

```
POST /api/public/trial/visitor/init
Content-Type: application/json

Body: (empty or optional)
{
  "ipAddress": "203.0.113.42",       // Sent by frontend if available
  "userAgent": "Mozilla/5.0..."      // Client UA
}

Response (201 Created or 200 OK):
{
  "visitor_id": "c1a2b3d4...",
  "anonymous_token": "sha256_hash_...",
  "session_id": null,                 // No session yet
  "created_at": "2026-05-13T10:00:00Z"
}
```

**Implementation**:

- Backend computes `anonymous_token = SHA256(IP + UA)` if not provided
- Check if visitor exists (by `anonymous_token`)
  - ✓ Exists: return existing `visitor_id`, update `last_activity_at`
  - ✗ New: create `TrialVisitor` record, return new `visitor_id`
- Response includes `visitor_id` for client to store in HttpOnly cookie `trial_visitor_id`
- Repeat calls within same IP:UA → reuse existing visitor (idempotent)

**Headers**:

- `X-Forwarded-For` (optional): Backend extracts real IP from proxy
- Automatic rate limiting: 100 requests per IP per hour

---

### 1.2 Start Trial for Cert

**Purpose**: Create a trial session for a visitor on a specific certification and retrieve questions.

```
POST /api/public/trial/session/start
Content-Type: application/json
X-Trial-Visitor-Id: c1a2b3d4...      // From /visitor/init

Body:
{
  "cert_slug": "cka"                  // e.g., "cka", "cissp-issmp"
}

Response (201 Created):
{
  "session_id": "session_xyz...",
  "visitor_id": "c1a2b3d4...",
  "cert_id": 1,
  "cert_name": "Certified Kubernetes Administrator",
  "started_at": "2026-05-13T10:05:00Z",
  "questions": [
    {
      "question_id": "q_1_...",
      "question_text": "What is a Pod in Kubernetes?",
      "option_a": "A container runtime",
      "option_b": "A deployment abstraction",
      "option_c": "The smallest deployable unit",
      "option_d": "A network service",
      "difficulty": "EASY",
      "topic": "Core Concepts"
    },
    // ... 4 more questions
  ],
  "total_questions": 5,
  "progress": {
    "current": 0,
    "total": 5
  }
}
```

**Logic**:

1. Validate cert exists in allowlist (check `trial-certs.json`)
2. Check if cert has published `TrialQuestionSet`
   - ✗ Not found: return 404 with message "Trial not available for this cert"
   - ✓ Found: proceed
3. Create `TrialSession` record with `visitor_id`, `cert_id`, status tracking counters
4. Fetch 5 published `TrialQuestionItem` records from the set (ordered by `created_at ASC`)
5. Return session with questions, but **never return `correct_option` in response**

**Error Handling**:

- `400 Bad Request`: Invalid cert_slug (not in allowlist or not exist)
- `404 Not Found`: Cert has no published trial questions
- `429 Too Many Requests`: Visitor exceeded rate limit

---

### 1.3 Submit Event (Answer, Skip, Exit)

**Purpose**: Record visitor action (answer question, skip, exit trial).

```
POST /api/public/trial/session/:session_id/event
Content-Type: application/json
X-Trial-Visitor-Id: c1a2b3d4...

Body:
{
  "event_type": "answered",           // answered | skipped | trial_exit | trial_completed
  "trial_question_id": "q_1_...",
  "selected_option": "C",             // Only for 'answered' event
  "elapsed_ms": 18500
}

Response (201 Created):
{
  "event_id": "evt_...",
  "session_id": "session_xyz...",
  "event_type": "answered",
  "is_correct": true,                 // Calculated from DB
  "created_at": "2026-05-13T10:06:00Z",
  "session_state": {
    "questions_viewed": 1,
    "questions_answered": 1,
    "questions_correct": 1,
    "session_completed": false
  }
}
```

**Implementation**:

1. Validate `session_id` belongs to visitor (from header)
2. If event_type = `answered`:
   - Fetch `TrialQuestionItem` by `trial_question_id`
   - Compute `is_correct = (db.correct_option == selected_option)`
   - Create `TrialSessionEvent` with `is_correct` populated
   - Update `TrialSession` counters: increment `questions_answered` and (if correct) `questions_correct`
3. If event_type = `skipped`:
   - Create `TrialSessionEvent` with `selected_option = null`, `is_correct = null`
   - Update `TrialSession`: increment `questions_viewed`
4. If event_type = `trial_exit`:
   - Create `TrialSessionEvent`
   - Keep `TrialSession` open (don't set `completed_at`)
5. If event_type = `trial_completed`:
   - Create `TrialSessionEvent`
   - Set `TrialSession.completed_at = NOW()`
6. Return updated session state (progress counters)

**Error Handling**:

- `400 Bad Request`: Invalid event_type, missing required fields
- `404 Not Found`: session_id doesn't exist or doesn't belong to visitor
- `409 Conflict`: Trying to answer a question already answered in this session

---

### 1.4 Fetch Next Questions (Pagination)

**Purpose**: Retrieve additional questions when visitor scrolls or requests more.

```
GET /api/public/trial/session/:session_id/questions
X-Trial-Visitor-Id: c1a2b3d4...
?offset=5&limit=5

Response (200 OK):
{
  "questions": [
    {
      "question_id": "q_6_...",
      "question_text": "...",
      "option_a": "...",
      "option_b": "...",
      "option_c": "...",
      "option_d": "...",
      "difficulty": "ADVANCED",
      "topic": "Architecture"
    },
    // ... up to limit
  ],
  "offset": 5,
  "limit": 5,
  "total_available": 10,
  "has_more": true
}
```

**Logic**:

1. Validate `session_id` and visitor ownership
2. Query `TrialQuestionItem` from associated `TrialQuestionSet` with `LIMIT limit OFFSET offset`
3. Return questions without `correct_option`

---

### 1.5 Get Trial Summary (End of Session)

**Purpose**: Return final score and question-level results after visitor completes trial.

```
GET /api/public/trial/session/:session_id/summary
X-Trial-Visitor-Id: c1a2b3d4...

Response (200 OK):
{
  "session_id": "session_xyz...",
  "cert_slug": "cka",
  "cert_name": "Certified Kubernetes Administrator",
  "started_at": "2026-05-13T10:05:00Z",
  "completed_at": "2026-05-13T10:25:00Z",
  "duration_seconds": 1200,
  "statistics": {
    "total_questions": 5,
    "questions_answered": 4,
    "questions_correct": 3,
    "score_percentage": 75,
    "accuracy": "60%"  // (3/5)
  },
  "results": [
    {
      "question_id": "q_1_...",
      "question_text": "What is a Pod?",
      "topic": "Core Concepts",
      "difficulty": "EASY",
      "selected_option": "C",
      "correct_option": "C",
      "is_correct": true,
      "explanation": "A Pod is the smallest deployable unit in Kubernetes..."
    },
    // ... other questions
  ],
  "next_action": "Sign up to save progress and take the full exam"
}
```

**Logic**:

1. Fetch `TrialSession` and all associated `TrialSessionEvent` records
2. Aggregate statistics
3. For each event with a question, fetch full question details including `explanation` and `correct_option`
4. Return summary (reveal `correct_option` only for reviewed questions, not during live trial)

---

## 2. Admin RAG Management Endpoints

All admin endpoints require:

- `Authorization: Bearer <firebase_token>`
- User must have `admin` role or `rag-manager` role

### 2.1 List Allowed Trial Certs

**Purpose**: Get the current list of certs enabled for trial.

```
GET /api/admin/trial/config
Authorization: Bearer <token>

Response (200 OK):
{
  "enabled_certs": [
    {
      "cert_id": 1,
      "cert_slug": "cka",
      "cert_name": "Certified Kubernetes Administrator",
      "rag_mode": "hybrid",
      "question_count": 5,
      "status": "configured"
    },
    {
      "cert_id": 2,
      "cert_slug": "cissp-issmp",
      "cert_name": "CISSP-ISSMP",
      "rag_mode": "gen_only",
      "question_count": 5,
      "status": "configured"
    }
  ],
  "defaults": {
    "question_count": 5,
    "rotation_sets": 3,
    "default_rag_mode": "hybrid"
  }
}
```

---

### 2.2 Trigger Pinecone Indexing

**Purpose**: Admin initiates backfill/update of cert artifacts to Pinecone.

```
POST /api/admin/trial/index-cert
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "cert_slug": "cka",
  "action": "backfill",              // backfill | update
  "source": "exam_blueprint",         // exam_blueprint | study_guide | all
  "dry_run": false
}

Response (202 Accepted):
{
  "run_id": "run_xyz...",
  "cert_id": 1,
  "status": "pending",
  "action": "backfill",
  "expected_duration_seconds": 120,
  "cost_estimate_usd": 1.50,
  "created_at": "2026-05-13T10:30:00Z"
}

// Track progress:
GET /api/admin/trial/index-cert/:run_id
-> { "status": "in_progress", "chunks_processed": 42, "chunks_total": 100 }
-> { "status": "success", "chunks_processed": 100, "cost_actual_usd": 1.47, "namespace": "cert_1_cka" }
```

**Implementation**:

1. Create `RagGenerationRun` record with status `pending`
2. Queue async job (Cloud Tasks or background queue)
3. Async job:
   - Fetch cert artifacts from source (AWS S3, URLs, etc.)
   - Chunk documents (500 tokens, overlap 100)
   - Batch embed via OpenAI (`text-embedding-3-small`)
   - Upsert vectors to Pinecone namespace `cert_{cert_id}_{cert_slug}`
   - Update `RagGenerationRun` with success/failure status, actual cost
4. Return immediately with `run_id` for polling

**Error Handling**:

- `400 Bad Request`: Invalid cert_slug or source
- `409 Conflict`: Another indexing job already in progress for this cert
- `503 Service Unavailable`: Pinecone or OpenAI service unavailable

---

### 2.3 Generate Trial Questions

**Purpose**: Admin triggers AI question generation with RAG grounding.

```
POST /api/admin/trial/generate-questions
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "cert_id": 1,
  "cert_slug": "cka",
  "question_count": 5,
  "rag_mode": "hybrid",              // off | gen_only | hybrid
  "topics": ["Architecture", "Networking"]  // Optional: specific topics
}

Response (202 Accepted):
{
  "run_id": "run_xyz...",
  "set_id": "set_abc...",
  "cert_id": 1,
  "status": "in_progress",
  "questions_requested": 5,
  "expected_duration_seconds": 90,
  "created_at": "2026-05-13T10:35:00Z"
}

// Track progress:
GET /api/admin/trial/generate-questions/:run_id
-> { "status": "in_progress", "questions_generated": 2, "cost_tokens": 5000 }
-> { "status": "success", "set_id": "set_abc...", "questions_generated": 5, "cost_tokens": 12000, "cost_usd": 0.24 }
```

**Implementation**:

1. Create `RagGenerationRun` with status `in_progress`
2. Create `TrialQuestionSet` with status `draft`, `generation_run_id` = run_id
3. Queue async job:
   - For each topic (curriculum breakdown):
     - If `rag_mode != 'off'`: Retrieve top-3 chunks from Pinecone for that topic
     - Call `gpt-4o-mini` with RAG sources to generate questions
     - Parse response, validate JSON structure
     - Create `TrialQuestionItem` records with `rag_sources` metadata
     - Increment counters
   - Update `RagGenerationRun` with final status, cost
   - Update `TrialQuestionSet` question_count
4. Return set_id for review

**Admin Review Flow**:

```
// Admin reviews questions:
GET /api/admin/trial/question-set/:set_id
-> { "questions": [...], "status": "draft", "generation_run_id": "..." }

// Admin publishes (makes available to public):
PATCH /api/admin/trial/question-set/:set_id
{ "status": "published", "published_at": "2026-05-13T10:40:00Z" }

// Or admin rejects and regenerates:
POST /api/admin/trial/generate-questions
{ "cert_id": 1, ... }
```

---

### 2.4 Manage Question Sets

**Purpose**: View, publish, archive trial question sets.

```
GET /api/admin/trial/question-sets?cert_id=1
Authorization: Bearer <token>

Response (200 OK):
{
  "sets": [
    {
      "set_id": "set_abc...",
      "cert_id": 1,
      "generation_run_id": "run_xyz...",
      "question_count": 5,
      "status": "published",
      "created_at": "2026-05-13T10:00:00Z",
      "published_at": "2026-05-13T10:40:00Z",
      "archived_at": null
    }
  ]
}
```

```
PATCH /api/admin/trial/question-set/:set_id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "published"     // draft | published | archived
}

Response (200 OK):
{
  "set_id": "set_abc...",
  "status": "published",
  "published_at": "2026-05-13T10:40:00Z"
}
```

---

### 2.5 View RAG Generation Audit Log

**Purpose**: Admin views history of all RAG indexing and generation runs.

```
GET /api/admin/trial/rag-runs
Authorization: Bearer <token>
?cert_id=1&limit=50&offset=0&status=success

Response (200 OK):
{
  "runs": [
    {
      "run_id": "run_xyz...",
      "cert_id": 1,
      "cert_slug": "cka",
      "operation": "indexing",          // indexing | generation
      "rag_mode": "hybrid",
      "status": "success",              // pending | in_progress | success | failed
      "retrieval_count": 15,
      "generation_cost_tokens": 12000,
      "cost_usd": 0.24,
      "triggered_by": "admin@certifai.com",
      "started_at": "2026-05-13T10:35:00Z",
      "completed_at": "2026-05-13T10:36:30Z",
      "duration_seconds": 90,
      "error_message": null
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 2.6 View Trial Analytics

**Purpose**: Admin views visitor funnel and engagement metrics for a cert.

```
GET /api/admin/trial/analytics
Authorization: Bearer <token>
?cert_id=1&date_from=2026-05-01&date_to=2026-05-13

Response (200 OK):
{
  "cert_id": 1,
  "cert_slug": "cka",
  "date_range": {
    "from": "2026-05-01",
    "to": "2026-05-13"
  },
  "summary": {
    "total_sessions_started": 128,
    "total_sessions_completed": 34,
    "completion_rate": 26.5,
    "avg_questions_answered": 3.2,
    "avg_score": 72.5,
    "total_unique_visitors": 95
  },
  "daily_breakdown": [
    {
      "date": "2026-05-13",
      "sessions_started": 12,
      "sessions_completed": 3,
      "completion_rate": 25,
      "avg_questions_answered": 3.4,
      "avg_score": 71
    }
  ],
  "drop_off_analysis": {
    "question_1": { "viewed": 128, "answered": 115, "answer_rate": 89.8 },
    "question_2": { "viewed": 115, "answered": 98, "answer_rate": 85.2 },
    "question_3": { "viewed": 98, "answered": 76, "answer_rate": 77.6 },
    "question_4": { "viewed": 76, "answered": 45, "answer_rate": 59.2 },
    "question_5": { "viewed": 45, "answered": 34, "answer_rate": 75.6 }
  }
}
```

**Source**: Computed from Firestore denormalized metrics or live PostgreSQL queries

---

## 3. Internal Analytics Endpoints

### 3.1 Record Visitor Event (Bulk)

**Purpose**: Batch-ingest visitor events (internal cron job).

```
POST /api/internal/trial/events/ingest
Authorization: Bearer <service_token>
Content-Type: application/json

Body:
{
  "events": [
    { "session_id": "...", "event_type": "answered", "trial_question_id": "...", ... },
    { "session_id": "...", "event_type": "trial_exit", ... }
  ]
}

Response (202 Accepted):
{
  "ingested": 47,
  "failed": 0
}
```

---

### 3.2 Aggregate Daily Metrics (Cron Job)

**Purpose**: Nightly job to compute and store daily funnel metrics in Firestore.

```
POST /api/internal/trial/metrics/aggregate-daily
Authorization: Bearer <service_token>

Body:
{
  "date": "2026-05-13"  // ISO date
}

Response (200 OK):
{
  "aggregated_certs": [
    {
      "cert_id": 1,
      "cert_slug": "cka",
      "sessions_started": 12,
      "sessions_completed": 3,
      "total_questions_answered": 31,
      "stored_at": "public_trial/daily_metrics/cka/2026-05-13"
    }
  ]
}
```

---

### 3.3 Cleanup Expired Visitors (Cron Job)

**Purpose**: Daily job to soft-delete visitor records older than 90 days.

```
POST /api/internal/trial/cleanup/expired-visitors
Authorization: Bearer <service_token>

Body:
{
  "retention_days": 90
}

Response (200 OK):
{
  "deleted_visitors": 342,
  "deleted_sessions": 1203,
  "deleted_events": 8521
}
```

---

## 4. Data Contracts & Error Responses

### Common Error Responses

```json
{
  "error": "invalid_request",
  "message": "cert_slug is required",
  "code": 400,
  "timestamp": "2026-05-13T10:30:00Z"
}
```

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 400  | Invalid request (bad input)        |
| 401  | Unauthorized (missing auth)        |
| 403  | Forbidden (insufficient perms)     |
| 404  | Not found (resource doesn't exist) |
| 409  | Conflict (duplicate, busy)         |
| 429  | Rate limited                       |
| 500  | Internal server error              |
| 503  | Service unavailable (Pinecone)     |

### Rate Limiting Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1715608200
```

---

## 5. Authentication & Authorization

### Public Endpoints

- **Auth**: None required
- **Identification**: `X-Trial-Visitor-Id` header or cookie `trial_visitor_id`
- **Rate Limit**: 100 requests per IP per hour

### Admin Endpoints

- **Auth**: Firebase JWT token in `Authorization: Bearer <token>` header
- **Role Check**: User must have `admin` or `rag-manager` role
- **Rate Limit**: 1000 requests per user per hour

### Internal Endpoints

- **Auth**: Service account token (Cloud Functions, Cloud Tasks)
- **Verification**: Token must be valid GCP service account JWT

---

## 6. Implementation Checklist

### Phase 3 (Public Trial API)

- [ ] `POST /api/public/trial/visitor/init` — create anonymous visitor
- [ ] `POST /api/public/trial/session/start` — start trial for cert
- [ ] `POST /api/public/trial/session/:session_id/event` — record answer/skip/exit
- [ ] `GET /api/public/trial/session/:session_id/questions` — fetch more questions
- [ ] `GET /api/public/trial/session/:session_id/summary` — final results

### Phase 2 (Admin Generation)

- [ ] `GET /api/admin/trial/config` — list enabled certs
- [ ] `POST /api/admin/trial/index-cert` — trigger Pinecone indexing
- [ ] `POST /api/admin/trial/generate-questions` — trigger generation
- [ ] `GET /api/admin/trial/generate-questions/:run_id` — track generation progress
- [ ] `PATCH /api/admin/trial/question-set/:set_id` — publish/archive questions
- [ ] `GET /api/admin/trial/rag-runs` — view RAG audit log

### Phase 4 (Analytics)

- [ ] `GET /api/admin/trial/analytics` — visitor funnel metrics
- [ ] `POST /api/internal/trial/metrics/aggregate-daily` — nightly aggregation
- [ ] `POST /api/internal/trial/cleanup/expired-visitors` — data retention
