import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@newsflow.com' },
    update: {},
    create: {
      email: 'admin@newsflow.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@newsflow.com' },
    update: {},
    create: {
      email: 'editor@newsflow.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR',
    },
  });
  console.log('✅ Editor user created:', editor.email);

  // Create categories
  const categories = [
    { name: 'Politics', slug: 'politics', sortOrder: 1 },
    { name: 'Business', slug: 'business', sortOrder: 2 },
    { name: 'Technology', slug: 'technology', sortOrder: 3 },
    { name: 'World', slug: 'world', sortOrder: 4 },
    { name: 'Opinion', slug: 'opinion', sortOrder: 5 },
    { name: 'Science', slug: 'science', sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Get category IDs
  const politicsCategory = await prisma.category.findUnique({ where: { slug: 'politics' } });
  const businessCategory = await prisma.category.findUnique({ where: { slug: 'business' } });
  const techCategory = await prisma.category.findUnique({ where: { slug: 'technology' } });
  const worldCategory = await prisma.category.findUnique({ where: { slug: 'world' } });
  const opinionCategory = await prisma.category.findUnique({ where: { slug: 'opinion' } });

  // Create sample posts
  const posts = [
    {
      title: 'Global Leaders Gather for Climate Summit as Deadline Looms',
      slug: 'global-leaders-climate-summit-2024',
      summary: 'World leaders convene in Geneva for crucial climate negotiations as scientists warn that time is running out to prevent catastrophic warming. The summit aims to establish new binding commitments.',
      externalUrl: 'https://example.com/climate-summit',
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
      categoryId: worldCategory!.id,
      authorId: admin.id,
      isPremium: false,
      isFeatured: true,
      status: 'PUBLISHED',
      publishAt: new Date(),
      label: 'Breaking',
      views: 1520,
    },
    {
      title: 'Tech Giants Report Record Earnings Amid AI Boom',
      slug: 'tech-giants-record-earnings-ai',
      summary: 'Major technology companies exceed Wall Street expectations as artificial intelligence investments begin paying off. Stock prices surge on the news.',
      externalUrl: 'https://example.com/tech-earnings',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      categoryId: businessCategory!.id,
      authorId: editor.id,
      isPremium: true,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 3600000),
      label: 'Analysis',
      views: 892,
    },
    {
      title: 'New Study Reveals Breakthrough in Quantum Computing',
      slug: 'quantum-computing-breakthrough-study',
      summary: 'Researchers achieve major milestone in quantum error correction, bringing practical quantum computers closer to reality. The implications for cryptography and drug discovery are profound.',
      externalUrl: 'https://example.com/quantum-breakthrough',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
      categoryId: techCategory!.id,
      authorId: admin.id,
      isPremium: false,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 7200000),
      views: 1105,
    },
    {
      title: 'Central Bank Signals Interest Rate Decision Ahead',
      slug: 'central-bank-interest-rate-decision',
      summary: 'Federal Reserve officials hint at potential policy shift in upcoming meeting. Markets react to signals of changing monetary policy direction.',
      externalUrl: 'https://example.com/fed-rates',
      categoryId: businessCategory!.id,
      authorId: editor.id,
      isPremium: true,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 10800000),
      label: 'Markets',
      views: 756,
    },
    {
      title: 'Congressional Leaders Reach Bipartisan Agreement on Infrastructure',
      slug: 'bipartisan-infrastructure-agreement',
      summary: 'After months of negotiations, lawmakers from both parties announce a compromise on major infrastructure legislation that would modernize roads, bridges, and broadband.',
      externalUrl: 'https://example.com/infrastructure-deal',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
      categoryId: politicsCategory!.id,
      authorId: admin.id,
      isPremium: false,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 14400000),
      views: 634,
    },
    {
      title: 'The Future of Work: Why Remote Jobs Are Here to Stay',
      slug: 'future-of-work-remote-jobs',
      summary: 'Analysis of workplace trends shows that hybrid and remote work arrangements have become permanent fixtures in the modern economy, reshaping cities and lifestyles.',
      externalUrl: 'https://example.com/future-work',
      categoryId: opinionCategory!.id,
      authorId: editor.id,
      isPremium: false,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 18000000),
      label: 'Opinion',
      views: 445,
    },
    {
      title: 'AI Regulation Takes Center Stage in European Parliament',
      slug: 'ai-regulation-eu-parliament',
      summary: 'European lawmakers debate comprehensive artificial intelligence rules that could set global standards. Tech companies express concerns over compliance costs.',
      externalUrl: 'https://example.com/eu-ai-regulation',
      categoryId: techCategory!.id,
      authorId: admin.id,
      isPremium: true,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 21600000),
      views: 523,
    },
    {
      title: 'Markets Rally on Strong Economic Data',
      slug: 'markets-rally-economic-data',
      summary: 'Stock indices reach new highs as employment and consumer spending figures beat expectations. Investors remain cautiously optimistic about the economic outlook.',
      externalUrl: 'https://example.com/markets-rally',
      categoryId: businessCategory!.id,
      authorId: editor.id,
      isPremium: false,
      isFeatured: false,
      status: 'PUBLISHED',
      publishAt: new Date(Date.now() - 25200000),
      views: 389,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ Sample posts created');

  // Create sample ads
  const ads = [
    {
      title: 'Premium Subscription - Try Free',
      linkUrl: '/membership',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=200&fit=crop&q=80',
      position: 'TOP_BANNER',
      isActive: true,
    },
    {
      title: 'Tech Conference 2024',
      linkUrl: 'https://example.com/techconf',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
      position: 'SIDEBAR',
      isActive: true,
    },
    {
      title: 'Business Newsletter',
      linkUrl: 'https://example.com/newsletter',
      imageUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&q=80',
      position: 'SIDEBAR',
      isActive: true,
    },
    {
      title: 'Sponsored Content',
      linkUrl: 'https://example.com/sponsored',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=300&fit=crop&q=80',
      position: 'INLINE',
      isActive: true,
    },
  ];

  for (const ad of ads) {
    const existing = await prisma.ad.findFirst({
      where: { title: ad.title, position: ad.position },
    });
    if (!existing) {
      await prisma.ad.create({ data: ad });
    }
  }
  console.log('✅ Sample ads created');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@newsflow.com / admin123');
  console.log('   Editor: editor@newsflow.com / editor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
