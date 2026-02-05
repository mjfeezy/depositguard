import { NextRequest, NextResponse } from 'next/server';
import { getStateRules } from '@/lib/stateRules';
import { formatCurrency } from '@/lib/rules';

// In-memory storage (same as intake route)
// In production, use Supabase or your database
const cases = new Map<string, any>();

// This should be shared with intake/route.ts in production
// For now, we're duplicating to make it work
function getCaseData(caseId: string) {
  return cases.get(caseId);
}

function generateDemandLetter(caseData: any, outcome: any): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `${today}

${caseData.tenant_name}
${caseData.tenant_address}

${caseData.landlord_email}

Re: Demand for Return of Security Deposit

Dear Landlord,

I am writing to formally demand the return of my security deposit in the amount of ${formatCurrency(caseData.deposit_amount)}.

LEASE DETAILS:
- Property Address: ${caseData.tenant_address}
- Lease End Date: ${new Date(caseData.lease_end_date).toLocaleDateString('en-US')}
- Security Deposit: ${formatCurrency(caseData.deposit_amount)}
- Amount Returned: ${formatCurrency(caseData.amount_returned || 0)}

CALIFORNIA LAW REQUIREMENTS:
Under California Civil Code Section 1950.5, you were required to:
1. Return my security deposit within 21 days of move-out
2. Provide an itemized statement of any deductions
3. Include receipts for repairs exceeding $126

${caseData.itemization_received === 'yes' 
  ? `I received an itemization on ${new Date(caseData.itemization_date).toLocaleDateString('en-US')}, however, `
  : 'I have not received the required itemization. '
}${getViolationText(caseData)}

DEMAND:
I demand the immediate return of ${formatCurrency(outcome.amount_owed)} within 10 days of receipt of this letter.

If you fail to comply, I will pursue all available legal remedies, including filing a claim in small claims court for ${formatCurrency(outcome.total_claim)}, which includes the security deposit amount plus statutory penalties of up to ${formatCurrency(outcome.penalty_amount)}.

Please send payment to:
${caseData.tenant_name}
${caseData.tenant_address}

I expect your prompt attention to this matter.

Sincerely,
${caseData.tenant_name}`;
}

function getViolationText(caseData: any): string {
  if (caseData.deduction_type === 'unclear') {
    return 'the deductions are unclear and not properly documented.';
  } else if (caseData.deduction_type === 'excessive') {
    return 'the deductions appear excessive and beyond normal wear and tear.';
  } else if (caseData.deduction_type === 'normal_wear') {
    return 'the deductions are for normal wear and tear, which is not permissible under California law.';
  } else if (caseData.deduction_type === 'fraudulent') {
    return 'the deductions appear to be fraudulent.';
  }
  return 'the itemization does not comply with California law.';
}

function calculateOutcome(caseData: any) {
  const depositAmount = caseData.deposit_amount || 0;
  const amountReturned = caseData.amount_returned || 0;
  const depositWithheld = depositAmount - amountReturned;
  
  // Calculate days since lease end
  const leaseEndDate = new Date(caseData.lease_end_date);
  const today = new Date();
  const daysLate = Math.floor((today.getTime() - leaseEndDate.getTime()) / (1000 * 60 * 60 * 24)) - 21;
  
  // Bad faith penalty (2x deposit if over 21 days late and improper deductions)
  let penaltyAmount = 0;
  if (daysLate > 0 && (caseData.itemization_received === 'no' || caseData.deduction_type !== 'unclear')) {
    penaltyAmount = depositAmount * 2;
  }
  
  const totalClaim = depositWithheld + penaltyAmount;
  
  return {
    deposit_amount: depositAmount,
    amount_returned: amountReturned,
    deposit_withheld: depositWithheld,
    penalty_amount: penaltyAmount,
    total_claim: totalClaim,
    amount_owed: depositWithheld,
    days_late: Math.max(0, daysLate),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { case_id } = await request.json();

    if (!case_id) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    // Get case data (in production, fetch from database)
    const caseData = getCaseData(case_id);

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Check if payment was completed (in production, verify via Stripe)
    if (caseData.status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment required to generate letter' },
        { status: 403 }
      );
    }

    // Get state-specific rules
    const stateRules = getStateRules(caseData.state || 'CA');

    // Calculate outcome
    const outcome = calculateOutcome(caseData);

    // Generate demand letter
    const email = generateDemandLetter(caseData, outcome);

    return NextResponse.json({
      email,
      outcome,
      state_info: stateRules,
    });

  } catch (error) {
    console.error('Generate email error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}
