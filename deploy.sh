#!/bin/bash

echo "🚀 DepositGuard - Quick Deploy Script"
echo "======================================"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the depositguard directory"
    exit 1
fi

echo "✅ Found package.json"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local found"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo ""
    echo "🔧 IMPORTANT: Edit .env.local and add your:"
    echo "   - Stripe keys (from stripe.com/dashboard)"
    echo "   - NEXT_PUBLIC_APP_URL=http://localhost:3000"
    echo ""
    echo "Press Enter when ready to continue..."
    read
fi

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed - check errors above"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Git setup
if [ ! -d ".git" ]; then
    echo "📁 Initializing git..."
    git init
    git add .
    git commit -m "Initial commit - DepositGuard"
    git branch -M main
    echo "✅ Git initialized"
    echo ""
    echo "Next steps:"
    echo "1. Create repo on GitHub"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo ""
else
    echo "✅ Git already initialized"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "To deploy:"
echo "  1. Push to GitHub (see instructions above)"
echo "  2. Go to vercel.com/new"
echo "  3. Import your GitHub repo"
echo "  4. Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo "  5. Deploy!"
echo ""
echo "To run locally:"
echo "  npm run dev"
echo ""
