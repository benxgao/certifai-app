# Token Economy System - Product Functional Specification (PFS)

## 1. Executive Summary

### 1.1 Background

The system currently has token storage reserved but inactive. This specification reactivates the token functionality to establish a dual-currency economy:

- **Credit Tokens**: Purchased via recharge; consumed for exam generation (revenue driver)
- **Energy Tokens**: Earned through social sharing (topic/pro-tip usage by others); used for exam generation (engagement driver)

### 1.2 Objectives

- **Immediate**: Enable monetization through token-based exam generation within 1 week
- **Engagement**: Incentivize UGC (User Generated Content) sharing via Energy rewards
- **Future-proof**: Architecture supports multi-token types, dynamic pricing, and secondary markets

---

## 2. Functional Requirements

### 2.1 Token Account Management

#### 2.1.1 Multi-Currency Wallet Architecture

Each user maintains separate balances to prevent accounting complexity:

```typescript
// Core Entity: Token Account (Polymorphic Design)
interface TokenAccount {
  user_id: string;
  token_type: 'CREDIT' | 'ENERGY' | 'BONUS'; // Extensible for future types
  balance: number; // Integer-based (smallest unit)
  frozen_amount: number; // Risk control holds
  version: number; // Optimistic locking for concurrency
  created_at: Date;
  updated_at: Date;
}
```

**Business Rules:**

- **CREDIT**: Purchased 1 CNY = 10 Credits (minimum unit avoids decimals); never expires
- **ENERGY**: Earned via sharing; **30-day expiration** mandatory to prevent liability inflation
- **BONUS**: Reserved for promotional campaigns (future use)

#### 2.1.2 Transaction Ledger (Immutable Audit Trail)

All token movements recorded with idempotency support:

```typescript
interface TokenTransaction {
  id: string;
  user_id: string;
  token_type: string;
  amount: number; // Positive = credit, Negative = debit
  transaction_type:
    | 'RECHARGE' // Top-up purchase
    | 'CONSUME_EXAM' // Exam generation cost
    | 'REWARD_SHARE' // Sharing incentive
    | 'CONVERT' // Reserved: Energy → Credit
    | 'REFUND'; // Reserved: Purchase reversal

  reference_id: string; // Link to Order/Exam/Share ID
  reference_type: string;
  balance_after: number; // Denormalized for quick audit
  idempotency_key: string; // UUID for exactly-once processing

  // Risk metadata
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
```

### 2.2 Exam Generation Flow (Consumption)

#### 2.2.1 Payment Logic - Phase 1 (MVP)

**Simple Deduction Model**: Exams cost fixed Credit amount only.

```typescript
// Service Logic
class ExamGenerationService {
  async generateExam(userId: string, params: ExamParams) {
    const COST = 100; // Credits per exam

    // Atomic deduction with pessimistic locking
    await tokenService.deductTokens({
      userId,
      amount: COST,
      tokenType: 'CREDIT',
      idempotencyKey: params.request_id,
      reference: { type: 'EXAM_GENERATION', id: examId },
    });

    return await createExam(params);
  }
}
```

#### 2.2.2 Payment Logic - Phase 2 (Hybrid)

**Priority Wallet Model**: Energy used first, Credit as backup.

```typescript
async function deductWithPriority(userId: string, amount: number) {
  const energy = await getBalance(userId, 'ENERGY');

  if (energy >= amount) {
    return await deductTokens(userId, 'ENERGY', amount);
  } else {
    // Future: Allow partial Energy + partial Credit
    throw new InsufficientEnergyError('Please purchase Credits');
  }
}
```

### 2.3 Energy Reward System (Supply)

#### 2.3.1 Sharing Incentive Mechanism

Users earn Energy when their shared content (topics/pro-tips) is **consumed** by others.

**Reward Trigger Conditions:**

1. **Uniqueness**: Consumer user hasn't used the same content in last 24h (anti-farming)
2. **Quality Gate**: Content similarity score < 30% (prevents spam duplicates)
3. **Volume Cap**: Max 200 Energy/day per user (prevents bot exploitation)

```typescript
// Reward Distribution Service
class RewardService {
  async processReward(shareId: string, consumerId: string) {
    // Anti-fraud checks
    if (await this.isDuplicateConsumption(shareId, consumerId)) return;
    if (await this.isLowQualityContent(shareId)) return;
    if (await this.isDailyCapReached(shareId.ownerId)) return;

    // Distribute reward
    await tokenService.addTokens({
      userId: shareId.ownerId,
      tokenType: 'ENERGY',
      amount: 50, // Fixed reward for MVP
      reference: { type: 'SHARE_REWARD', shareId },
    });
  }
}
```

---

## 3. Non-Functional Requirements

### 3.1 Concurrency & Consistency

**Challenge**: Prevent overselling during high-traffic exam generation.

**Solution**: Optimistic Locking Pattern

```typescript
// Atomic update with version control
const updated = await db.token_accounts
  .where({
    user_id: userId,
    token_type: type,
    version: currentVersion, // Match required
  })
  .update({
    balance: newBalance,
    version: currentVersion + 1,
  });

if (updated === 0) {
  throw new ConcurrentModificationError(); // Retry with exponential backoff
}
```

### 3.2 Idempotency Guarantee

All financial operations must be idempotent to handle network timeouts and retries:

- Client generates `idempotency_key` (UUID v4)
- Server stores processed keys for 24h
- Duplicate requests return cached response

### 3.3 Financial Risk Controls

1. **Negative Balance Prevention**: Database constraint `CHECK (balance >= 0)`
2. **Daily Limits**: Energy earnings capped at 200/day; Credit purchases capped at 5000 CNY/day (anti-fraud)
3. **Audit Trail**: All transactions immutable; soft-delete only with compensation transactions

---

## 4. API Specifications

### 4.1 Exam Generation (Consumption)

```http
POST /api/v1/exams/generate
Content-Type: application/json
Idempotency-Key: {uuid}

{
  "topic_id": "topic_123",
  "difficulty": "medium",
  "preferred_token": "CREDIT",  // MVP: Only CREDIT supported
  "force_credit_only": true
}

Response: 201 Created
{
  "exam_id": "exam_456",
  "cost": {
    "amount": 100,
    "token_type": "CREDIT",
    "remaining_balances": {
      "credit": 400,
      "energy": 150
    }
  },
  "status": "generating"
}

Error: 402 Payment Required
{
  "error": "INSUFFICIENT_CREDITS",
  "required": 100,
  "current_balance": 50,
  "checkout_url": "/billing/top-up"
}
```

### 4.2 Balance Inquiry

```http
GET /api/v1/wallet/balance

Response: 200 OK
{
  "currencies": [
    {
      "type": "CREDIT",
      "balance": 400,
      "usable": 400,
      "frozen": 0,
      "expires_at": null
    },
    {
      "type": "ENERGY",
      "balance": 150,
      "usable": 150,
      "frozen": 0,
      "expires_at": "2024-02-15T00:00:00Z"
    }
  ]
}
```

### 4.3 Transaction History

```http
GET /api/v1/wallet/transactions?type=ENERGY&limit=20

Response: 200 OK
{
  "transactions": [
    {
      "id": "tx_789",
      "type": "REWARD_SHARE",
      "amount": 50,
      "balance_after": 150,
      "description": "Reward: Your topic 'React Hooks' was used by @alice",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 5. Data Migration Strategy

### 5.1 Legacy Data Migration

Assuming existing `users.tokens` column:

```sql
-- Migration Script: Split legacy tokens into new structure
BEGIN;

-- Migrate existing balances to CREDIT type
INSERT INTO token_accounts (user_id, token_type, balance, version, created_at)
SELECT
  id,
  'CREDIT',
  COALESCE(tokens, 0),
  1,
  NOW()
FROM users
WHERE tokens > 0;

-- Verify migration
SELECT COUNT(*) as migrated_count FROM token_accounts;

COMMIT;
```

### 5.2 Rollback Plan

- Keep `users.tokens` column for 2 weeks (dual-write period)
- If critical failure, restore from backup and refund transactions manually

---

## 6. Risk Assessment & Mitigation

| Risk                       | Probability | Impact | Mitigation Strategy                                                                                                  |
| -------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| **Concurrent Overselling** | Medium      | High   | Optimistic locking (version field) + Database row-level locking (`FOR UPDATE`)                                       |
| **Energy Farming**         | High        | High   | 24h cooldown on same consumer; Device fingerprinting; Content deduplication (SimHash)                                |
| **Economic Inflation**     | Medium      | Medium | Mandatory 30-day Energy expiration; Dynamic reward adjustment algorithm                                              |
| **Refund Arbitrage**       | Low         | Medium | Strict separation: Refunds only apply to unspent Credits; Energy rewards are irreversible                            |
| **Regulatory Compliance**  | Medium      | High   | Energy cannot be converted to fiat or Credits (avoid unlicensed payment services); Clear T&C stating "virtual goods" |

---

## 7. Implementation Roadmap

### Phase 1: MVP (Week 1) - Revenue Enablement

- [ ] Token account schema deployment
- [ ] Credit purchase integration (payment gateway)
- [ ] Fixed-cost exam generation (Credit only)
- [ ] Basic Energy earning (sharing rewards)
- [ ] Transaction ledger with idempotency

**Success Criteria**:

- Zero overselling incidents
- <200ms latency on balance checks
- 100% audit trail coverage

### Phase 2: Economy Balancing (Month 2) - Engagement Optimization

- [ ] Hybrid payment (Energy + Credit combinations)
- [ ] Dynamic pricing engine (A/B testing cost points)
- [ ] Energy marketplace (transfer between users)
- [ ] Advanced anti-fraud ML models

### Phase 3: Ecosystem (Future) - Platform Expansion

- [ ] NFT/Badge tokens for achievements
- [ ] Staking mechanisms (lock Credits for discounts)
- [ ] Creator royalty splits (percentage of Energy from derivative works)

---

## 8. Success Metrics (KPIs)

### Financial Health

- **Token Velocity**: Daily consumption / Total supply (Target: 15-25% healthy range)
- **Conversion Rate**: Free users → Credit purchasers (Target: >3%)
- **Average Revenue Per User (ARPU)**: Monthly Credit spend per active user

### Economic Balance

- **Energy Utilization Rate**: % of Energy used before expiration (Target: >60%, <90%)
- **Fraud Rate**: Invalid reward claims / Total rewards (Target: <0.1%)

### System Stability

- **Double-spend Incidents**: Must be zero
- **Transaction Reconciliation**: 100% match between balances and ledger sum daily

---

## 9. Future Extensibility Hooks

### 9.1 Dynamic Pricing Interface

Reserved interface for surge pricing and personalization:

```typescript
interface PricingEngine {
  calculateCost(
    userId: string,
    action: string,
    context: Context,
  ): Promise<{
    base_cost: number;
    discounts: Discount[]; // VIP, time-based, loyalty
    final_cost: number;
    currency: 'CREDIT' | 'ENERGY';
  }>;
}
```

### 9.2 Multi-Token Support

The `token_type` enum and `metadata` JSONB field support future:

- **Subscription Passes**: Time-limited unlimited generation
- **Institutional Tokens**: Bulk purchase pools for B2B sales

---

## 10. Appendix: Glossary

- **Credit Token**: Purchased currency; primary revenue source; permanent validity
- **Energy Token**: Earned currency; engagement incentive; 30-day expiry
- **Idempotency Key**: Unique client-generated identifier ensuring exactly-once processing
- **Optimistic Locking**: Concurrency control using version numbers instead of database locks
- **Velocity**: Speed of token circulation; high velocity indicates healthy economy or inflation
