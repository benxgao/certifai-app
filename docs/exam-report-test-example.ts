/**
 * Example test for the new RESTful exam report endpoints
 * This shows how to test both the frontend and backend routes
 */

// Test data
const TEST_USER_ID = 'test-user-123';
const TEST_EXAM_ID = 'test-exam-456';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Mock Firebase token (replace with actual token in real tests)
const MOCK_FIREBASE_TOKEN = 'mock-firebase-token';

/**
 * Test frontend RESTful route
 */
async function testFrontendExamReport() {
  try {
    // Test GET request
    const getResponse = await fetch(
      `/api/users/${TEST_USER_ID}/exams/${TEST_EXAM_ID}/exam-report`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const getData = await getResponse.json();
    console.log('Frontend GET Response:', getData);

    // Test POST request
    const postResponse = await fetch(
      `/api/users/${TEST_USER_ID}/exams/${TEST_EXAM_ID}/exam-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    const postData = await postResponse.json();
    console.log('Frontend POST Response:', postData);

    return { success: true, getData, postData };
  } catch (error) {
    console.error('Frontend test error:', error);
    return { success: false, error };
  }
}

/**
 * Test backend RESTful route directly
 */
async function testBackendExamReport() {
  try {
    // Test GET request
    const getResponse = await fetch(
      `${API_BASE_URL}/api/users/${TEST_USER_ID}/exams/${TEST_EXAM_ID}/exam-report`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_FIREBASE_TOKEN}`,
        },
      },
    );

    const getData = await getResponse.json();
    console.log('Backend GET Response:', getData);

    // Test POST request
    const postResponse = await fetch(
      `${API_BASE_URL}/api/users/${TEST_USER_ID}/exams/${TEST_EXAM_ID}/exam-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_FIREBASE_TOKEN}`,
        },
        body: JSON.stringify({}),
      },
    );

    const postData = await postResponse.json();
    console.log('Backend POST Response:', postData);

    return { success: true, getData, postData };
  } catch (error) {
    console.error('Backend test error:', error);
    return { success: false, error };
  }
}

/**
 * Compare old vs new endpoint behavior
 */
async function compareOldVsNewEndpoint() {
  try {
    // Test old endpoint
    const oldResponse = await fetch('/api/ai/exam-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exam_id: TEST_EXAM_ID,
      }),
    });

    const oldData = await oldResponse.json();
    console.log('Old endpoint response:', oldData);

    // Test new endpoint
    const newResponse = await fetch(
      `/api/users/${TEST_USER_ID}/exams/${TEST_EXAM_ID}/exam-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    const newData = await newResponse.json();
    console.log('New endpoint response:', newData);

    return { success: true, oldData, newData };
  } catch (error) {
    console.error('Comparison test error:', error);
    return { success: false, error };
  }
}

// Export test functions for use in actual test files
export { testFrontendExamReport, testBackendExamReport, compareOldVsNewEndpoint };
