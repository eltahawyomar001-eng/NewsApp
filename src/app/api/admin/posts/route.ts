import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    include: {
      category: true,
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      externalUrl,
      summary,
      categoryId,
      imageUrl,
      label,
      isPremium,
      isFeatured,
      status,
      publishAt,
    } = body;

    // Generate unique slug
    let slug = slugify(title);
    const existingSlug = await prisma.post.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        externalUrl,
        summary,
        categoryId,
        imageUrl: imageUrl || null,
        label: label || null,
        isPremium: isPremium || false,
        isFeatured: isFeatured || false,
        status: status || 'DRAFT',
        publishAt: publishAt ? new Date(publishAt) : (status === 'PUBLISHED' ? new Date() : null),
        authorId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
