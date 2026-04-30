# SWR Type Enforcement - Work Tracker (Per-File Commits)

**Purpose**: One file per commit - check off as you complete each file

---

## 📊 Overall Progress

- **Completed**: 2/17 files (certifications.ts, exams.ts)
- **In Progress**: ⏸️ None (ready to start)
- **Remaining**: 15 files

**Progress Bar**: `██░░░░░░░░░░░░░░░░░░░░░░░░░░░` (12%)

---

## 📋 NEXT FILE TO WORK ON

**→ [Phase 1.1] exams.ts** - Remove `[key: string]: any` from request types

- **File**: `src/types/swr-data/exams.ts`
- **Time**: 15 min | **Complexity**: LOW
- **Impact**: Type safety for request bodies
- **Commit Message**: `chore: enforce strict types in exams request interfaces`

---

## ✅ COMPLETED FILES (2)

- [x] certifications.ts (Phase 1)
- [x] exams.ts (Phase 2 - major refactor)

---

## 📝 WORK QUEUE - BY COMMITMENT ORDER

### PHASE 1️⃣: QUICK WINS (45 minutes total | 3 files)

#### [ ] 1.1 - exams.ts (Request Types)

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**File**: `src/types/swr-data/exams.ts` (lines ~205-214)
**What to do**:

```
- Find UserAnswer interface - remove [key: string]: any
- Find ExamAnswerSubmission interface - remove [key: string]: any
- Verify: grep -n "[key: string]: any" src/types/swr-data/exams.ts
- Test: npx tsc --noEmit
- Commit: chore: enforce strict types in exams request interfaces
```

#### [ ] 1.2 - questions.ts (Fetcher Return Type)

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**File**: `src/swr/questions.ts` (line ~61)
**What to do**:

```
- Find submitAnswerFetcher() - change Promise<any> to Promise<SubmitAnswerData>
- Verify: grep -n "Promise<any>" src/swr/questions.ts
- Test: npx tsc --noEmit
- Commit: chore: type submitAnswerFetcher return value properly
```

#### [ ] 1.3 - examInfo.ts (String Literal → Enum)

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**File**: `src/swr/examInfo.ts` (line ~31)
**What to do**:

```
- Find 'QUESTIONS_GENERATING' string literal in refreshInterval
- Replace with BackendExamStatus.QUESTIONS_GENERATING
- Verify: grep -n "QUESTIONS_GENERATING" src/swr/examInfo.ts
- Test: npx tsc --noEmit
- Commit: chore: replace string literal with BackendExamStatus enum
```

---

### PHASE 2️⃣: MEDIUM EFFORT (30 minutes total | 2 files)

#### [ ] 2.1 - profile.ts (UpdateProfileData Interface)

**Status**: ⏹️ NOT STARTED | **Est**: 20 min
**File**: `src/types/swr-data/profile.ts` or `src/swr/profile.ts`
**What to do**:

```
- Find UpdateProfileData with [key: string]: any
- Check what fields CAN be updated (check API docs/backend)
- Replace [key: string]: any with explicit fields
  Example: enabled_notifications?: boolean, bio?: string, etc.
- Add @guaranteed/@optional JSDoc comments
- Verify: grep -n "[key: string]: any" src/swr/profile.ts
- Test: npx tsc --noEmit
- Commit: chore: enforce strict UpdateProfileData types
```

#### [ ] 2.2 - Infrastructure Documentation

**Status**: ⏹️ NOT STARTED | **Est**: 10 min
**Files**: `src/hooks/useAuthMutation.ts`, `src/hooks/useAuthSWR.ts`
**What to do**:

```
- Open both files
- Add JSDoc comments explaining WHY any<> defaults are acceptable
- Example: "Generic wrapper with any defaults - safe pattern for reusable hooks"
- Update /memories/swr-type-enforcement-pattern.md with "acceptable patterns" section
- Commit: docs: document acceptable generic any patterns in auth hooks
```

---

### PHASE 3️⃣: HIGH EFFORT (2-3 hours | 1 major file)

#### [ ] 3.1 - useAllData.ts (Complex Data Transformation)

**Status**: ⏹️ NOT STARTED | **Est**: 2-3 hours
**File**: `src/swr/useAllData.ts` (lines ~27, 36, 37)
**What to do** (split into sub-commits if needed):

```
STEP 1 - Discovery (Read-only, no changes):
  a) Find file: grep -r "export.*useAllData\|function useAllData" src/
  b) Open file, read overall structure
  c) Find fetchAllFirms() and fetchAllCertifications() functions
  d) Check what Firm and Certification types they return
  e) Note the exact 3 locations with (param: any)

STEP 2 - Type Creation:
  a) Create proper Firm and Certification data types (if missing)
  b) Add to src/types/swr-data/ files
  c) Export clean, no [key: string]: any
  d) Commit: chore: create explicit Firm and Certification data types

STEP 3 - Implementation:
  a) Import Firm type for line 27 callback
  b) Replace (firm: any) with (firm: Firm)
  c) Import Certification type for lines 36-37 callbacks
  d) Replace (cert: any) with (cert: Certification)
  e) Verify: npx tsc --noEmit
  f) Commit: chore: enforce strict types in useAllData callbacks
```

---

### PHASE 4️⃣: FINAL VERIFICATION (30 minutes | cleanup)

#### [ ] 4.1 - Verify "Known Good" Files

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**Files**: firms.ts, certSummary.ts, createExam.ts
**What to do**:

```
- Spot-check each file for proper typing
- Confirm generic types are explicit
- Add note to memory: "Verified good - no issues"
- Commit: docs: verify good typing patterns in firms, certSummary, createExam
```

#### [ ] 4.2 - Final Cleanup & Verification

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**What to do**:

```
- Run: npx tsc --noEmit 2>&1 | grep "^src/" (should be empty)
- Run: grep -r "Promise<any>" src/swr (should be empty)
- Run: grep -r "[key: string]: any" src/types/swr-data (should be empty)
- Run: grep -r "(.*: any).*=>" src/swr (should be empty)
- Delete: EXAMS_TYPING_ANALYSIS.md
- Update: /memories/swr-type-enforcement-pattern.md with final status
- Commit: chore: complete SWR type enforcement - all 17 files typed
```

---

## 🚦 Progress Matrix (Easy to Scan)

| Phase | File                    | Steps            | Status | Est  | Complexity |
| ----- | ----------------------- | ---------------- | ------ | ---- | ---------- |
| 1     | exams.ts (types)        | Remove any       | ⏹️     | 15m  | 🟢 LOW     |
| 1     | questions.ts            | Fix return type  | ⏹️     | 15m  | 🟢 LOW     |
| 1     | examInfo.ts             | Replace string   | ⏹️     | 15m  | 🟢 LOW     |
| 2     | profile.ts              | Fix interface    | ⏹️     | 20m  | 🟢 LOW     |
| 2     | useAuthMutation/AuthSWR | Document         | ⏹️     | 10m  | 🔵 DOCS    |
| 3     | useAllData.ts           | 3× any callbacks | ⏹️     | 2-3h | 🔴 HIGH    |
| 4     | Good files              | Verify           | ⏹️     | 15m  | 🔵 DOCS    |
| 4     | Final check             | Cleanup          | ⏹️     | 15m  | 🟢 LOW     |

**Total**: 15 files | ~4 hours | **0 complete yet in this session**

---

## 💾 How to Use This File

Each time you complete a file:

1. ✅ Check the box: `[x]` (was `[ ]`)
2. Update "Overall Progress" bar at top
3. Move "NEXT FILE" pointer down to next unchecked item
4. Make your commit with the suggested message
5. Note: Save this file after each commit so next session you know exactly where you left off

**Example after completing 1.1**:

```
- [x] 1.1 - exams.ts (Request Types)
→ NEXT: [Phase 1.2] questions.ts
```

---

## 🎯 Success Criteria (Final Checklist for 4.2)

- [ ] 0 TypeScript errors in `src/`
- [ ] 0 `Promise<any>` in SWR fetchers
- [ ] 0 `[key: string]: any` in data interfaces
- [ ] 0 `(param: any)` in callbacks
- [ ] All status strings → enums
- [ ] All 15 files fixed/verified
- [ ] EXAMS_TYPING_ANALYSIS.md deleted
- [ ] Memory files updated

---

**Last Updated**: 1 May 2026
**Workflow**: One file per session/commit
