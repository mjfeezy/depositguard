import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    // Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

    const case_id = session.metadata?.case_id;
    if (!case_id) {
      return NextResponse.json({ error: 'Case ID not found in session' }, { status: 404 });
    }

    // Mark case as paid in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('cases')
      .update({
        payment_status: 'paid',
        status: 'paid',
        stripe_session_id: session_id,
      })
      .eq('id', case_id);

    if (updateError) {
      console.error('Failed to update case payment status:', updateError);
      // Don't block — payment is confirmed, just log the error
    }

    return NextResponse.json({
      success: true,
      case_id,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
