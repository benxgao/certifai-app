# Marketing Integration - MailerLite User Registration Workflow

## Overview

When a new user signs up for Certifai, they are automatically registered with MailerLite (our email marketing platform) after successfully verifying their email address. This ensures all active users are added to our marketing lists for newsletters, product updates, and promotional communications.

## Complete Registration Workflow

### Step 1: User Signup
- **Location**: `/app/signup/page.tsx` (SignUpPage component)
- **Action**: User fills out the signup form with email, password, first name, and last name
- **Details**:
  - Form validation occurs client-side
  - User selects a certification to start with
  - Form submission triggers `handleSignUp` function

### Step 2: Firebase Authentication
- **Location**: `/app/signup/page.tsx` (handleSignUp function)
- **Action**: Create user account with Firebase Auth
- **Details**:
  - `createUserWithEmailAndPassword(auth, email, password)` is called
  - User's display name is set with `updateProfile(user, { displayName: firstName lastName })`
  - Firebase generates a unique UID for the user
  - User account is created but marked as unverified

### Step 3: Backend API Registration
- **Location**: `/app/api/auth/register` endpoint
- **Action**: Register user in the Certifai backend database
- **Details**:
  - User's Firebase ID token is sent to the API
  - Backend creates a user record with:
    - First name
    - Last name
    - Email address
    - CertId (initial certification)
  - Backend returns API user ID
  - This step runs with a 15-second timeout to prevent hanging
  - Even if this step fails, signup continues (non-blocking)

### Step 4: Email Verification Request
- **Location**: `/app/signup/page.tsx` (sendEmailVerificationWithRetry function)
- **Action**: Send verification email to user
- **Details**:
  - Firebase `sendEmailVerification()` is called with action code settings
  - Email contains a verification link with special parameters
  - Link format: `{origin}?mode=verifyEmail&oobCode={code}`
  - Includes retry logic with exponential backoff (2s, 4s, 6s delays)
  - Shows verification UI step to user

### Step 5: User Verifies Email
- **Location**: Email link → `/` (app root, handled by EmailActionHandler)
- **Action**: User clicks verification link in email
- **Details**:
  - Email link contains `mode=verifyEmail` and `oobCode` parameters
  - Browser is redirected to app root which detects these URL parameters
  - `EmailActionHandler` component is rendered

### Step 6: Email Verification Processing
- **Location**: `/src/components/auth/EmailActionHandler.tsx`
- **Action**: Process email verification
- **Details**:
  - Extracts `mode` and `oobCode` from URL search parameters
  - Calls `checkActionCode()` to determine action type (should be VERIFY_EMAIL)
  - Calls `applyActionCode(auth, oobCode)` to verify the email
  - Firebase marks the user's email as verified
  - Includes enhanced retry logic for newly created accounts

### Step 7: MailerLite Registration (Key Marketing Step!)
- **Location**: `/src/components/auth/EmailActionHandler.tsx` (after email verification)
- **Trigger**: Only runs when operation === 'VERIFY_EMAIL' (email verification after signup)
- **Action**: Subscribe user to MailerLite marketing list
- **Details**:
  - **Wait 1 second** for Firebase auth state to update after email verification
  - Extract user information from Firebase:
    - Email address (from `currentUser.email` or `actionCodeInfo.data.email`)
    - First name and Last name (parsed from `currentUser.displayName`)
    - User Agent (from browser)
  - Call `/api/marketing/subscribe` API endpoint
  - **Non-blocking**: If this fails, it doesn't prevent user from completing signup

### Step 8: Marketing API Endpoint
- **Location**: `/app/api/marketing/subscribe/route.ts`
- **Action**: Handle marketing subscription request
- **Details**:
  - Receives POST request with:
    - `email`: User's email address
    - `firstName`: User's first name (optional)
    - `lastName`: User's last name (optional)
    - `userAgent`: User's browser user agent string
  - Validates that email is present
  - Calls `subscribeUserToMarketing()` server function
  - **Always returns HTTP 200** status (regardless of success/failure)
    - This prevents frontend error popups
    - Success/failure info is in response body `success` field
  - Includes 15-second timeout to prevent hanging

### Step 9: Subscribe User Server Function
- **Location**: `/src/lib/marketing-api.ts` (subscribeUserToMarketing function)
- **Action**: Authenticate and send subscription data to MailerLite via AWS Lambda
- **Details**:
  - Generates JWT token using `generateMarketingJWT()`:
    - Uses `MARKETING_API_SECRET` environment variable
    - Token is valid for subscription request
  - Retrieves MailerLite API URL from `MARKETING_API_URL` environment variable
  - Creates standardized subscription data using `createSubscriptionData()`:
    ```typescript
    {
      email: "user@example.com",
      firstName: "John",           // optional
      lastName: "Doe",              // optional
      fields: {
        source: "certifai-app-signup",
        signup_date: "2024-01-15",
        user_agent: "Mozilla/5.0..."  // if available
      },
      groups: ["new-users", "newsletter"],
      ip_address: undefined,
      status: "active"
    }
    ```
  - Sends POST request to AWS Lambda endpoint:
    - Header: `Authorization: Bearer {jwtToken}`
    - Body: Subscription data (JSON)
    - Timeout: Applied to prevent hanging

### Step 10: AWS Lambda → MailerLite
- **Infrastructure**: AWS Lambda function (backend system)
- **Action**: Forward subscription to MailerLite API
- **Details**:
  - AWS Lambda receives authenticated request
  - Authenticates request using JWT token
  - Calls MailerLite API to add/update subscriber:
    - Creates new subscriber if email doesn't exist
    - Updates existing subscriber if already in MailerLite
  - Adds subscriber to groups:
    - `new-users`: Identifies fresh signups
    - `newsletter`: Enables newsletter communications
  - Sets subscriber status to "active"
  - Returns subscriber ID back to the app

### Step 11: Subscriber ID Storage
- **Location**: `/src/lib/marketing-claims.ts` (saveSubscriberIdToClaims function)
- **Action**: Save MailerLite subscriber ID to Firebase user claims
- **Details**:
  - After successful MailerLite subscription
  - Subscriber ID is saved to user's Firebase custom claims
  - Stored as `subscriberId` field
  - Enables future lookups and marketing operations
  - Reference for customer support and analytics

### Step 12: Completion & Redirect
- **Location**: `/src/components/auth/EmailActionHandler.tsx`
- **Action**: Email verification complete
- **Details**:
  - Sets status to 'success'
  - Displays success message
  - Auto-redirects to `/signin` or `/dashboard` depending on user state
  - User can now sign in with verified email

## Key Features & Safety Mechanisms

### Non-Blocking Marketing Subscription
- Marketing subscription failure **never blocks user signup**
- If MailerLite subscription fails, user still completes signup successfully
- Errors are logged for monitoring but not shown to user
- 15-second timeout prevents hanging

### Data Collection
- ✅ Email address (verified)
- ✅ First name
- ✅ Last name
- ✅ Signup date
- ✅ Source (certifai-app-signup)
- ✅ User agent
- ❌ IP address (not collected currently)

### MailerLite Groups
- **new-users**: All newly registered users (added at signup)
- **newsletter**: Opt-in users (added automatically at signup, can unsubscribe)

### Subscriber Status
- Set to **"active"** upon registration
- Users can unsubscribe from MailerLite anytime via email links

## Environment Variables Required

```bash
MARKETING_API_URL=https://your-aws-lambda-endpoint.com
MARKETING_API_SECRET=your-jwt-secret-key
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-key
```

## Error Handling & Fallbacks

| Error | Location | Handling |
|-------|----------|----------|
| Email not provided | API route | Returns 400 error in response body, HTTP 200 status |
| JWT generation fails | subscribeUserToMarketing | Logs warning, returns error result |
| AWS Lambda timeout | subscribeUserToMarketing | 15-second timeout returns error result |
| MailerLite API fails | AWS Lambda | Error logged, user signup completes |
| Email verification fails | EmailActionHandler | Retry logic with 3 attempts, enhanced error messages |

## Monitoring & Debugging

### Console Logs
The system includes detailed console logging prefixed with `marketing_api:` for debugging:
- JWT token generation status
- API URL configuration check
- Request data being sent
- Response status and subscriber ID

### Debug Utility
Signup flow has comprehensive debug logging (`signupDebugger`) that tracks:
- Firebase signup step
- Profile update step
- API registration step
- Email verification step
- Each step logs success/pending/error status

## Flow Diagram

```
User Signup Form
    ↓
Firebase Auth: Create User
    ↓
Backend API: Register User
    ↓
Firebase: Send Verification Email
    ↓
User Clicks Email Link
    ↓
EmailActionHandler: Verify Email
    ↓
✅ EMAIL VERIFIED
    ↓
Call Marketing API: /api/marketing/subscribe
    ↓
Generate JWT Token (server-side)
    ↓
Send to AWS Lambda
    ↓
MailerLite: Add Subscriber
    ↓
Save Subscriber ID to Firebase Claims
    ↓
✅ SIGNUP COMPLETE
```

## Related Files

- `/app/signup/page.tsx` - Signup form and initial flow
- `/src/components/auth/EmailActionHandler.tsx` - Email verification processing
- `/app/api/auth/register` - Backend user registration
- `/app/api/marketing/subscribe/route.ts` - Marketing subscription endpoint
- `/src/lib/marketing-api.ts` - MailerLite API integration
- `/src/lib/marketing-types.ts` - TypeScript types for marketing
- `/src/lib/marketing-claims.ts` - Firebase custom claims storage
- `/src/utils/signup-debug.ts` - Debug utility for signup flow

## Testing the Flow

1. **Local Testing**: Set `MARKETING_API_URL` to a mock endpoint for testing
2. **Staging**: Use staging AWS Lambda and MailerLite sandbox account
3. **Production**: Use production endpoints with proper credentials
4. **Manual Testing**: Check MailerLite dashboard for new subscribers after signup
