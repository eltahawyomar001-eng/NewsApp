import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = emailSchema.parse(body);

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { status: 200 }
      );
    }

    // Save to database
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    // Send to external email provider if configured
    const apiUrl = process.env.EMAIL_PROVIDER_API_URL;
    const apiKey = process.env.EMAIL_PROVIDER_API_KEY;

    if (apiUrl && apiKey && apiUrl !== 'https://api.yourprovider.com/subscribe') {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          console.error('Email provider API error:', await response.text());
        }
      } catch (error) {
        console.error('Failed to sync with email provider:', error);
        // Don't fail the request, we still saved locally
      }
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
