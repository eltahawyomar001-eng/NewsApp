# NewsFlow - Modern News Publishing Platform

A production-ready news aggregation and publishing platform built with Next.js, inspired by major news sites like NYTimes, BBC, and Bloomberg.

## 🎯 Overview

NewsFlow is a complete news publishing solution featuring:
- **Newspaper-style frontend** with responsive design
- **Practical CMS dashboard** for daily editorial operations
- **Membership system** with Stripe integration
- **Ad management** with rotation and scheduling
- **Newsletter integration** with external providers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install dependencies
cd newsflow
npm install

# Set up the database
npx prisma migrate dev

# Seed with sample data
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the homepage.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@newsflow.com | admin123 |
| Editor | editor@newsflow.com | editor123 |

## 📝 For Editors: Daily Workflow

### Accessing the CMS
1. Navigate to `/admin` or click "Dashboard" in the header (visible when signed in)
2. Sign in with your editor credentials

### Publishing Content

#### Creating a New Post
1. Go to **Posts** → **New Post**
2. Fill in the required fields:
   - **Title**: The headline (keep it compelling and concise)
   - **External URL**: Link to the full article source
   - **Category**: Select the appropriate section
   - **Summary**: 2-3 sentences describing the article
3. Optional fields:
   - **Image URL**: Featured image (16:10 aspect ratio recommended)
   - **Label**: "Analysis", "Opinion", "Breaking", etc.
4. Set the article type:
   - **Premium**: Check to restrict to paid subscribers
   - **Featured**: Check to display as the hero story

#### Post Status Options
- **Draft**: Work in progress, not visible on site
- **Scheduled**: Will publish automatically at set date/time
- **Published**: Live and visible to readers

#### Scheduling Posts
1. Set status to "Scheduled"
2. Select the publish date and time
3. The post will automatically appear when the time arrives

### Today's Stories View
The Dashboard shows:
- Posts published today
- Upcoming scheduled posts
- Total post count
- Premium member count

### Managing Categories
Admins can add/edit/delete categories with custom sort order for navigation.

## 💰 Membership System

### How It Works

#### Free Users
- Access all articles from the **last 7 days**
- Older articles (archive) show locked preview
- Can subscribe to newsletter

#### Premium Users ($9.99/month)
- **Full archive access** - all historical articles
- **Premium articles** - exclusive analysis and reports
- Priority access to breaking news

### Stripe Integration

#### Test Mode Setup
1. Get your Stripe test keys from [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create a subscription product with a monthly price
3. Update `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Webhook Events Handled
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Status changes
- `customer.subscription.deleted` - Cancellation

#### Testing Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 📧 Newsletter Integration

### Configuration
Set your email provider credentials in `.env`:
```env
EMAIL_PROVIDER_API_URL=https://api.mailchimp.com/3.0/lists/{list_id}/members
EMAIL_PROVIDER_API_KEY=your_api_key
```

### How It Works
1. Users enter email in sidebar or footer widget
2. Email is validated and stored in database
3. If configured, syncs to external provider (Mailchimp, ConvertKit, etc.)
4. Success/error feedback shown inline

## 📺 Ad Management

### Ad Positions
| Position | Location | Dimensions |
|----------|----------|------------|
| TOP_BANNER | Below header | 728x90 |
| SIDEBAR | Right column | 300x250 |
| INLINE | Between articles | 728x120 |

### Ad Rotation
- Multiple ads can exist for each position
- System randomly selects from active ads
- Respects `activeFrom` and `activeTo` date ranges

### Creating Ads
1. Go to **Admin** → **Ads** → **New Ad**
2. Set title, link URL, and optional image
3. Choose position and date range
4. Toggle active/inactive status

## 🎨 Design Philosophy

### NYTimes/BBC/Bloomberg Inspiration

#### Visual Hierarchy
- One prominent hero story
- Dense but scannable article lists
- Clear section divisions with headers
- Minimal color - let typography lead

#### Color Palette
- Background: Light gray (#F5F5F5) / White (#FFFFFF)
- Text: Near-black (#111827)
- Accent: Blue (#2563EB) for links and CTAs
- Premium badge: Amber (#D97706)

#### Typography
- Headlines: Serif font (Merriweather)
- Body: Sans-serif (Inter)
- Tight tracking on headlines
- Comfortable line height for readability

#### Layout
- Centered container: max-width 1152px (6xl)
- Desktop: 2:1 main/sidebar ratio
- Mobile: Single column stack
- Consistent spacing with 8px grid

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout with providers
│   ├── providers.tsx         # Session provider
│   ├── signin/               # Authentication
│   ├── signup/
│   ├── membership/           # Subscription page
│   ├── category/[slug]/      # Category pages
│   ├── admin/                # CMS Dashboard
│   │   ├── page.tsx          # Dashboard home
│   │   ├── posts/            # Post management
│   │   ├── categories/       # Category management
│   │   ├── ads/              # Ad management
│   │   └── subscribers/      # Newsletter subscribers
│   └── api/
│       ├── auth/             # NextAuth endpoints
│       ├── stripe/           # Checkout & webhooks
│       ├── newsletter/       # Subscription endpoint
│       └── admin/            # CMS API routes
├── components/
│   ├── Header.tsx            # Site header with nav
│   ├── Footer.tsx            # Site footer
│   ├── HeroStory.tsx         # Featured article card
│   ├── StoryList.tsx         # Article list component
│   ├── TrendingList.tsx      # Trending sidebar
│   ├── SectionHeader.tsx     # Section dividers
│   ├── AdSlot.tsx            # Ad display component
│   ├── NewsletterModule.tsx  # Email signup form
│   └── admin/
│       └── AdminSidebar.tsx  # CMS navigation
└── lib/
    ├── prisma.ts             # Database client
    ├── auth.ts               # NextAuth config
    ├── stripe.ts             # Stripe helpers
    ├── membership.ts         # Access control logic
    ├── ads.ts                # Ad rotation logic
    └── utils.ts              # Utility functions
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# Email Provider
EMAIL_PROVIDER_API_URL="https://api.provider.com/subscribe"
EMAIL_PROVIDER_API_KEY="your_api_key"

# App Settings
FREE_ACCESS_DAYS=7
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Forms**: React Hook Form + Zod

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Database for Production
Switch to PostgreSQL by updating `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Stripe Webhooks
Add your production webhook endpoint:
```
https://your-domain.com/api/stripe/webhook
```

## 📄 License

MIT License - feel free to use for your own projects.

---

Built with ❤️ as a demonstration of modern news platform architecture.
