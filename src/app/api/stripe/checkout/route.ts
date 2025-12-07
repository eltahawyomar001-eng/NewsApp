import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession, createPortalSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // Check if user already has a membership with Stripe customer
    const membership = await prisma.membership.findUnique({
      where: { userId: session.user.id },
    });

    if (action === 'portal' && membership?.stripeCustomerId) {
      // Create portal session for existing customers
      const portalSession = await createPortalSession(membership.stripeCustomerId);
      return NextResponse.json({ url: portalSession.url });
    }

    // Create new checkout session
    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
