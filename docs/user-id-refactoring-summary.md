# User ID Refactoring Summary

## Overview

Refactored API endpoints and type definitions to use explicit naming conventions for different types of user IDs instead of the ambiguous `user_id` field.

## Changes Made

### Backend API Responses (certifai-api)

#### 1. User Profile Endpoint

- **File**: `/functions/src/endpoints/api/users/getUserProfile.ts`
- **Change**: Response now returns `api_user_id` as primary field, with `user_id` as deprecated fallback
- **Impact**: Frontend will now receive explicit `api_user_id` field

#### 2. User Exams Endpoints

- **File**: `/functions/src/endpoints/api/users/exams/getUserExams.ts`
- **Change**: Each exam object now returns `api_user_id` as primary field
- **Impact**: Exam list responses use explicit naming

- **File**: `/functions/src/endpoints/api/users/exams/getUserExam.ts`
- **Change**: Individual exam responses now return `api_user_id` as primary field
- **Impact**: Single exam responses use explicit naming

- **File**: `/functions/src/endpoints/api/users/exams/createExam.ts`
- **Change**: Exam creation response now returns `api_user_id` as primary field
- **Impact**: New exam creation uses explicit naming

- **File**: `/functions/src/endpoints/api/users/exams/deleteExam.ts`
- **Change**: Exam deletion response now returns `api_user_id` as primary field
- **Impact**: Exam deletion confirmations use explicit naming

#### 3. AI Services

- **File**: `/functions/src/endpoints/api/ai/examReportGenerator.ts`
- **Change**: Internal AI service calls now use `api_user_id` as primary field
- **Impact**: Consistent naming in AI processing pipelines

### Frontend Type Definitions (certifai-app)

#### 1. User Profile Types

- **File**: `/src/swr/profile.ts`
- **Change**: `UserProfile` interface now uses `api_user_id` as primary field
- **Impact**: Profile components will receive explicit field names

#### 2. Exam Types

- **File**: `/src/swr/exams.ts`
- **Change**: `ExamListItem` interface now uses `api_user_id` as primary field
- **Impact**: Exam list components use explicit naming

- **File**: `/src/swr/examInfo.ts`
- **Change**: `ExamInfoData` interface now uses `api_user_id` as primary field
- **Impact**: Exam detail components use explicit naming

- **File**: `/src/swr/createExam.ts`
- **Change**: `CreateExamResponse` interface now uses `api_user_id` as primary field
- **Impact**: Exam creation flows use explicit naming

#### 3. Certification Types

- **File**: `/src/swr/certifications.ts`
- **Change**: `UserRegisteredCertification` interface now uses `api_user_id` as primary field
- **Impact**: Certification components use explicit naming

## Naming Convention

### Clear Distinctions

- **`api_user_id`**: Our internal UUID for API operations (36 characters with hyphens)
- **`firebase_user_id`**: Firebase UID for authentication (28 characters, alphanumeric)
- **`user_id`**: @deprecated - Use `api_user_id` instead

### Backward Compatibility

All changes include deprecated `user_id` fields to maintain backward compatibility during transition period.

## Testing Requirements

### Backend Testing

1. Verify all API responses include both `api_user_id` and deprecated `user_id` fields
2. Confirm values are identical for compatibility
3. Test AI service integrations use correct field names

### Frontend Testing

1. Update any hardcoded `user_id` references to use `api_user_id`
2. Verify type checking passes with new interfaces
3. Test that existing components still work with backward compatibility

## Migration Path

### Phase 1: Add New Fields (✅ COMPLETED)

- Add `api_user_id` fields to all API responses
- Add `api_user_id` to all TypeScript interfaces
- Maintain `user_id` as deprecated fallback

### Phase 2: Update Component Usage (PENDING)

- Search for components using `user_id` field
- Update to use `api_user_id` instead
- Remove reliance on deprecated field

### Phase 3: Remove Deprecated Fields (FUTURE)

- Remove `user_id` fields from API responses
- Remove `user_id` from TypeScript interfaces
- Clean up documentation

## Benefits

1. **Clarity**: No confusion between Firebase UIDs and API User IDs
2. **Type Safety**: TypeScript will catch incorrect usage
3. **Maintainability**: Easier to track different ID types across codebase
4. **Debugging**: Clear distinction helps with troubleshooting authentication vs API issues

## Files Modified

### Backend (certifai-api)

- `functions/src/endpoints/api/users/getUserProfile.ts`
- `functions/src/endpoints/api/users/exams/getUserExams.ts`
- `functions/src/endpoints/api/users/exams/getUserExam.ts`
- `functions/src/endpoints/api/users/exams/createExam.ts`
- `functions/src/endpoints/api/users/exams/deleteExam.ts`
- `functions/src/endpoints/api/ai/examReportGenerator.ts`

### Frontend (certifai-app)

- `src/swr/profile.ts`
- `src/swr/exams.ts`
- `src/swr/examInfo.ts`
- `src/swr/certifications.ts`
- `src/swr/createExam.ts`

## Next Steps

1. **Component Review**: Search frontend components for `user_id` usage and update to `api_user_id`
2. **Testing**: Run comprehensive tests to ensure backward compatibility
3. **Documentation**: Update API documentation to reflect new field names
4. **Monitoring**: Monitor logs for any issues during transition period
