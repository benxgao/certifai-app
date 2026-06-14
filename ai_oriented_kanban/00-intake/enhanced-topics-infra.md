ai_oriented_kanban/00-intake/enhanced-topics-infra.md

## 1. Executive Summary (MVP-Oriented)

This document defines a phased implementation plan for the **Enhanced Topics Infrastructure**. The core philosophy is **rapid deployment of foundational features while preserving architectural extensibility**, avoiding premature optimization and complex UGC governance systems from day one.

**Current Phase (Phase 1 - MVP):**

- Transform Topics from ephemeral concepts into persistent entities
- Support user-defined Topic weights and exam scope selection
- Basic Topic tagging and simple visualization analytics
- Personal-level Topic management (creator-only visibility)

**Future Phases (Phase 2+):**

- Community contributions and UGC governance
- Pro-tips intelligent recommendation system
- Reputation economy and content moderation

---

## 2. Phase 1: Implemented/Upcoming Features (MVP)

### 2.1 Core Feature Checklist

| Feature Module                | Status | Description                                                   |
| ----------------------------- | ------ | ------------------------------------------------------------- |
| **Topic Persistence**         | ✅     | Topics become independent entities with CRUD support          |
| **Exam Topic Selector**       | ✅     | Select/include/exclude specific Topics during exam generation |
| **Topic Weight Adjustment**   | ✅     | Users can adjust Topic ratios in exam composition             |
| **Exam Interface Topic Tags** | ✅     | Display associated Topic per question                         |
| **Personal Topic Library**    | ✅     | Users create private Topics (personal use only)               |
| **Basic Analytics**           | 🔄     | Score statistics by Topic and simple bar charts               |
| **Topic Expiration Marking**  | 🔄     | Soft-delete mechanism preserving historical data              |

### 2.2 MVP Route Structure

```
/main/certifications/[certId]/topics              # Personal Topic Library (CRUD)
/main/certifications/[certId]/topics/[topicId]    # Topic Detail/Edit
/main/certifications/[certId]/exams               # Existing exam list
  └─ /new                                         # New Topic selection step added
/main/certifications/[certId]/reports             # Enhanced reports (Topic dimensions added)
```

### 2.3 Simplified Data Model (MVP)

```typescript
// Phase 1 implements Personal tier only + reserved fields for future
interface Topic {
  id: string;
  certificationId: string;
  name: string;
  description?: string;

  // Tier system (MVP only supports 'personal')
  tier: 'personal'; // Reserved: 'canonical' | 'community'
  ownerId: string; // Creator ID

  // Version control (reserved fields, nullable in MVP)
  version: number;
  validUntil: Date | null;
  supersededBy: string | null;

  // Metadata
  weight: number; // Default weight (0-100)
  questionCount: number; // Associated question count
  createdAt: Date;
  updatedAt: Date;

  // Reserved extension fields (Phase 2+ usage)
  // contributorId?: string;
  // reputationScore?: number;
  // status?: 'pending' | 'approved' | 'expired';
}

// Exam-Topic Association
interface ExamTopicConfig {
  examId: string;
  topicId: string;
  customWeight: number; // User-defined weight
  isIncluded: boolean; // Include in exam
}
```

### 2.4 Enhanced Exam Generation Flow

**Current Flow:**
New Exam → Question Count → Custom Instructions → Generate

**MVP Enhanced Flow:**
New Exam → Question Count → **Topic Selection** → Custom Instructions → Generate

**UI Specifications:**

- **Smart Defaults:** All Topics selected by default with recommended weights
- **Simple Adjustment:** Sliders to adjust Topic ratios (auto-normalized to 100%)
- **Quick Actions:** "Focus on Weak Areas" button (auto-increases weight for historically low-scoring Topics)

---

## 3. Phase 2: Near-term Optimizations (1-2 Months Later)

### 3.1 Enhanced Analytics

- **Radar Chart:** Multi-dimensional Topic competency visualization
- **Trend Analysis:** Cross-exam performance tracking for same Topics
- **Study Recommendations:** Automated suggestions based on Topic weaknesses

### 3.2 Topic Expiration Management

- **Soft Expiration:** Topics marked as `expired` but not deleted
- **Historical Preservation:** Past exams retain old Topic associations with "expired" badges
- **Migration Tool:** Admin manual mapping from old Topic to new Topic

### 3.3 Simple Pro-tips (No AI)

- **Static Tips:** Text tips per Topic (Markdown supported)
- **In-exam Viewing:** Expandable tips during question answering
- **Personal Edit Only:** Users can only edit tips for their own created Topics

---

## 4. Future Part: Advanced Features (TBD/Long-term Planning)

> The following features are architecturally reserved but **explicitly postponed until user scale expands**, avoiding premature optimization.

### 4.1 Three-Tier Topic Hierarchy (Full Implementation)

Complete Community and Canonical tier implementation:

```typescript
// Reserved complete model (not implementing now)
interface TopicSystemFuture {
  canonicalTopics: {
    // Tier 1: Officially maintained, versioned
    // Requires content team and automated crawlers monitoring vendor exam guides
  };

  communityTopics: {
    // Tier 2: User-contributed, quality-gated
    // Requires moderation system, reputation mechanism, anti-spam algorithms
    contributorId: string;
    reputationScore: number;
    status: 'pending' | 'approved' | 'rejected';
    moderationHistory: ModerationEvent[];
  };

  personalTopics: {
    // Tier 3: Personal private (already implemented in MVP)
  };
}
```

**Why Postponed:**

- Requires establishing content moderation team or AI moderation models
- Cold start problem: insufficient initial user base to generate quality UGC
- Legal risks: copyright and liability issues with user-generated content

### 4.2 Community Contribution System

**Complex Features List:**

- **Anonymous Submission:** Temp ID + validation gate (answer 3 questions correctly to submit)
- **Reputation Staking:** Users stake points guaranteeing Topic quality
- **Governance Mechanism:** Voting for upgrade/downgrade, dispute resolution
- **Quality Decay:** Auto-deprecation after 90 days without engagement

**Prerequisites:**

- User base > 10,000
- Established content moderation process
- Anti-cheating system (preventing reputation farming)

### 4.3 Intelligent Pro-tips Engine

**Postponed Features:**

- **Contextual Triggers:** "Auto-suggest after 2 consecutive wrong answers"
- **AI Generation:** Automated learning suggestions based on wrong answers
- **Expert Network:** Certified experts contributing high-quality tips
- **Associative Recommendations:** Personalized tips based on answering patterns

### 4.4 Automated Operations

**Future Automation:**

- **Syllabus Monitoring:** Automated crawling of AWS/Azure official exam guide changes
- **Topic Expiration Prediction:** AI identifying Topics needing updates
- **Auto-mapping:** Suggested migration paths from old Topics to new Topics

---

## 5. Data Model Evolution Strategy

To ensure Phase 1 code compatibility with Future features, database design follows the **Reserved Fields Pattern**:

```sql
-- Current table structure (compatible with future extensions)
CREATE TABLE topics (
  id UUID PRIMARY KEY,
  certification_id UUID,
  name VARCHAR(255),
  tier VARCHAR(20) DEFAULT 'personal', -- Reserved enum
  owner_id UUID,

  -- Reserved fields (nullable)
  contributor_id UUID NULL,
  reputation_score INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',

  created_at TIMESTAMP DEFAULT NOW()
);

-- Reserved tables (not created yet, but namespace preserved)
-- community_submissions (community submission queue)
-- topic_moderation_logs (moderation logs)
-- reputation_events (reputation events)
```

---

## 6. Implementation Roadmap

### Phase 1: MVP (Current Sprint - 4 Weeks)

**Goal:** Launch usable Topic system

- [ ] **Week 1:** Database migration + Topic CRUD API
- [ ] **Week 2:** Personal Topic Library frontend + Exam selector integration
- [ ] **Week 3:** Exam interface Topic tags + Basic bar charts
- [ ] **Week 4:** Topic expiration marking + Testing/Deployment

**Success Metrics:**

- 60% of exams use custom Topic selection
- Topic feature bug rate < 2%

### Phase 2: Analytics Enhancement (Weeks 5-8)

- [ ] Radar chart visualization
- [ ] Cross-exam Topic trend tracking
- [ ] Simple Topic-based study recommendations

### Phase 3: Observation Period (Weeks 9-12)

**No new feature development, observe data:**

- Frequency and patterns of Topic usage
- Strong UGC demand signals (user feedback requesting Topic sharing)
- System performance and data growth

### Future Phase: Community Features (TBD)

**Trigger Conditions (must meet simultaneously):**

1. DAU > 5,000
2. Explicit user feedback demanding sharing/collaboration features
3. Resources available to establish content moderation

**Detailed design deferred until then:**

- Community Tier specific rules
- Reputation economy model
- Pro-tips intelligent recommendation algorithms

---

## 7. Risks & Mitigation (MVP Phase)

| Risk                                          | Mitigation Strategy                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| **Over-engineering**                          | Explicitly prohibit UGC, moderation, reputation systems in Phase 1                |
| **Insufficient Data Model Extensibility**     | Reserved fields strategy ensuring table structure compatibility with future tiers |
| **Users Don't Need Complex Topic Management** | MVP only builds personal tier, validates demand before expansion                  |
| **Complex Topic Expiration Handling**         | Phase 1 only supports manual expiration marking, no automated detection           |

---

## 8. Architecture Decision Records (ADR)

**Decision 1: Postpone Community Tier**

- **Rationale:** Cold start problem + moderation costs
- **Alternative:** Phase 1 "personal Topics" already satisfies 80% of user needs (custom exam scope)

**Decision 2: Retain Three-Tier Design but Delay Implementation**

- **Rationale:** Architecture requires distinction between official/community/personal, but implementation starts with personal only
- **Benefit:** Data model remains stable, adding Community layer later requires no data migration

**Decision 3: Pro-tips Start Static**

- **Rationale:** AI-generated tips require extensive training data and prompt tuning
- **Approach:** Support manual user notes first, AI-ify later

---

## 9. Next Steps

1. **Engineering Review:** Confirm Phase 1 data model and API design
2. **UI/UX Design:** Topic selector interaction details (sliders vs input fields vs drag-drop)
3. **Technical Selection:** Chart library selection (Radar charts and trend graphs)
4. **Define Future Feature Boundaries:** Team confirmation on what explicitly won't be built (prevent scope creep)

**Explicitly Excluded (Future Part explicitly removed from current Roadmap):**

- Inter-user Topic sharing
- Reputation/point systems
- AI-generated Pro-tips
- Automated syllabus monitoring
- Content moderation queues
