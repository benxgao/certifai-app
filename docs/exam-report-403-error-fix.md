# Fix for 403 Error on Exam Report Endpoint

## Issue Description

The `GET /api/users/[api_user_id]/exams/[exam_id]/exam-report` endpoint was returning a 403 "Access denied" error due to improper user authorization validation.

## Root Cause

The backend exam report handler (`getExamReport.ts`) was only checking if the exam report's `user_id` matched the requested `user_id` parameter, but it wasn't first verifying that the requesting Firebase user actually owns the `user_id` being requested.

### Authentication Flow Problem

1. Frontend sends request with `api_user_id` in URL path
2. Backend receives request with `user_id` parameter (which is the `api_user_id`)
3. Backend would directly compare Firestore report's `user_id` with URL `user_id` parameter
4. **Missing step**: Backend wasn't verifying that the Firebase JWT token owner actually owns the requested `user_id`

## Solution

### 1. Added Proper User Authorization Check

In both `getExamReport` and `regenerateExamReport` functions, added proper authorization verification:

```typescript
// First, verify that the requesting Firebase user owns the requested user_id
const user = await prismaInstance.user.findUnique({
  where: { user_id: user_id },
  select: {
    user_id: true,
    firebase_user_id: true,
  },
});

if (!user) {
  res.status(404).json({
    success: false,
    error: 'User not found',
  });
  return;
}

// Authorization: Check if the firebase_user_id from token matches the user's firebase_user_id
if (user.firebase_user_id !== firebaseUserIdFromToken) {
  logger.warn(
    `Forbidden: Firebase user ${firebaseUserIdFromToken} attempted to access exam report for user ${user_id}.`,
  );
  res.status(403).json({
    success: false,
    error: 'Forbidden: You can only access your own exam reports.',
  });
  return;
}
```

### 2. Added Missing Import

Added `prismaInstance` import to enable database user lookup:

```typescript
import prismaInstance from '../../../../services/prisma';
```

## Files Modified

- `/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/users/exams/getExamReport.ts`

## Security Improvements

### Before Fix

- ❌ Could potentially access other users' exam reports if report `user_id` matched URL parameter
- ❌ No verification that requesting Firebase user owns the `user_id` in URL

### After Fix

- ✅ Verifies Firebase token ownership of requested `user_id`
- ✅ Double-checks that exam report belongs to the verified user
- ✅ Proper error logging for security audit trail
- ✅ Follows same authorization pattern as other secure endpoints

## Authorization Pattern Applied

This fix implements the same secure authorization pattern used in other endpoints like `getUserProfile.ts`:

1. **Authenticate**: Verify Firebase JWT token is valid
2. **Lookup**: Find user record by `user_id` parameter
3. **Authorize**: Verify token owner's `firebase_user_id` matches user record's `firebase_user_id`
4. **Access**: Only then allow access to the requested resource

## Testing

To test the fix:

1. **Valid Access**: User should be able to access their own exam reports
2. **Invalid Access**: User should get 403 error when trying to access another user's exam reports
3. **Error Messages**: Should receive clear, specific error messages for different scenarios

## Related Security Considerations

- This pattern should be applied to all user-specific endpoints
- Consider implementing rate limiting for repeated unauthorized access attempts
- Monitor security logs for patterns of unauthorized access attempts
- Ensure all user-specific API endpoints follow this authorization pattern
