import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const LETTER_SYSTEM_PROMPT = `You are a legal document specialist generating California security deposit demand letters. Write professional, legally precise demand letters based on California Civil Code §1950.5.

Guidelines:
- Formal, professional tone (not aggressive, not casual)
- Reference specific California statutes
- Cite all violations found
- Calculate exact amounts owed including potential penalties
- Include a specific payment deadline (10 days)
- End with clear escalation warning (small claims court)
- Do not fabricate any facts not provided
- Format as a proper formal letter with today's date

Return ONLY a JSON object, no other text, in this exact format:
{
  "subject": "Demand for Return of Security Deposit — [Property Address or Tenant Name]",
  "body": "Full letter text here with proper line breaks using \\n",
  "send_to_email": "landlord email here",
  "applicable_statutes": ["California Civil Code §1950.5", "..."],
  "outcome_type": "A|B|C|D|E",
  "explanation": "1-2 sentence plain English explanation of the strongest argument",
  "deposit_withheld": 0,
  "penalty_amount": 0
}`;

export async function POST(request: NextRequest) {
  try {
    const { case_id } = await request.json();

    if (!case_id) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    // Fetch case from Supabase
    const { data: caseRow, error: caseError } = await supabaseAdmin
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (caseError || !caseRow) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Payment gate
    if (caseRow.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 });
    }

    // Return cached letter if already generated
    if (caseRow.generated_letter) {
      const stateInfo = { state_name: 'California', itemization_deadline: 21 };
      return NextResponse.json({
        email: caseRow.generated_letter,
        outcome: caseRow.generated_letter,
        state_info: stateInfo,
      });
    }

    const caseData = caseRow.case_data;
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Build the prompt with all case facts
    const casePrompt = `Generate a demand letter for this California security deposit case. Today's date is ${today}.

CASE FACTS:
- Tenant: ${caseData.tenant_name || '[Tenant Name]'}
- Tenant Address: ${caseData.tenant_address || '[Tenant Address]'}
- Property Address: ${caseData.property_address || '[Property Address]'}
- Landlord Email: ${caseData.landlord_email || '[Landlord Email]'}
- Landlord Name: ${caseData.landlord_name || 'Landlord'}
- Lease End Date: ${caseData.lease_end_date || '[Date]'}
- Security Deposit Paid: $${caseData.deposit_amount || 0}
- Amount Returned: $${caseData.amount_returned || 0}
- Amount Withheld: $${(caseData.deposit_amount || 0) - (caseData.amount_returned || 0)}
- Itemization Received: ${caseData.itemization_received ? 'Yes' : 'No'}
${caseData.itemization_date ? `- Itemization Date: ${caseData.itemization_date}` : ''}
${caseData.receipts_included !== null ? `- Receipts Included: ${caseData.receipts_included ? 'Yes' : 'No'}` : ''}
${caseData.tenancy_duration_months ? `- Tenancy Duration: ${caseData.tenancy_duration_months} months` : ''}

CASE TYPE: ${caseData.outcome_type || 'E'}
CASE ANALYSIS: ${caseData.analysis_summary || 'Disputed security deposit deductions'}

VIOLATIONS FOUND:
${(caseData.leverage_points || []).map((p: string) => `- ${p}`).join('\n') || '- Improper deductions from security deposit'}

DEDUCTIONS DISPUTED:
${
  (caseData.deductions || [])
    .map(
      (d: any) =>
        `- ${d.category}: $${d.amount} charged${d.fair_amount !== undefined ? `, fair amount: $${d.fair_amount}` : ''}`
    )
    .join('\n') || '- Full deposit withheld without proper justification'
}

Calculate:
- The exact amount owed back to tenant (deposit withheld)
- Potential penalty (up to 2x withheld amount for bad faith)
- Total claim amount`;

    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2048,
        system: LETTER_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: casePrompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      console.error('Anthropic letter error:', err);
      return NextResponse.json({ error: 'Failed to generate letter' }, { status: 500 });
    }

    const anthropicData = await anthropicResponse.json();
    const rawText = anthropicData.content?.[0]?.text || '';

    // Parse JSON response
    let letterData;
    try {
      const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
      letterData = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse letter JSON:', rawText);
      return NextResponse.json({ error: 'Failed to parse generated letter' }, { status: 500 });
    }

    // Cache the letter
    await supabaseAdmin
      .from('cases')
      .update({ generated_letter: letterData })
      .eq('id', case_id);

    const stateInfo = {
      state_name: 'California',
      itemization_deadline: 21,
      mailing_requirements: 'Send via email and certified mail (return receipt requested) for best legal standing.',
    };

    return NextResponse.json({
      email: letterData,
      outcome: letterData,
      state_info: stateInfo,
    });
  } catch (error) {
    console.error('Generate email error:', error);
    return NextResponse.json({ error: 'Failed to generate letter' }, { status: 500 });
  }
}
