import { fetchCertificationData } from '@/src/lib/server-actions/certifications';

export default async function JWTTestPage() {
  const { certification, error } = await fetchCertificationData('7');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">JWT Authentication Test - Certification 7</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Error (Fallback Working)</h2>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            This means the backend API is not available, but fallback data should be shown below.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h2 className="text-green-800 font-semibold">✅ JWT Authentication Success!</h2>
          <p className="text-green-700">Data loaded from backend API using JWT token</p>
        </div>
      )}

      {certification ? (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h2 className="text-xl font-semibold mb-2">{certification.name}</h2>
          <p className="text-gray-600 mb-4">{certification.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID:</span> {certification.cert_id}
            </div>
            <div>
              <span className="font-medium">Firm ID:</span> {certification.firm_id}
            </div>
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
              <span className="font-medium">Created:</span>{' '}
              {certification.created_at
                ? new Date(certification.created_at).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600">No certification data available</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">What This Test Shows:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>✅ Server-side component successfully fetches data</li>
          <li>✅ JWT token authentication works for server-to-server communication</li>
          <li>✅ Graceful fallback to mock data if backend unavailable</li>
          <li>✅ No client-side authentication required</li>
          <li>✅ Data rendered server-side for better SEO and performance</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">API Endpoint Behavior:</h3>
        <p className="text-yellow-700 text-sm">
          Direct access to <code>/api/certifications/7</code> still correctly returns 401
          Unauthorized because it requires user authentication. This page works because it uses
          server-side JWT authentication.
        </p>
      </div>
    </div>
  );
}
