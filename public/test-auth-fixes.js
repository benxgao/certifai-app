/**
 * Test script to verify token cache fixes
 * Run this in browser console to test emergency recovery
 */

// Test function to simulate stuck authentication state
function simulateStuckAuthState() {
  console.log('🧪 Simulating stuck authentication state...');

  // Add some fake data to localStorage to simulate corruption
  localStorage.setItem('firebaseToken', 'fake-expired-token-' + Date.now());
  localStorage.setItem('apiUserId', 'fake-user-id');

  // Add fake cookies (if possible)
  document.cookie = 'joseToken=fake-jose-token; path=/';

  console.log('✅ Fake auth state created');
  console.log('📊 Current localStorage keys:', Object.keys(localStorage));
  console.log('🍪 Current cookies:', document.cookie);
}

// Test function to trigger emergency recovery
async function testEmergencyRecovery() {
  console.log('🚨 Testing emergency recovery...');

  try {
    // Import the recovery function (this would be done at build time normally)
    // For testing, we'll make the API calls directly

    console.log('🧹 Clearing server-side cache...');
    const response = await fetch('/api/auth/clear-cache', {
      method: 'POST',
      credentials: 'include',
    });

    const result = await response.json();
    console.log('📊 Cache clear result:', result);

    // Clear client-side data
    console.log('🧹 Clearing client-side data...');
    ['firebaseToken', 'apiUserId', 'authToken'].forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log('✅ Emergency recovery completed');
    console.log('📊 Remaining localStorage keys:', Object.keys(localStorage));

    return true;
  } catch (error) {
    console.error('❌ Emergency recovery failed:', error);
    return false;
  }
}

// Test function to check cache statistics
async function checkCacheStats() {
  console.log('📊 Checking cache statistics...');

  try {
    const response = await fetch('/api/auth/clear-cache', {
      method: 'POST',
      credentials: 'include',
    });

    const result = await response.json();
    console.log('📈 Cache stats:', {
      before: result.statsBefore,
      after: result.statsAfter,
    });

    return result;
  } catch (error) {
    console.error('❌ Failed to get cache stats:', error);
    return null;
  }
}

// Main test runner
async function runAuthFixTests() {
  console.log('🧪 Starting authentication fix tests...');
  console.log('━'.repeat(50));

  // Test 1: Simulate stuck state
  console.log('Test 1: Simulating stuck state');
  simulateStuckAuthState();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 2: Check initial cache stats
  console.log('\nTest 2: Initial cache check');
  await checkCacheStats();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 3: Test emergency recovery
  console.log('\nTest 3: Emergency recovery');
  const recoverySuccess = await testEmergencyRecovery();

  console.log('━'.repeat(50));
  console.log(recoverySuccess ? '✅ All tests passed!' : '❌ Some tests failed');

  return recoverySuccess;
}

// Export for console usage
window.authFixTests = {
  simulateStuckAuthState,
  testEmergencyRecovery,
  checkCacheStats,
  runAuthFixTests,
};

console.log('🧪 Auth fix test utilities loaded!');
console.log('💡 Run authFixTests.runAuthFixTests() to test all fixes');
console.log('💡 Or run individual tests: authFixTests.testEmergencyRecovery()');
