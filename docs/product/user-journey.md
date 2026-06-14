# Certestic User Journey (Route-Based)

This document maps **how users navigate between Next.js routes**, what they can do on each page, and the resulting **product feature list**.

## Journey map at a glance

- **Public discovery**: `/` → marketing pages (`/certifications`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`)
- **Account access**: `/signup`, `/signin`, `/forgot-password`
- **Protected learning app**: `/main` and child routes (`/main/certifications`, `/main/profile`, `/main/billing`, exam routes)
- **Checkout flow (optional)**: `/main/billing` → Stripe → `/main/stripe/callback`

> Note: `/main/*` routes are protected by middleware and auth guard. Unauthenticated users are redirected to `/signin`.

---

## Route-based user journeys

### 1) First-time visitor discovers the product

**Entry routes**

- `/`
- `/certifications`
- `/pricing`
- `/about`

**Navigation flow**

- User lands on `/` and explores value proposition.
- Uses header navigation to open `/certifications`, `/pricing`, `/about`, `/contact`.
- Can drill into certification details:
  - `/certifications/[firmCode]`
  - `/certifications/[firmCode]/[slug]`
  - `/certifications/[firmCode]/[slug]/training`

**What users do**

- Learn what Certestic offers.
- Browse certification catalog and provider-specific pages.
- Read pricing and trust/legal pages.
- Decide whether to sign up.

**Primary conversion actions**

- Go to `/signup`
- Go to `/signin`

---

### 2) New user signs up and activates account

**Entry route**

- `/signup`

**Navigation flow**

- User completes registration form (name, email, password, terms acceptance, initial certification).
- Email verification step is shown (non-UAT), then user continues to `/signin`.
- After successful sign-in and auth initialization, user is redirected to `/main`.

**What users do**

- Create account.
- Optionally resend verification email.
- Start authenticated experience.

---

### 3) Returning user signs in / recovers password

**Entry routes**

- `/signin`
- `/forgot-password`

**Navigation flow**

- Returning user signs in at `/signin`.
- If password is forgotten: `/signin` → `/forgot-password`.
- On successful auth, user is redirected to `/main`.

**What users do**

- Authenticate.
- Reset password via email.
- Resume learning workflow.

---

### 4) Authenticated user monitors progress from dashboard

**Entry route**

- `/main`

**Navigation flow**

- App header allows navigation to:
  - `/main` (Dashboard)
  - `/main/certifications`
  - `/main/profile`
  - `/main/billing` (when billing feature is enabled)

**What users do**

- View personal dashboard stats.
- Review registered certifications.
- Jump to certification/exam workflows.

---

### 5) User registers certifications and manages exam practice

**Entry route**

- `/main/certifications`

**Navigation flow**

- User browses available certifications by provider.
- Registers a certification.
- Opens certification route:
  - `/main/certifications/[cert_id]` (redirects to exams page)
  - `/main/certifications/[cert_id]/exams`
- Starts/continues an exam:
  - `/main/certifications/[cert_id]/exams/[exam_id]`

**What users do**

- Register new certifications.
- Create AI-generated practice exams.
- Track generation status.
- Start, answer, paginate, and submit exams.
- View exam outcomes and feedback states.
- Delete unwanted exams.

**How users use the main app in this journey (detailed)**

- From `/main/certifications/[cert_id]/exams`, users click **New Exam** to open the exam generator modal.
- Users choose **number of questions** and add **custom instructions** (topic focus), for example:
  - "Focus on IAM and access control scenarios"
  - "Prioritize troubleshooting questions"
  - "Emphasize networking fundamentals"
- Behind the scenes, the exam generator turns the selected certification, the user’s instructions, and the requested question count into a topic plan.
- Topics are then distributed across the exam so coverage stays balanced instead of clustering around one area, which helps users get a clearer picture of strengths and gaps.
- After creation, users monitor generation progress and open the exam when ready.
- During the exam at `/main/certifications/[cert_id]/exams/[exam_id]`, users:
  - answer questions with autosave behavior,
  - move page-by-page,
  - review topic grouping shown in the exam view, which reflects the generated topic distribution,
  - submit when complete.
- After submission, users review:
  - score and completion status,
  - topic-level understanding signals,
  - **AI Exam Report** (performance summary + recommendations).

**User value delivered**

- **Targeted practice, less wasted time**: topic-focused instructions align practice with real weak spots.
- **Progressive mastery**: users move from raw practice to measurable outcomes (completion + scores).
- **Actionable feedback**: AI report translates results into specific next study actions.
- **Faster confidence-building**: users can quickly iterate (create another focused exam) and improve.

---

### 6) User manages account and profile settings

**Entry route**

- `/main/profile`

**Navigation flow**

- User opens profile from app header dropdown.

**What users do**

- View account details and membership info.
- Edit display name.
- Access billing management shortcut.
- Trigger account deletion flow.

---

### 7) User manages plan and subscription (feature-flagged)

**Entry route**

- `/main/billing`

**Navigation flow**

- User views current plan and pricing options.
- Starts checkout or plan update.
- Returns from Stripe callback:
  - `/main/stripe/callback?session_id=...` (success)
  - `/main/stripe/callback?canceled=true` (canceled)
- Returns to `/main` or `/main/billing`.

**What users do**

- View active subscription state.
- Upgrade/change/cancel subscription.
- Review billing history sections.

---

### 8) User needs help, legal info, or “coming soon” modules

**Entry routes**

- `/contact`
- `/privacy`
- `/terms`
- `/study-guides`
- `/coming-soon`

**Redirected routes**

- `/support` → `/coming-soon`
- `/blog` → `/coming-soon`
- `/community` → `/coming-soon`
- `/documentation` → `/coming-soon`

**What users do**

- Contact team via email actions.
- Review legal/privacy policy.
- Discover upcoming features and opt into notifications.

---

## Product features derived from journeys

### Acquisition & marketing

- Landing page with CTA to sign up/sign in.
- Certification catalog and provider/slug detail pages.
- Pricing, About, Contact, Terms, Privacy pages.
- Coming-soon campaign and notification capture.

### Authentication & identity

- Sign up with validation and onboarding fields.
- Sign in with robust redirect handling.
- Forgot-password and email action flows.
- Protected-route middleware + client auth guard.

### Core learning workflow

- Dashboard with personalized stats and registered certifications.
- Certification registration and catalog management.
- AI exam creation with topic/prompt controls.
- AI-driven topic planning and balanced topic distribution across exams.
- Exam generation monitoring and status refresh.
- Exam attempt UI (pagination, answer selection, submission, result states).
- Topic-aware exam experience (topic grouping visibility while taking exams).
- AI exam report generation and insights (score summary + performance guidance).
- Exam lifecycle actions (open/start/delete).

### Learning value outcomes for users (main app)

- Better study focus: users can direct exam generation toward high-priority topics.
- Better retention: frequent practice + immediate reinforcement from completed exams.
- Better decision-making: AI summaries help users decide what to study next.
- Better exam readiness: repeated focused attempts improve confidence before real certification exams.

### Account & subscription

- Profile management (view/edit basic identity fields).
- Account actions (including delete flow).
- Billing/subscription management (feature-flagged).
- Stripe callback handling (success/cancel states).

### Platform reliability & safety

- Route protection and auth-based redirects.
- Error/loading/recovery flows (session timeout, loading fallback, not-found behavior).
- Consent-aware analytics and legal policy transparency.

---

## Suggested KPI mapping by journey (optional)

- **Discovery → Signup**: landing CTA click-through, `/signup` conversion rate
- **Signup → Main**: successful account activation and first authenticated session rate
- **Main → First exam**: time-to-first-exam-created
- **Exam workflow quality**: exam completion rate, submission success rate
- **Retention**: returning authenticated users to `/main`
- **Monetization**: billing page visit → checkout start → successful callback rate
