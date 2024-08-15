import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/config/firebase'; // Adjust the path to your firebase config
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Study Pulse Plus Membership',
            },
            unit_amount: 500, // This is the price in cents (e.g., $5.00)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    return new NextResponse(err.message, { status: err.statusCode || 500 });
  }
}
