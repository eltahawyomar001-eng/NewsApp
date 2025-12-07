import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
// This prevents build errors when env vars aren't set
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  : null;

export async function createCheckoutSession(userId: string, email: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/membership?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/membership?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createPortalSession(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/membership`,
  });

  return session;
}
