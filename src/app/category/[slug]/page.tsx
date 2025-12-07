import { notFound } from 'next/navigation';
import { Header, Footer, StoryList, SectionHeader, NewsletterModule, AdSlot } from '@/components';
import prisma from '@/lib/prisma';
import { getRandomAd } from '@/lib/ads';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  });
}

async function getCategoryPosts(categoryId: string) {
  const now = new Date();
  return prisma.post.findMany({
    where: {
      categoryId,
      status: 'PUBLISHED',
      OR: [
        { publishAt: { lte: now } },
        { publishAt: null },
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      publishAt: 'desc',
    },
    take: 20,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const [posts, sidebarAd] = await Promise.all([
    getCategoryPosts(category.id),
    getRandomAd('SIDEBAR'),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="lg:grid lg:grid-cols-[2fr,1fr] lg:gap-8">
          {/* Left Column - Main Content */}
          <div>
            <SectionHeader title={category.name} />
            
            {posts.length > 0 ? (
              <StoryList posts={posts} showCategory={false} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                No articles in this category yet.
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <NewsletterModule />
            {sidebarAd && <AdSlot ad={sidebarAd} position="SIDEBAR" />}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
