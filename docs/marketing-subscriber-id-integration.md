# Marketing Subscriber ID Integration with Firebase Auth

## Overview

This feature automatically saves the MailerLite `subscriberId` to Firebase Auth custom claims after successful marketing subscription requests. This enables easy retrieval of the subscriber ID for future API calls and user management.

## Implementation Details

### Firebase Auth Custom Claims

The `subscriberId` is stored in Firebase Auth custom claims as `subscriber_id`. This is in addition to existing claims:

```typescript
{
  api_user_id: string,      // Internal API user ID
  init_cert_id?: number,    // Initial certification ID
  subscriber_id?: string    // MailerLite subscriber ID (NEW)
}
```

### When Subscriber ID is Saved

The `subscriberId` is automatically saved in the following scenarios:

1. **Email Verification Flow** (`EmailActionHandler.tsx`)

   - When users verify their email after signup
   - Triggers marketing subscription and saves the returned `subscriberId`

2. **Adaptive Learning Interest** (`AdaptiveLearningInterestModal.tsx`)
   - When authenticated users express interest in adaptive learning features
   - Saves the `subscriberId` for future targeted communications

### API Endpoints

#### Set Claims Endpoint: `/api/auth/set-claims`

Updated to handle the new `subscriber_id` parameter:

```typescript
POST / api / auth / set - claims;
Authorization: Bearer <
  firebase - id - token >
  {
    api_user_id: 'required-uuid',
    init_cert_id: 123, // optional
    subscriber_id: 'ml-123', // optional - NEW
  };
```

### Utility Functions

#### Client-Side

```typescript
import { getSubscriberIdFromClaims, saveSubscriberIdToClaims } from '@/src/lib/auth-claims';
import { saveSubscriberIdToClaims } from '@/src/lib/marketing-claims';

// Get subscriber ID from current user's claims
const subscriberId = await getSubscriberIdFromClaims();

// Save subscriber ID to current user's claims (reusable utility)
await saveSubscriberIdToClaims(subscriberId, firebaseUser);
```

#### Server-Side

```typescript
import { getSubscriberIdFromToken } from '@/src/lib/auth-claims';

// Get subscriber ID from Firebase token
const subscriberId = await getSubscriberIdFromToken(firebaseToken);
```

## Security Considerations

- **Authentication Required**: Only authenticated users can have `subscriber_id` saved
- **Non-Blocking**: Failures to save `subscriber_id` don't affect the main marketing subscription flow
- **Claim Preservation**: Existing custom claims (`api_user_id`, `init_cert_id`) are preserved when updating
- **Token Verification**: All claims operations require valid Firebase ID token

## Usage Examples

### Retrieving Subscriber ID in API Routes

```typescript
import { getSubscriberIdFromToken } from '@/src/lib/auth-claims';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.substring(7); // Remove 'Bearer '

  const subscriberId = await getSubscriberIdFromToken(token);

  if (subscriberId) {
    // User has a MailerLite subscription
    // Can be used for unsubscribe, group management, etc.
  }
}
```

### Checking Subscription Status Client-Side

```typescript
import { getSubscriberIdFromClaims } from '@/src/lib/auth-claims';

const checkSubscriptionStatus = async () => {
  const subscriberId = await getSubscriberIdFromClaims();

  if (subscriberId) {
    // User is subscribed to marketing
    console.log('User subscriber ID:', subscriberId);
  } else {
    // User is not subscribed or claims need refresh
  }
};
```

## Benefits

1. **Seamless Integration**: Automatically links Firebase users with MailerLite subscribers
2. **Easy Unsubscribe**: Enables building unsubscribe flows using the stored `subscriber_id`
3. **Targeted Marketing**: Allows for personalized marketing campaigns based on subscription status
4. **User Management**: Simplifies user account management across Firebase and MailerLite
5. **Performance**: Avoids need to lookup subscribers by email for common operations

## Error Handling

- All `subscriber_id` operations are non-blocking
- Failures are logged but don't affect core user flows
- Claims operations include timeout protection (10 seconds)
- Graceful degradation when claims can't be updated

## Future Enhancements

- Add batch update functionality for existing users
- Implement automatic cleanup when users unsubscribe
- Add claims validation middleware
- Support for multiple subscriber IDs (different groups/lists)
