# Marketing API Integration for User Signup

## Overview

This implementation automatically subscribes users to the marketing list (MailerLite) when they sign up for the CertifAI app. The integration is non-blocking, meaning signup will complete successfully even if the marketing subscription fails.

## Architecture

### Flow

1. User completes signup form in `app/signup/page.tsx`
2. Firebase Auth account is created
3. User is registered in the CertifAI backend API
4. **Client-side**: Marketing subscription request is sent to internal API route (`/api/marketing/subscribe`)
5. **Server-side**: API route generates JWT token and calls AWS Lambda
6. **AWS Lambda**: Processes subscription request and communicates with MailerLite
7. Email verification is sent

### Components

- **Frontend**: `app/signup/page.tsx` - Handles the signup flow
- **Client-side API**: `src/lib/marketing-client.ts` - Client-safe marketing subscription calls
- **API Route**: `app/api/marketing/subscribe/route.ts` - Server-side API route that handles JWT generation and AWS Lambda calls
- **Server-side Utility**: `src/lib/marketing-api.ts` - Server-only JWT generation and AWS Lambda communication
- **AWS Lambda**: `certifai-aws/src/handlers/userSubscription.ts` - Processes subscription requests
- **MailerLite**: Third-party email marketing service

## Environment Variables

### Required for Frontend (certifai-app)

```bash
MARKETING_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
MARKETING_API_JWT_SECRET=your-jwt-secret-key
```

### Required for Backend (certifai-aws)

```bash
MAILERLITE_API_KEY=your-mailerlite-api-key
MARKETING_API_JWT_SECRET=your-jwt-secret-key  # Must match frontend
```

## Implementation Details

### JWT Authentication

The marketing API uses JWT tokens for authentication:

- **Algorithm**: HS256
- **Secret**: Shared between frontend and AWS Lambda
- **Expiration**: 1 hour
- **Payload**: Includes subject, scope, and issued at time

### Subscription Data

When a user signs up, the following data is sent to the marketing API:

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fields": {
    "source": "certestic-app-signup",
    "signup_date": "2021-09-01 14:03:50",
    "user_agent": "Mozilla/5.0..."
  },
  "groups": ["new-users", "newsletter"],
  "status": "active"
}
```

### Error Handling

- **Non-blocking**: Marketing subscription failures don't prevent signup completion
- **Timeout**: 10-second timeout prevents hanging requests
- **Logging**: All errors are logged for debugging
- **Graceful Degradation**: Missing environment variables are handled gracefully

## Testing

### 1. Environment Setup

Set the required environment variables in your `.env.local`:

```bash
MARKETING_API_URL=https://your-lambda-url
MARKETING_API_JWT_SECRET=your-secret-key
```

### 2. Test Signup Flow

1. Go to `/signup` in your app
2. Complete the signup form
3. Check browser console for marketing subscription logs
4. Verify user appears in MailerLite dashboard

### 3. Check AWS Lambda Logs

Monitor CloudWatch logs for the marketing Lambda function to see:

- JWT authentication success/failure
- MailerLite API calls
- Subscription results

## Security Considerations

### JWT Secret Management

- Use a strong, randomly generated secret
- Store securely (environment variables, not in code)
- Rotate periodically
- Use different secrets for different environments

### API Protection

- All marketing API endpoints require valid JWT tokens
- Tokens have short expiration times (1 hour)
- Rate limiting is handled by AWS API Gateway
- Input validation prevents malicious data

### Error Information

- Error messages don't expose sensitive information
- Failed requests are logged for debugging
- Graceful degradation prevents information leakage

## Monitoring

### Metrics to Track

1. **Signup Success Rate**: Overall signup completion
2. **Marketing Subscription Rate**: Percentage of successful subscriptions
3. **Error Rates**: Failed JWT generation, API timeouts, MailerLite errors
4. **Response Times**: Marketing API call duration

### CloudWatch Dashboards

Create dashboards to monitor:

- Lambda function invocations
- Error rates and types
- MailerLite API response times
- User subscription patterns

## Troubleshooting

### Common Issues

1. **"MARKETING_API_JWT_SECRET environment variable is not set"**

   - Set the environment variable in both frontend and Lambda
   - Ensure the secret matches exactly

2. **"Marketing API URL not configured"**

   - Set `MARKETING_API_URL` to your AWS API Gateway endpoint
   - Include the full URL with stage (e.g., `/prod`)

3. **"Failed to generate authentication token"**

   - Check JWT secret is properly configured
   - Verify the secret is a valid string

4. **"Marketing subscription failed: 401"**

   - JWT token invalid or expired
   - Secret mismatch between frontend and Lambda
   - Check Lambda environment variables

5. **"Marketing subscription failed: 400"**
   - Invalid request data
   - Check email format and required fields
   - Review MailerLite API documentation

### Debug Steps

1. **Check Environment Variables**

   ```bash
   # In your app directory
   echo $MARKETING_API_URL
   echo $MARKETING_API_JWT_SECRET
   ```

2. **Test JWT Generation**

   - Check browser console for JWT generation logs
   - Verify token format and payload

3. **Monitor Lambda Logs**

   ```bash
   # AWS CLI
   aws logs tail /aws/lambda/your-function-name --follow
   ```

4. **Test API Directly**

   ```bash
   # Generate test JWT using the AWS script
   cd certifai-aws
   MARKETING_API_JWT_SECRET=your-secret node scripts/generate-jwt.js

   # Test subscription endpoint
   curl -X POST $MARKETING_API_URL/subscribe \
     -H "Authorization: Bearer $JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","firstName":"Test","lastName":"User"}'
   ```

## Benefits

1. **Automatic Marketing**: New users are automatically added to marketing campaigns
2. **Non-blocking**: Signup process isn't affected by marketing failures
3. **Secure**: JWT-protected API prevents unauthorized access
4. **Scalable**: AWS Lambda handles variable load automatically
5. **Traceable**: Comprehensive logging for debugging and analytics
6. **Reliable**: Timeout and error handling prevent hanging requests

## Future Enhancements

1. **Retry Logic**: Implement exponential backoff for failed subscriptions
2. **Batch Processing**: Queue subscriptions for batch processing
3. **User Preferences**: Allow users to opt-out during signup
4. **A/B Testing**: Different marketing flows for different user segments
5. **Analytics**: Track conversion rates from marketing campaigns
6. **Webhook Integration**: Real-time sync between MailerLite and app database
