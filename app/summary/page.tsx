'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/rules';
import { getStateName } from '@/lib/stateRules';
import { SkeletonCard, Spinner } from '@/components/LoadingStates';

interface CaseData {
  id: string;
  state: string;
  lease_end_date: string;
  deposit_amount: number;
  amount_returned: number;
  outcome_type: string;
  payment_status: string;
}

interface OutcomeData {
  explanation: string;
  deposit_withheld: number;
  days_since_lease_end: number;
  penalty_amount: number;
  deadline_days: number;
}

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseId = searchParams.get('case_id');
  
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [outcome, setOutcome] = useState<OutcomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setError('No case ID provided');
      setLoading(false);
      return;
    }

    fetchCaseData();
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      const response = await fetch(`/api/intake?case_id=${caseId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load case');
      }

      setCaseData(result.case);
      
      setOutcome({
        explanation: getOutcomeExplanation(result.case.outcome_type),
        deposit_withheld: result.case.deposit_amount - result.case.amount_returned,
        days_since_lease_end: Math.floor(
          (new Date().getTime() - new Date(result.case.lease_end_date).getTime()) / (1000 * 60 * 60 * 24)
        ),
        penalty_amount: (result.case.deposit_amount - result.case.amount_returned) * 2,
        deadline_days: 21,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      if (result.session_url) {
        window.location.href = result.session_url;
      }
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to start checkout');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-24 h-8 bg-neutral-200 rounded" />
              <div className="w-16 h-1 bg-neutral-200" />
              <div className="w-24 h-8 bg-neutral-200 rounded" />
              <div className="w-16 h-1 bg-neutral-200" />
              <div className="w-24 h-8 bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Header Skeleton */}
          <div className="text-center mb-8 animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-48 mx-auto" />
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData || !outcome) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 animate-fadeIn">
        <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-error-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-h3 text-neutral-900 mb-2">Error</h2>
          <p className="text-body text-neutral-600 mb-6">{error || 'Failed to load case data'}</p>
          <button
            onClick={() => router.push('/intake')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all duration-300"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (caseData.payment_status === 'paid') {
    router.push(`/email?case_id=${caseId}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-success-600 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 font-medium text-neutral-900">Questions</span>
            </div>
            <div className="w-16 h-1 bg-primary-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 font-medium text-neutral-900">Summary</span>
            </div>
            <div className="w-16 h-1 bg-neutral-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 text-neutral-600">Letter</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-h1 text-neutral-900 mb-2">
            Your Case Analysis
          </h1>
          <p className="text-body-lg text-neutral-600">
            Here's what we found under {getStateName(caseData.state as any)} law
          </p>
        </div>

        {/* Case Summary Card */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-6 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-h3 text-neutral-900 mb-6">Case Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-neutral-200">
              <span className="text-neutral-600">Security deposit paid:</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(caseData.deposit_amount)}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-neutral-200">
              <span className="text-neutral-600">Amount returned:</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(caseData.amount_returned)}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-neutral-200">
              <span className="text-neutral-600">Amount withheld:</span>
              <span className="font-semibold text-error-600">{formatCurrency(outcome.deposit_withheld)}</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-neutral-600">Days since lease ended:</span>
              <span className="font-semibold text-neutral-900">{outcome.days_since_lease_end} days</span>
            </div>
          </div>
        </div>

        {/* Leverage Analysis */}
        <div className="bg-info-50 border border-info-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-info-900 mb-3">Your Leverage</h3>
          <p className="text-info-800 mb-4">{outcome.explanation}</p>
          
          <div className="bg-white rounded-md p-4">
            <p className="text-sm text-neutral-700 mb-2">
              <strong>California law required:</strong> Your landlord had {outcome.deadline_days} days to provide an itemized statement of deductions.
            </p>
            <p className="text-sm text-neutral-700">
              <strong>Potential recovery:</strong> Up to {formatCurrency(outcome.penalty_amount)} (including statutory penalties for bad faith withholding)
            </p>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="bg-white border-2 border-primary-100 rounded-lg p-8 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-h3 text-neutral-900 mb-6">What You'll Get</h3>
          <ul className="space-y-4">
            {[
              { title: 'Professional demand letter customized to your case', desc: 'Based on your specific situation and California law' },
              { title: 'Citations to relevant California statutes', desc: 'Legally accurate references that landlords recognize' },
              { title: 'Step-by-step instructions for sending', desc: 'Clear guidance on how to deliver your letter' },
              { title: 'Instant download — ready to send immediately', desc: 'No waiting, no delays, no lawyer fees' },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <svg className="w-6 h-6 text-success-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-600 mt-1">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Paywall CTA */}
        <div className="bg-white shadow-sm rounded-lg p-8 text-center hover:shadow-md transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Unlock Your Demand Letter
          </h3>
          
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <div className="blur-sm select-none pointer-events-none">
                <p className="text-neutral-600 mb-2">Subject: Security Deposit Return Request</p>
                <p className="text-sm text-neutral-600">Dear Landlord, I am writing regarding my security deposit for the property I rented at...</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-md shadow-lg">
                  <svg className="w-6 h-6 text-neutral-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-4xl font-bold text-neutral-900 mb-2">$49</p>
            <p className="text-neutral-600">One-time payment • Instant access</p>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full max-w-md mx-auto flex justify-center items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-md text-white bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[44px]"
          >
            {checkoutLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              'Get My Demand Letter'
            )}
          </button>
          
          <div className="mt-6 flex items-center justify-center text-sm text-neutral-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure payment powered by Stripe
          </div>
        </div>
      </div>
    </div>
  );
}

function getOutcomeExplanation(outcomeType: string): string {
  const explanations: Record<string, string> = {
    A: "Your landlord failed to provide an itemization within the legal deadline. This is the strongest case for full deposit return plus penalties.",
    B: "Your landlord provided itemization late, missing the legal deadline. You may be entitled to the full deposit plus penalties.",
    C: "Your landlord withheld money without providing required receipts. This strengthens your case significantly.",
    D: "The deductions appear to be for normal wear and tear without proper documentation. You have grounds to dispute.",
    E: "While the itemization was timely, you may still dispute deductions that appear improper or lack documentation.",
  };
  
  return explanations[outcomeType] || explanations.E;
}
