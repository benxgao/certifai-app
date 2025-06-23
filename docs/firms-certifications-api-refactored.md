# Firms and Certifications API Endpoints - Refactored

This document describes the refactored and improved API endpoints for firms and certifications in the certifai-app.

## Overview

The API endpoints have been refactored to provide:

- **Consistent error handling** across all endpoints
- **Input validation** for all parameters
- **Standardized response formats**
- **Proper authentication management**
- **Query parameter support** for filtering and pagination
- **Shared utilities** for reduced code duplication

## Common Features

### Authentication

All endpoints require Firebase authentication via JWT token stored in HTTP-only cookies.

### Error Handling

Standardized error responses with consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Detailed error information"
}
```

### Success Responses

Consistent success response format matching the backend API structure.

## Firms Endpoints

### 1. Get All Firms

**Endpoint:** `GET /api/firms`
**Query Parameters:**

- `page` (optional): Page number for pagination
- `pageSize` (optional): Number of items per page
- `includeCount` (optional): Include certification counts

**Features:**

- Supports all backend query parameters
- Proper authentication validation
- Standardized error handling

### 2. Create Firm

**Endpoint:** `POST /api/firms`
**Request Body:**

```json
{
  "name": "Firm Name",
  "code": "FIRM_CODE",
  "description": "Optional description",
  "website_url": "https://example.com",
  "logo_url": "https://example.com/logo.png"
}
```

### 3. Get Firm by ID

**Endpoint:** `GET /api/firms/[firmId]`
**Path Parameters:**

- `firmId`: Firm ID (validated as positive integer)

**Query Parameters:**

- `includeCertifications` (optional): Include firm's certifications

**Features:**

- ID validation (must be positive integer)
- Query parameter passthrough to backend

### 4. Update Firm

**Endpoint:** `PUT /api/firms/[firmId]`
**Path Parameters:**

- `firmId`: Firm ID (validated as positive integer)

### 5. Delete Firm

**Endpoint:** `DELETE /api/firms/[firmId]`
**Path Parameters:**

- `firmId`: Firm ID (validated as positive integer)

### 6. Search Firms

**Endpoint:** `GET /api/firms/search`
**Query Parameters:**

- `q` (required): Search query
- `page` (optional): Page number
- `pageSize` (optional): Items per page

## Certifications Endpoints

### 1. Get All Certifications

**Endpoint:** `GET /api/certifications`
**Query Parameters:**

- `page` (optional): Page number for pagination
- `pageSize` (optional): Number of items per page
- `firmId` (optional): Filter by firm ID

**Features:**

- Enhanced with query parameter support
- Supports filtering and pagination

### 2. Create Certification

**Endpoint:** `POST /api/certifications`
**Request Body:**

```json
{
  "firm_id": 1,
  "name": "Certification Name",
  "exam_guide_url": "https://example.com/guide",
  "min_quiz_counts": 10,
  "max_quiz_counts": 50,
  "pass_score": 75.0
}
```

### 3. Get Certification by ID

**Endpoint:** `GET /api/certifications/[certificationId]` _(NEW)_
**Path Parameters:**

- `certificationId`: Certification ID (validated as positive integer)

**Features:**

- Individual certification retrieval
- ID validation
- Query parameter support

### 4. Update Certification

**Endpoint:** `PUT /api/certifications/[certificationId]` _(NEW)_
**Path Parameters:**

- `certificationId`: Certification ID (validated as positive integer)

### 5. Delete Certification

**Endpoint:** `DELETE /api/certifications/[certificationId]` _(NEW)_
**Path Parameters:**

- `certificationId`: Certification ID (validated as positive integer)

### 6. Get Certifications by Firm

**Endpoint:** `GET /api/certifications/firms/[firmId]`
**Path Parameters:**

- `firmId`: Firm ID (validated as positive integer)

**Query Parameters:**

- `page` (optional): Page number
- `pageSize` (optional): Items per page

### 7. Register for Certification

**Endpoint:** `POST /api/certifications/register`
**Request Body:**

```json
{
  "certificationId": 123
}
```

**Features:**

- Enhanced validation for required parameters
- Improved error handling

## Shared Utilities

### API Utils (`src/lib/api-utils.ts`)

#### Key Functions:

- `getAuthenticatedToken()`: Get and validate Firebase token
- `validateId(id, paramName)`: Validate ID parameters
- `validateRequiredParams(params, required)`: Validate required parameters
- `makeAuthenticatedRequest()`: Make authenticated requests to backend
- `handleApiResponse()`: Handle backend responses consistently
- `createErrorResponse()`: Create standardized error responses
- `buildApiUrl()`: Build URLs with query parameters

#### Error Classes:

- `ApiError`: Custom error class with status codes

## Improvements Made

### 1. Input Validation

- All ID parameters validated as positive integers
- Required parameters validated before API calls
- Descriptive error messages for validation failures

### 2. Consistent Error Handling

- Standardized error response format
- Proper HTTP status codes
- Detailed error logging

### 3. Query Parameter Support

- All endpoints support query parameter passthrough
- Enables pagination, filtering, and other backend features

### 4. Code Reusability

- Shared utilities reduce code duplication
- Consistent patterns across all endpoints
- Easier maintenance and updates

### 5. Authentication Management

- Centralized token validation
- Consistent authentication error handling
- Proper token caching for performance

### 6. Type Safety

- TypeScript interfaces for responses
- Proper error typing
- Better development experience

## Migration Notes

### Breaking Changes

- Response format now includes `success` field for consistency
- Error responses have standardized structure
- Some endpoints now require proper ID validation

### New Features

- Individual certification CRUD operations
- Enhanced query parameter support
- Better error messages and validation

### Performance Improvements

- Reduced code duplication
- Optimized request handling
- Better error boundary management

## Testing

### Validation Testing

- Test invalid ID parameters (non-numeric, negative, zero)
- Test missing required parameters
- Test malformed request bodies

### Authentication Testing

- Test requests without authentication
- Test with expired tokens
- Test with invalid tokens

### Integration Testing

- Test query parameter passthrough
- Test error propagation from backend
- Test response format consistency

## Future Enhancements

1. **Request Rate Limiting**: Add rate limiting for API endpoints
2. **Response Caching**: Cache frequently accessed data
3. **Request Logging**: Enhanced logging for debugging
4. **API Versioning**: Support for multiple API versions
5. **OpenAPI Documentation**: Generate automatic API documentation
