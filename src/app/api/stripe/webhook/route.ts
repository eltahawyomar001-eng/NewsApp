import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createOrUpdateMembership } from '@/lib/membership';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (userId && session.subscription && stripe) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const subscription = subscriptionResponse as unknown as Stripe.Subscription;
          
          await createOrUpdateMembership(userId, {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            status: 'ACTIVE',
            currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find membership by customer ID and update
        const { prisma } = await import('@/lib/prisma');
        const membership = await prisma.membership.findFirst({
          where: { stripeCustomerId: customerId },
        });
        
        if (membership) {
          let status = 'ACTIVE';
          if (subscription.status === 'canceled') status = 'CANCELLED';
          else if (subscription.status === 'past_due') status = 'PAST_DUE';
          else if (subscription.status === 'active') status = 'ACTIVE';
          
          await createOrUpdateMembership(membership.userId, {
            status,
            currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const { prisma } = await import('@/lib/prisma');
        const membership = await prisma.membership.findFirst({
          where: { stripeCustomerId: customerId },
        });
        
        if (membership) {
          await createOrUpdateMembership(membership.userId, {
            status: 'CANCELLED',
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
