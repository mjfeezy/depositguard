# DepositGuard

Professional security deposit demand letter generator for California tenants.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Stripe account
- Supabase account (optional, for data storage)

### Step 1: Push to GitHub

```bash
cd depositguard
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/depositguard.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your `depositguard` GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Optional (for full functionality):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_YOUR_KEY
```

### Step 4: Configure Stripe Webhook

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhook/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel

## 🏃 Local Development

```bash
# Install dependencies
npm install

# Create .env.local file (copy from .env.example)
cp .env.example .env.local

# Add your keys to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
depositguard/
├── app/
│   ├── intake/          # Customer intake form
│   ├── summary/         # Payment summary page
│   ├── email/           # Generated letter delivery
│   ├── api/             # Backend API routes
│   │   ├── checkout/    # Stripe checkout
│   │   └── webhook/     # Stripe webhook handler
│   ├── layout.tsx       # Root layout with navigation
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles with animations
├── components/
│   ├── Hero.tsx         # Homepage hero section
│   ├── Stats.tsx        # Social proof statistics
│   ├── Testimonials.tsx # Customer testimonials
│   └── ...              # Other UI components
└── lib/                 # Utility functions
```

## 🎨 Design System

The app uses a cohesive design system with:
- Primary color: Blue (`#2563EB`)
- Neutral colors: Gray scale
- Typography: System fonts with responsive sizing
- Animations: Subtle fade-ins and hover effects
- Touch targets: Minimum 44x44px for mobile

See `DESIGN_SYSTEM.md` for full specifications.

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe Checkout
- **Database**: Supabase (optional)
- **Deployment**: Vercel
- **Email**: Resend (optional)

## 📋 Implementation Phases

This project was built in 3 phases:

1. **Phase 1**: Core functionality and UX improvements
2. **Phase 2**: Design system and component consistency
3. **Phase 3**: Micro-interactions and polish

See `PHASE-*.md` files for detailed changes.

## 🚨 Important Notes

### Stripe Configuration
- Use test mode keys during development
- Switch to live keys only after full testing
- Test the complete flow: form → payment → letter delivery

### Security
- Never commit `.env.local` to git
- Validate webhook signatures in production
- Use Stripe's test cards for testing

### Legal Compliance
- This generates California-specific demand letters
- Ensure all legal text is reviewed by attorney
- Update laws and statutes as regulations change

## 🐛 Troubleshooting

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check that all environment variables are set
- Verify Node.js version is 18+ (`node -v`)

**Stripe webhook not working:**
- Check webhook secret matches Stripe dashboard
- Verify endpoint URL is correct
- Check Vercel function logs for errors

**Styling issues:**
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For issues or questions, contact support or create a GitHub issue.
