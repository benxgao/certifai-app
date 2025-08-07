#!/bin/bash

# Firestore Account Creation Implementation Validation Script
# This script checks that all the necessary files are in place and have the expected content

echo "🔍 Validating Firestore Account Creation Implementation..."
echo ""

# Check backend files
echo "📁 Backend Files:"
echo ""

# Check if StripeFirestoreService has createAccount method
if grep -q "createAccount" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/stripe/db.ts"; then
    echo "✅ StripeFirestoreService.createAccount() method found"
else
    echo "❌ StripeFirestoreService.createAccount() method missing"
fi

# Check if login endpoint includes Firestore account logic
if grep -q "StripeFirestoreService.createAccount" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/login.ts"; then
    echo "✅ Login endpoint includes Firestore account creation"
else
    echo "❌ Login endpoint missing Firestore account creation"
fi

# Check if registration endpoint includes Firestore account logic
if grep -q "StripeFirestoreService.createAccount" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/register.ts"; then
    echo "✅ Registration endpoint includes Firestore account creation"
else
    echo "❌ Registration endpoint missing Firestore account creation"
fi

# Check if ensure-account endpoint exists
if [ -f "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/firestore/ensure-account.ts" ]; then
    echo "✅ Ensure-account endpoint exists"
else
    echo "❌ Ensure-account endpoint missing"
fi

# Check if API routes include the new endpoint
if grep -q "firestoreEnsureAccount" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/index.ts"; then
    echo "✅ API routes include ensure-account endpoint"
else
    echo "❌ API routes missing ensure-account endpoint"
fi

echo ""
echo "📁 Frontend Files:"
echo ""

# Check frontend utility file
if [ -f "/Users/xingbingao/workplace/certifai-app/src/lib/firestore-account-utils.ts" ]; then
    echo "✅ Firestore account utilities exist"
else
    echo "❌ Firestore account utilities missing"
fi

# Check frontend API endpoint
if [ -f "/Users/xingbingao/workplace/certifai-app/app/api/firestore/ensure-account/route.ts" ]; then
    echo "✅ Frontend ensure-account API exists"
else
    echo "❌ Frontend ensure-account API missing"
fi

# Check if auth-setup includes Firestore account logic
if grep -q "ensureFirestoreAccount" "/Users/xingbingao/workplace/certifai-app/src/lib/auth-setup.ts"; then
    echo "✅ Auth setup includes Firestore account verification"
else
    echo "❌ Auth setup missing Firestore account verification"
fi

echo ""
echo "📚 Documentation:"
echo ""

# Check if documentation exists
if [ -f "/Users/xingbingao/workplace/certifai-app/docs/firestore-account-creation-implementation.md" ]; then
    echo "✅ Implementation documentation exists"
else
    echo "❌ Implementation documentation missing"
fi

echo ""
echo "🎯 Key Implementation Points:"
echo ""

# Check for logging statements
if grep -q "FIRESTORE_ACCOUNT_CREATED" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/login.ts"; then
    echo "✅ Login endpoint includes logging"
else
    echo "❌ Login endpoint missing logging"
fi

if grep -q "FIRESTORE_ACCOUNT_CREATED" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/register.ts"; then
    echo "✅ Registration endpoint includes logging"
else
    echo "❌ Registration endpoint missing logging"
fi

# Check for error handling
if grep -q "firestoreError" "/Users/xingbingao/workplace/certifai-api/functions/src/endpoints/api/auth/login.ts"; then
    echo "✅ Login endpoint includes error handling"
else
    echo "❌ Login endpoint missing error handling"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Test the implementation with a new user registration"
echo "2. Test with an existing user login"
echo "3. Verify Firestore accounts are created with correct structure"
echo "4. Monitor logs for account creation events"
echo "5. Test the ensure-account endpoint directly if needed"
echo ""
echo "✨ Implementation validation complete!"
