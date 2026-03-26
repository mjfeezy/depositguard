import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Support both case_id and caseId for compatibility
    const caseId = body.case_id || body.caseId;

    if (!caseId) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DepositGuard — Demand Letter',
              description: 'AI-generated demand letter based on California Civil Code §1950.5',
            },
            unit_amount: 4900, // $49.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/email?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/summary?case_id=${caseId}`,
      metadata: {
        case_id: caseId,
      },
    });

    // Return both for compatibility (summary page uses session_url, old code used sessionId)
    return NextResponse.json({
      session_url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
