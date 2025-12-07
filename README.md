# NewsFlowThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A modern, professional news publishing platform inspired by NYTimes, BBC, and Bloomberg. Built with Next.js, featuring a complete CMS, membership system, and ad management.## Getting Started



![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)First, run the development server:

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)```bash

![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)npm run dev

# or

## ✨ Featuresyarn dev

# or

### 📰 Front-Endpnpm dev

- **Newspaper-style homepage** with hero story, latest news, and category sections# or

- **Responsive design** optimized for desktop, tablet, and mobilebun dev

- **Category pages** for Politics, Business, Technology, World, Opinion```

- **Trending articles** sidebar with view counts

- **Newsletter signup** integrated throughout the siteOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



### 🎛️ Admin CMS DashboardYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Post Management** – Create, edit, schedule, and publish articles

- **Category Management** – Organize content into sectionsThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Ad Management** – Control banner, sidebar, and inline ad placements

- **Subscriber List** – View and manage newsletter subscribers## Learn More

- **Role-based access** – Admin and Editor roles with different permissions

To learn more about Next.js, take a look at the following resources:

### 💳 Membership & Payments

- **Stripe integration** for subscription payments- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- **Premium content gating** – Mark articles as free or premium- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **Archive access** for paying members

- **Customer portal** for subscription managementYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



### 📧 Newsletter Integration## Deploy on Vercel

- **Email capture forms** in sidebar and footer

- **API ready** for Mailchimp, ConvertKit, SendGrid, or any providerThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- **Subscriber management** in admin dashboard

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 📢 Advertising System
- **Multiple ad positions** – Top banner, sidebar, inline
- **Date scheduling** – Set start and end dates for campaigns
- **Ad rotation** – Random selection from active ads
- **Click tracking ready**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eltahawyomar001-eng/NewsApp.git
   cd NewsApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Homepage: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@newsflow.com | admin123 |
| Editor | editor@newsflow.com | editor123 |

## 📁 Project Structure

```
newsflow/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data seeder
├── src/
│   ├── app/
│   │   ├── admin/         # CMS dashboard pages
│   │   ├── api/           # API routes
│   │   ├── category/      # Category pages
│   │   ├── signin/        # Authentication
│   │   ├── signup/
│   │   ├── membership/    # Pricing page
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   └── lib/               # Utilities & configs
├── public/                # Static assets
└── package.json
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Prisma + SQLite (dev) / PostgreSQL (prod) |
| Authentication | NextAuth.js |
| Payments | Stripe |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

## 📝 CMS Guide

### Creating a Post
1. Go to **Admin** → **Posts** → **New Post**
2. Fill in the title, summary, and external URL
3. Select a category and optionally add an image URL
4. Toggle **Featured** to show as hero story
5. Toggle **Premium** to restrict to subscribers
6. Set status to **Published** and save

### Managing Ads
1. Go to **Admin** → **Ads**
2. Click **New Ad**
3. Enter title, link URL, and image URL
4. Select position (Top Banner, Sidebar, or Inline)
5. Optionally set start/end dates for the campaign

### Newsletter Subscribers
- View all subscribers at **Admin** → **Subscribers**
- Export functionality coming soon

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database for Production

For production, switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Use a managed PostgreSQL service:
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Supabase](https://supabase.com)
   - [PlanetScale](https://planetscale.com)
   - [Neon](https://neon.tech)

## 💰 Cost Comparison

| | Webflow/Wix/Squarespace | NewsFlow on Vercel |
|---|---|---|
| **Platform Fee** | $25–$40/month | $0 |
| **CMS** | Limited templates | Fully custom |
| **Hosting** | Locked in | ~$0–$20/month |
| **Database** | Extra cost | ~$0–$10/month |
| **Ownership** | Platform owns | You own everything |

## 📄 License

This project is proprietary. All rights reserved.

## 🤝 Support

For questions or customization requests, please contact the developer.

---

Built with ❤️ using Next.js and modern web technologies.
