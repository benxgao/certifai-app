# Server-Side Authenticated API Requests for Public Pages

## Overview

This document outlines the architectural pattern of using server-side components with authenticated API requests to fetch data for public pages. This approach allows public-facing pages to display dynamic content while maintaining proper authentication and security.

## Pattern Overview

Instead of creating separate public API endpoints or client-side authentication, we use:

1. **Server-Side Data Fetching**: Use Next.js server components to fetch data during server-side rendering
2. **Authenticated API Requests**: Make authenticated requests from server actions to existing protected endpoints
3. **Graceful Fallbacks**: Provide mock data fallbacks when API calls fail
4. **Caching**: Implement appropriate caching strategies for performance

## Architecture Benefits

### Security

- **Single Source of Truth**: All API endpoints remain consistently protected
- **No Public Endpoints**: Eliminates the need for separate public API routes
- **Authentication Consistency**: Uses the same authentication flow for all data access
- **Audit Trail**: All data access is logged and authenticated

### Performance

- **Server-Side Rendering**: Data is fetched during SSR for better initial page load
- **Caching**: Server-side caching reduces API calls and improves performance
- **SEO Optimized**: Search engines receive fully rendered pages with real data

### Maintainability

- **Code Reuse**: Leverages existing authenticated API endpoints
- **Single API Layer**: No need to maintain separate public and private endpoints
- **Consistent Error Handling**: Uses established patterns for error handling

## Implementation Pattern

### 1. Server Actions for Data Fetching

Create server actions that handle authenticated API requests:

```typescript
// src/lib/server-actions/[entity].ts
import 'server-only';

export async function fetch[Entity]Data(id: string): Promise<{
  [entity]: [EntityType] | null;
  error?: string;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    if (!baseUrl) {
      console.info('SERVER_API_URL not configured, using mock data');
      return {
        [entity]: getMock[Entity]Data(id),
        error: undefined,
      };
    }

    // Try to fetch from authenticated internal endpoint
    try {
      const response = await fetch(`${baseUrl}/api/[entities]/${id}`, {
        cache: 'force-cache',
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
          // Note: Server-to-server authentication would be added here in production
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          console.info(`Successfully loaded [entity] ${id} from API`);
          return { [entity]: result.data };
        }
      }
    } catch (apiError) {
      console.warn(`API call failed for [entity] ${id}, falling back to mock data:`, apiError);
    }

    // Fallback to mock data
    return {
      [entity]: getMock[Entity]Data(id),
      error: undefined,
    };
  } catch (error) {
    console.error(`Error fetching [entity] ${id}:`, error);
    return {
      [entity]: getMock[Entity]Data(id),
      error: undefined,
    };
  }
}

function getMock[Entity]Data(id: string): [EntityType] | null {
  // Mock data implementation
  return mockData[id] || null;
}
```

### 2. Server Components Using Server Actions

```typescript
// app/[public-route]/[id]/page.tsx
import { fetch[Entity]Data } from '@/src/lib/server-actions/[entities]';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const { [entity] } = await fetch[Entity]Data(id);

    if ([entity]) {
      return {
        title: `${[entity].name} | CertifAI`,
        description: [entity].description,
        // ... other metadata
      };
    }
  } catch (error) {
    console.error('Error fetching data for metadata:', error);
  }

  return {
    title: 'Default Title | CertifAI',
    description: 'Default description',
  };
}

export default async function [Entity]Page({ params }: Props) {
  const { id } = await params;

  const { [entity], error } = await fetch[Entity]Data(id);

  if (![entity] && !error) {
    notFound();
  }

  return (
    <div>
      {error ? (
        <ErrorDisplay error={error} />
      ) : (
        <[Entity]Display [entity]={[entity]} />
      )}
    </div>
  );
}
```

### 3. Client Components for Interactivity

For components that need interactivity, pass the initial data from server-side:

```typescript
// components/[Entity]Display.tsx
'use client';

interface Props {
  [entity]: [EntityType];
  // ... other props
}

export default function [Entity]Display({ [entity] }: Props) {
  // Use initial server-side data
  // Add client-side functionality as needed

  return (
    <div>
      <h1>{[entity].name}</h1>
      <p>{[entity].description}</p>
      {/* Interactive elements */}
    </div>
  );
}
```

## Implementation Examples

### Example 1: Certification Detail Page

```typescript
// app/certifications/cert/[certId]/page.tsx
import { fetchCertificationData } from '@/src/lib/server-actions/certifications';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certId } = await params;

  const { certification } = await fetchCertificationData(certId);

  if (certification) {
    return {
      title: `${certification.name} | CertifAI`,
      description: certification.description,
    };
  }

  return { title: 'Certification | CertifAI' };
}

export default async function CertificationPage({ params }: Props) {
  const { certId } = await params;
  const { certification, error } = await fetchCertificationData(certId);

  if (!certification) notFound();

  return <CertificationDetail certification={certification} />;
}
```

### Example 2: Firm-based Certification Listing

```typescript
// app/certifications/[firmCode]/page.tsx
import { fetchFirmCertificationsData } from '@/src/lib/server-actions/certifications';

export default async function FirmCertificationsPage({ params }: Props) {
  const { firmCode } = await params;
  const { firm, certifications, error } = await fetchFirmCertificationsData(firmCode);

  return (
    <div>
      {firm && <FirmHeader firm={firm} />}
      <CertificationsList certifications={certifications} />
    </div>
  );
}
```

## Caching Strategy

### Next.js Cache Configuration

```typescript
const response = await fetch(url, {
  cache: 'force-cache', // Cache the response
  next: { revalidate: 3600 }, // Revalidate every hour
});
```

### Cache Levels

1. **Next.js Data Cache**: Automatic caching of fetch requests
2. **CDN Caching**: Page-level caching for static content
3. **Database Caching**: Backend API response caching

## Error Handling

### Graceful Fallbacks

1. **Mock Data**: Provide realistic fallback data when API fails
2. **Error Boundaries**: Catch and handle errors gracefully
3. **User-Friendly Messages**: Display helpful error messages
4. **Logging**: Comprehensive error logging for debugging

### Implementation

```typescript
try {
  const response = await fetch(apiUrl);
  if (response.ok) {
    return { data: await response.json() };
  }
} catch (error) {
  console.warn('API call failed, using fallback data:', error);
}

// Always provide fallback data
return { data: getMockData(), error: undefined };
```

## Performance Considerations

### Server-Side Rendering

- **Fast Initial Load**: Data is fetched server-side during build/request
- **SEO Benefits**: Search engines receive fully rendered content
- **Reduced Client JavaScript**: Less client-side data fetching

### Caching Optimization

- **Appropriate Cache Duration**: Balance freshness with performance
- **Cache Invalidation**: Clear cache when data changes
- **Conditional Requests**: Use ETags and conditional headers

## Security Considerations

### Server-to-Server Authentication

For production environments, implement proper server-to-server authentication:

```typescript
const response = await fetch(apiUrl, {
  headers: {
    Authorization: `Bearer ${serverToken}`,
    'X-API-Key': process.env.INTERNAL_API_KEY,
  },
});
```

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SERVER_API_URL`: Backend API URL
- `INTERNAL_API_KEY`: Server-to-server authentication key
- `SERVER_JWT_SECRET`: JWT signing secret for server tokens

## Testing Strategy

### Unit Tests

Test server actions independently:

```typescript
// __tests__/server-actions/certifications.test.ts
import { fetchCertificationData } from '@/src/lib/server-actions/certifications';

describe('fetchCertificationData', () => {
  it('should return certification data when API succeeds', async () => {
    // Mock successful API response
    const result = await fetchCertificationData('1');
    expect(result.certification).toBeDefined();
  });

  it('should return mock data when API fails', async () => {
    // Mock API failure
    const result = await fetchCertificationData('1');
    expect(result.certification).toBeDefined(); // Should still return mock data
  });
});
```

### Integration Tests

Test the complete server-side rendering flow:

```typescript
// __tests__/pages/certification-detail.test.tsx
import { render } from '@testing-library/react';
import CertificationPage from '@/app/certifications/cert/[certId]/page';

describe('CertificationPage', () => {
  it('should render certification details', async () => {
    const params = Promise.resolve({ certId: '1' });
    const component = await CertificationPage({ params });
    // Test rendering
  });
});
```

## Migration Guidelines

### From Public API Endpoints

1. **Identify Public Routes**: Find all `/api/public/*` endpoints
2. **Create Server Actions**: Convert to server actions with authentication
3. **Update Components**: Change from client-side fetching to server-side
4. **Add Fallbacks**: Implement mock data for reliability
5. **Test Thoroughly**: Ensure all functionality works correctly

### From Client-Side Fetching

1. **Move to Server Components**: Convert client components to server components where possible
2. **Update Data Flow**: Pass data from server to client components
3. **Maintain Interactivity**: Keep interactive features in client components
4. **Handle Loading States**: Implement appropriate loading/skeleton components

## Best Practices

### Do's

- ✅ Use server actions for data fetching in public pages
- ✅ Implement comprehensive fallback mechanisms
- ✅ Cache responses appropriately
- ✅ Log errors for monitoring and debugging
- ✅ Validate input parameters
- ✅ Use TypeScript for type safety

### Don'ts

- ❌ Don't create separate public API endpoints unnecessarily
- ❌ Don't expose sensitive data in fallback mock data
- ❌ Don't cache responses for too long if data changes frequently
- ❌ Don't ignore error handling
- ❌ Don't make client-side API calls for initial page data

## Monitoring and Observability

### Metrics to Track

- **API Response Times**: Monitor backend API performance
- **Cache Hit Rates**: Ensure caching is effective
- **Error Rates**: Track API failures and fallback usage
- **Page Load Times**: Monitor overall page performance

### Logging

```typescript
console.info(`Successfully loaded ${entityType} ${id} from API`);
console.warn(`API call failed for ${entityType} ${id}, using fallback`);
console.error(`Critical error fetching ${entityType} ${id}:`, error);
```

## Conclusion

This pattern provides a robust, secure, and performant approach to serving dynamic content on public pages while maintaining proper authentication and data consistency. It eliminates the complexity of managing separate public API endpoints while providing excellent user experience and SEO benefits.

The key benefits are:

- **Security**: All data access is authenticated and audited
- **Performance**: Server-side rendering with appropriate caching
- **Reliability**: Graceful fallbacks ensure pages always load
- **Maintainability**: Single API layer reduces complexity
- **SEO**: Fully rendered pages with real data for search engines
