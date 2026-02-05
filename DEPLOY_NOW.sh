#!/bin/bash

echo "🚀 DepositGuard - One-Command Deploy"
echo "====================================="
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the depositguard directory"
    exit 1
fi

echo "Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "Step 2: Deploying to Vercel..."
echo ""
echo "You'll be asked a few questions:"
echo "  - Set up and deploy? → YES (press Enter)"
echo "  - Which scope? → Choose your account (press Enter)"
echo "  - Link to existing project? → NO (type 'n' and Enter)"
echo "  - Project name? → depositguard (press Enter)"
echo "  - Directory? → ./ (press Enter)"
echo "  - Override settings? → NO (type 'n' and Enter)"
echo ""
read -p "Press Enter when ready to deploy..."

npx vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "Next steps:"
    echo "1. Open the URL shown above in your browser"
    echo "2. Get your Stripe keys from https://dashboard.stripe.com/test/apikeys"
    echo "3. Run: npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "4. Run: npx vercel env add STRIPE_SECRET_KEY"
    echo "5. Run: npx vercel env add NEXT_PUBLIC_APP_URL"
    echo "6. Run: npx vercel --prod (to redeploy with env vars)"
    echo ""
else
    echo "❌ Deployment failed"
    echo "Please check the error messages above"
fi
