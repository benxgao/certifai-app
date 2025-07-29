# Exam Report API Usage

## New RESTful API Endpoints

The exam report functionality has been restructured to follow RESTful conventions:

### Frontend (certifai-app)

```
GET  /api/users/[api_user_id]/exams/[exam_id]/exam-report
POST /api/users/[api_user_id]/exams/[exam_id]/exam-report
```

### Backend (certifai-api)

```
GET  /api/users/:user_id/exams/:exam_id/exam-report
POST /api/users/:user_id/exams/:exam_id/exam-report
```

## Usage Examples

### Frontend Usage

```typescript
// Get exam report
const response = await fetch(`/api/users/${apiUserId}/exams/${examId}/exam-report`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Regenerate exam report
const response = await fetch(`/api/users/${apiUserId}/exams/${examId}/exam-report`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Optional: any parameters for regeneration
  }),
});
```

### Direct Backend Usage

```typescript
// Get exam report
const response = await fetch(`${API_BASE_URL}/api/users/${userId}/exams/${examId}/exam-report`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${firebaseToken}`,
  },
});

// Regenerate exam report
const response = await fetch(`${API_BASE_URL}/api/users/${userId}/exams/${examId}/exam-report`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${firebaseToken}`,
  },
  body: JSON.stringify({
    // Optional: any parameters for regeneration
  }),
});
```

## Migration Notes

- The old `/api/ai/exam-report` endpoint is now deprecated but still functional for backward compatibility
- Authentication is handled automatically via cookies in the frontend routes
- The new RESTful structure better represents the resource hierarchy: users → exams → exam-report
- Both GET and POST methods are supported for fetching existing reports and regenerating reports respectively

## Response Format

Both endpoints return the same response format:

```json
{
  "success": true,
  "data": {
    "exam_id": "exam_abc123",
    "report": "Generated exam report content...",
    "already_existed": false,
    "generated_at": "2025-01-01T00:00:00.000Z",
    "performance_summary": {
      "overall_score": 75,
      "total_questions": 20,
      "correct_answers": 15,
      "topics_analyzed": 5,
      "topic_breakdown": [
        {
          "topic": "IAM and Security",
          "accuracy": 100,
          "questions": 5
        }
      ]
    }
  }
}
```
