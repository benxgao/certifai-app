import { fetchCertificationData } from '@/src/lib/server-actions/certifications';

export default async function TestCertificationPage() {
  const { certification, error } = await fetchCertificationData('7');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Server-Side Certification Data Test</h1>

      {error ? (
        <div className="text-red-600">
          <p>Error: {error}</p>
          <p className="text-sm text-gray-500">This is expected if the API is not accessible</p>
        </div>
      ) : certification ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{certification.name}</h2>
          <p className="text-gray-600 mb-4">{certification.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Min Quiz Count:</span> {certification.min_quiz_counts}
            </div>
            <div>
              <span className="font-medium">Max Quiz Count:</span> {certification.max_quiz_counts}
            </div>
            <div>
              <span className="font-medium">Pass Score:</span> {certification.pass_score}%
            </div>
            <div>
              <span className="font-medium">Firm ID:</span> {certification.firm_id}
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Data loaded via server-side authenticated API request with graceful fallback to mock
            data
          </div>
        </div>
      ) : (
        <div className="text-gray-600">No certification data found</div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How This Works:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>1. Server-side component fetches data using authenticated API request</li>
          <li>2. If API fails, gracefully falls back to mock data</li>
          <li>3. Data is rendered server-side for better SEO and performance</li>
          <li>4. No client-side authentication required</li>
          <li>
            5. Direct API endpoint access still requires authentication (401 error is correct)
          </li>
        </ul>
      </div>
    </div>
  );
}
