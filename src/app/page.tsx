import { Header, Footer, HeroStory, StoryList, TrendingList, SectionHeader, AdSlot, NewsletterModule } from "@/components";
import prisma from "@/lib/prisma";
import { getRandomAd } from "@/lib/ads";

// Force dynamic rendering - fetch fresh data on each request
export const dynamic = 'force-dynamic';

async function getFeaturedPost() {
  if (!prisma) return null;
  try {
    const now = new Date();
    return await prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        isFeatured: true,
        OR: [
          { publishAt: { lte: now } },
          { publishAt: null },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        publishAt: "desc",
      },
    });
  } catch {
    return null;
  }
}

async function getLatestPosts(excludeId?: string) {
  if (!prisma) return [];
  try {
    const now = new Date();
    return await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          { publishAt: { lte: now } },
          { publishAt: null },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        publishAt: "desc",
      },
      take: 10,
    });
  } catch {
    return [];
  }
}

async function getTrendingPosts() {
  if (!prisma) return [];
  try {
    const now = new Date();
    return await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { publishAt: { lte: now } },
          { publishAt: null },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        views: "desc",
      },
      take: 5,
    });
  } catch {
    return [];
  }
}

async function getPostsByCategory(categorySlug: string, limit: number = 4) {
  if (!prisma) return [];
  try {
    const now = new Date();
    return await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        category: {
          slug: categorySlug,
        },
        OR: [
          { publishAt: { lte: now } },
          { publishAt: null },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        publishAt: "desc",
      },
      take: limit,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredPost, latestPosts, trendingPosts, topBannerAd, sidebarAd1, sidebarAd2, inlineAd] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts(),
    getTrendingPosts(),
    getRandomAd("TOP_BANNER"),
    getRandomAd("SIDEBAR"),
    getRandomAd("SIDEBAR"),
    getRandomAd("INLINE"),
  ]);

  const postsExcludingFeatured = latestPosts.filter(p => p.id !== featuredPost?.id);

  const [politicsPosts, businessPosts, techPosts] = await Promise.all([
    getPostsByCategory("politics", 4),
    getPostsByCategory("business", 4),
    getPostsByCategory("technology", 4),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {topBannerAd && (
        <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-4">
          <AdSlot ad={topBannerAd} position="TOP_BANNER" />
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="lg:grid lg:grid-cols-[2fr,1fr] lg:gap-8">
          <div>
            {featuredPost && <HeroStory post={featuredPost} />}

            <section className="mb-8">
              <SectionHeader title="Latest" />
              <StoryList posts={postsExcludingFeatured.slice(0, 5)} />
            </section>

            {inlineAd && <AdSlot ad={inlineAd} position="INLINE" />}

            {politicsPosts.length > 0 && (
              <section className="mb-8">
                <SectionHeader title="Politics" href="/category/politics" />
                <StoryList posts={politicsPosts} showCategory={false} />
              </section>
            )}

            {businessPosts.length > 0 && (
              <section className="mb-8">
                <SectionHeader title="Business" href="/category/business" />
                <StoryList posts={businessPosts} showCategory={false} />
              </section>
            )}

            {techPosts.length > 0 && (
              <section className="mb-8">
                <SectionHeader title="Technology" href="/category/technology" />
                <StoryList posts={techPosts} showCategory={false} />
              </section>
            )}
          </div>

          <aside className="hidden lg:block space-y-6">
            <NewsletterModule />
            <TrendingList posts={trendingPosts} />
            {sidebarAd1 && <AdSlot ad={sidebarAd1} position="SIDEBAR" />}
            {sidebarAd2 && sidebarAd2.id !== sidebarAd1?.id && (
              <AdSlot ad={sidebarAd2} position="SIDEBAR" />
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
