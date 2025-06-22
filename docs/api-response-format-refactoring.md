# API Response Format Refactoring

## Overview

This document outlines the refactoring of API requests in certifai-app to handle the new response format `{data, meta}` from certifai-api. The backend API now returns consistent paginated responses with proper metadata.

## New Response Format

The certifai-api now returns responses in a standardized format:

### Standard Response (Non-paginated)

```typescript
{
  success: boolean;
  data: T;
}
```

### Paginated Response

```typescript
{
  success: boolean;
  data: T;
  meta: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
}
```

## Changes Made

### 1. Created Standardized Types (`src/types/api.ts`)

- `ApiResponse<T>` - For non-paginated responses
- `PaginatedApiResponse<T>` - For paginated responses with meta field
- `PaginationMeta` - Pagination metadata interface
- Type guards for response validation

### 2. Updated SWR Hooks

#### `src/swr/certifications.ts`

- Updated `useAllAvailableCertifications()` to expect `PaginatedApiResponse<CertificationListItem[]>`
- Updated `useUserRegisteredCertifications()` to expect `PaginatedApiResponse<UserRegisteredCertification[]>`
- Both hooks now return `pagination: data?.meta` for pagination metadata

#### `src/swr/exams.ts`

- Updated `useExamsForCertification()` to expect `PaginatedApiResponse<ExamListItem[]>`
- Updated `useExamState()` to expect `ApiResponse<ExamState>`
- Added pagination support for exam listings

#### `src/swr/questions.ts`

- Updated `ExamQuestionsResponse` interface to use `meta` instead of `pagination`
- Updated `useExamQuestions()` to return `pagination: data?.meta`
- Maintains backward compatibility for question pagination

#### `src/swr/profile.ts`

- Updated to use standardized `UserProfileResponse` type
- Profile data extraction remains compatible with existing usage

### 3. Updated Component Usage

#### `app/main/page.tsx`

- Updated to handle the new response format for certifications list
- Changed from expecting `AvailableCertification[]` to `{data: AvailableCertification[], meta?: any}`
- Added data extraction: `availableCertifications = certificationsResponse?.data`

#### `app/main/certifications/[cert_id]/exams/[exam_id]/page.tsx`

- Already compatible with the new format
- Uses `pagination?.currentPage` and `pagination?.totalPages` correctly
- Navigation controls work with the new pagination metadata

### 4. Backward Compatibility

- Maintained `PaginationInfo` interface in `src/swr/utils.ts` for legacy support
- Added type exports for smooth migration
- Existing components continue to work without breaking changes

## Benefits

1. **Consistency**: All API responses now follow the same format
2. **Better Pagination**: Rich metadata including `hasNextPage`, `hasPreviousPage`
3. **Type Safety**: Proper TypeScript types for all response formats
4. **Maintainability**: Centralized response type definitions
5. **Extensibility**: Easy to add new response metadata fields

## Migration Guide

For any new components or hooks:

1. Use `useAuthSWR<PaginatedApiResponse<T>>` for paginated endpoints
2. Use `useAuthSWR<ApiResponse<T>>` for single-item endpoints
3. Access data via `response?.data`
4. Access pagination via `response?.meta`

### Example Usage

```typescript
// Paginated data
const { data, error, isLoading } = useAuthSWR<PaginatedApiResponse<Item[]>>('/api/items');
const items = data?.data;
const pagination = data?.meta;

// Single item
const { data, error, isLoading } = useAuthSWR<ApiResponse<Item>>('/api/items/1');
const item = data?.data;
```

## Testing

All existing functionality should continue to work without changes:

- Exam question navigation and pagination
- Certification listing and registration
- Profile data loading
- Form submissions and mutations

The refactoring maintains full backward compatibility while enabling the new response format.
