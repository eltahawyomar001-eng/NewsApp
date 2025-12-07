import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, imageUrl, linkUrl, position, activeFrom, activeTo, isActive } = body;

    const ad = await prisma.ad.create({
      data: {
        title,
        imageUrl: imageUrl || null,
        linkUrl,
        position,
        activeFrom: activeFrom ? new Date(activeFrom) : null,
        activeTo: activeTo ? new Date(activeTo) : null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}
