import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST: create a new case and return its ID
export async function POST(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('cases')
      .insert({ status: 'intake', case_data: {} })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ case_id: data.id });
  } catch (error) {
    console.error('Create case error:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}

// GET: fetch a case by ID
export async function GET(request: NextRequest) {
  try {
    const caseId = request.nextUrl.searchParams.get('case_id');
    if (!caseId) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Flatten for compatibility with summary page
    const caseData = data.case_data || {};
    return NextResponse.json({
      case: {
        id: data.id,
        state: caseData.state || 'CA',
        lease_end_date: caseData.lease_end_date,
        deposit_amount: caseData.deposit_amount || 0,
        amount_returned: caseData.amount_returned || 0,
        outcome_type: caseData.outcome_type || 'E',
        payment_status: data.payment_status,
        status: data.status,
        ...caseData,
      },
    });
  } catch (error) {
    console.error('Get case error:', error);
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}
