'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@/components';
import { Check, Crown, Loader2, CheckCircle, XCircle } from 'lucide-react';

const features = {
  free: [
    'Access to articles from the last 7 days',
    'Daily newsletter',
    'Basic search',
  ],
  premium: [
    'Everything in Free',
    'Full archive access',
    'Premium articles and analysis',
    'Ad-free reading experience',
    'Early access to breaking news',
    'Exclusive weekly digest',
  ],
};

export default function MembershipPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = '/signin?callbackUrl=/membership';
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'portal' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 lg:px-6 py-12">
        {/* Success/Canceled Messages */}
        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Welcome to Premium! Your subscription is now active.</span>
            </div>
          </div>
        )}
        
        {canceled && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Checkout was canceled. No charges were made.</span>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to our journalism. Support independent reporting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Free</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            {status === 'authenticated' ? (
              <div className="text-center text-gray-500 text-sm">
                You&apos;re currently on this plan
              </div>
            ) : (
              <Link
                href="/signup"
                className="block w-full text-center py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-white border-2 border-blue-600 rounded-lg p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">Premium</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$9.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={session ? handleManageSubscription : handleSubscribe}
              disabled={loading || status === 'loading'}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading || status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : session ? (
                'Manage Subscription'
              ) : (
                'Subscribe Now'
              )}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What&apos;s included in archive access?
              </h3>
              <p className="text-gray-600">
                Premium members get full access to all articles ever published on NewsFlow, 
                including our deep-dive investigations and special reports.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have 
                premium access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How do I access premium articles?
              </h3>
              <p className="text-gray-600">
                Simply sign in with your account. Premium articles will automatically be 
                unlocked once your subscription is active.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
