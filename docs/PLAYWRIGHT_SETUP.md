# Playwright E2E Testing Setup Guide

This guide walks through setting up and running Playwright E2E tests for the certifai-app frontend.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs Playwright and the `dotenv` package needed to load environment variables.

### 2. Create `.env.local` File

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase test user credentials:

```env
PW_TEST_EMAIL=your-test-email@firebase-app.com
PW_TEST_PASSWORD=your-secure-password
```

### 3. Run Tests

```bash
npm run test:e2e
```

---

## Troubleshooting

### Error: "Missing test credentials. Set PW_TEST_EMAIL and PW_TEST_PASSWORD in .env.local"

This error means environment variables aren't being loaded. Follow these steps:

#### Step 1: Verify `.env.local` File Exists

```bash
# Check if .env.local exists
ls -la .env.local

# If it doesn't exist, create it
cp .env.local.example .env.local
```

#### Step 2: Verify Credentials Are Set

```bash
# Check the contents (don't commit this!)
cat .env.local
```

Expected output:
```
PW_TEST_EMAIL=your-test-email@example.com
PW_TEST_PASSWORD=your-test-password
```

#### Step 3: Install `dotenv` Package

The environment loader needs the `dotenv` package:

```bash
npm install dotenv
```

Or install all dev dependencies fresh:

```bash
npm ci
```

#### Step 4: Verify Node.js Version

Ensure you're using Node.js >= 24.0.0:

```bash
node --version
# Should output: v24.x.x or higher
```

#### Step 5: Try Running Tests with Explicit Credentials

Test if credentials work when passed as environment variables:

```bash
PW_TEST_EMAIL="your-email@example.com" PW_TEST_PASSWORD="your-password" npm run test:e2e
```

If this works, the issue is with `.env.local` file loading. Try:

```bash
# Delete .env.local and recreate it
rm .env.local
cp .env.local.example .env.local
# Edit and add credentials again
nano .env.local  # or use your preferred editor

# Try again
npm run test:e2e
```

#### Step 6: Check File Encoding

Make sure `.env.local` is saved as UTF-8 (not UTF-16 or other encoding):

```bash
# Check file type
file .env.local

# Should output something like:
# .env.local: ASCII text
```

#### Debugging: View Which Environment Variables Are Loaded

The error message now shows which variables are available. When you run tests, you'll see:

```
Environment variables available:
PW_TEST_EMAIL: ✓ SET
PW_TEST_PASSWORD: ✓ SET
```

If you see:
```
PW_TEST_EMAIL: ✗ NOT SET
PW_TEST_PASSWORD: ✗ NOT SET
```

Then the `.env.local` file isn't being loaded properly.

---

## Setting Up Firebase Test Account

### 1. Create a Firebase Test User

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication → Users
4. Click "Create user" (or use an existing test user)
5. Set email: `playwright-test@example.com` (or any test email)
6. Set password: A secure test password
7. Click "Create"

### 2. Register Test User in Your App (If Required)

If your app requires users to register, sign up with the test account manually first.

### 3. Ensure Test User Has Data (For Exam Tests)

Make sure your test account:
- Has registered certifications
- Has at least one exam available (or can create one)
- Has necessary permissions to take and create exams

---

## Running Tests

### Run All Tests (Headless)

```bash
npm run test:e2e
```

### Run Tests in Interactive UI Mode

```bash
npm run test:e2e:ui
```

Opens Playwright Inspector where you can:
- Watch tests run live
- Step through individual tests
- Inspect page elements
- View detailed logs

### Run Tests with Visible Browser

```bash
npm run test:e2e:headed
```

### Run Specific Test File

```bash
npx playwright test e2e/signin.spec.ts
```

### Run Specific Test Case

```bash
npx playwright test -g "should successfully sign in"
```

### Run with Debug Output

```bash
npx playwright test --debug
```

---

## Test Structure

### Test Files

- **e2e/signin.spec.ts** — Sign-in flow tests
  - Valid login
  - Invalid password
  - Invalid email
  - Empty fields
  - Session persistence
  - Redirect validation

- **e2e/exam.spec.ts** — Exam management tests
  - View first exam
  - Create exam
  - Delete exam
  - Validation tests

### Authentication Fixture

All tests use the `authenticatedPage` fixture from `e2e/fixtures/auth.ts`:

```typescript
import { test, expect } from './fixtures/auth';

test('my test', async ({ authenticatedPage }) => {
  // Already authenticated!
  await authenticatedPage.goto('/dashboard');
});
```

The fixture:
- Logs in once per test session
- Reuses session across tests (speeds up testing)
- Saves auth state to `.auth/user.json`
- Automatically logs in again if session expires

---

## Viewing Test Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Or manually open: `file://$(pwd)/playwright-report/index.html`

The report shows:
- Test results (passed/failed/skipped)
- Screenshots on failure
- Execution duration
- Error details and traces

---

## GitHub Actions CI/CD

Tests run automatically on:
- Push to `main`, `develop`, or `staging`
- Pull requests to those branches

### Setting Up CI/CD

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:

```
PW_TEST_EMAIL          = your-test-email@example.com
PW_TEST_PASSWORD       = your-secure-password
```

Plus any Firebase config secrets needed in `.env.local`

3. The workflow file at `.github/workflows/playwright.yml` will run automatically

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | `pkill -f "next dev"` then try again |
| Tests timeout on login | Verify test account credentials are correct |
| Tests work locally but fail on CI | Check GitHub secrets are set correctly |
| Can't find elements | Run `npm run test:e2e:ui` to debug selectors |
| Auth state corrupted | Delete `.auth/` folder and re-run tests |

---

## Best Practices

1. **Use a dedicated test account** — Don't use production user accounts
2. **Never commit `.env.local`** — It's in `.gitignore` for security
3. **Run tests locally before pushing** — Catch issues early
4. **Check test reports** — Understand failures before fixing
5. **Keep credentials secure** — Use GitHub secrets for CI/CD
6. **Maintain test data** — Ensure test account has exams available

---

## Next Steps

- Run `npm install` to install dependencies
- Create `.env.local` with your test credentials
- Run `npm run test:e2e` to execute tests
- Check `PLAYWRIGHT_SETUP.md` sections above as needed

