'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/rules';
import { Toaster, toast } from 'react-hot-toast';
import { SkeletonLetter, Spinner } from '@/components/LoadingStates';
import { SuccessCelebration, AnimatedCheckmark } from '@/components/SuccessCelebration';

interface EmailData {
  subject: string;
  body: string;
  send_to_email: string;
}

interface OutcomeData {
  outcome_type: string;
  explanation: string;
  deposit_withheld: number;
  penalty_amount: number;
  applicable_statutes: string[];
}

interface StateInfo {
  state_name: string;
  itemization_deadline: number;
  mailing_requirements?: string;
}

function EmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseId = searchParams.get('case_id');
  const sessionId = searchParams.get('session_id');
  
  const [email, setEmail] = useState<EmailData | null>(null);
  const [outcome, setOutcome] = useState<OutcomeData | null>(null);
  const [stateInfo, setStateInfo] = useState<StateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    if (sessionId) {
      verifyPaymentAndLoadEmail();
    } else if (caseId) {
      loadEmail();
    } else {
      setError('No case ID or session ID provided');
      setLoading(false);
    }
  }, [sessionId, caseId]);

  const verifyPaymentAndLoadEmail = async () => {
    try {
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyResult.error || 'Payment verification failed');
      }

      await loadEmail(verifyResult.case_id);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify payment');
      setLoading(false);
    }
  };

  const loadEmail = async (overrideCaseId?: string) => {
    try {
      const idToUse = overrideCaseId || caseId;
      
      if (!idToUse) {
        throw new Error('No case ID available');
      }

      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: idToUse })
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          router.push(`/summary?case_id=${idToUse}`);
          return;
        }
        throw new Error(result.error || 'Failed to generate email');
      }

      setEmail(result.email);
      setOutcome(result.outcome);
      setStateInfo(result.state_info);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${fieldName} copied!`, {
        duration: 3000,
        position: 'top-right',
        icon: '✓',
        style: {
          background: '#16a34a',
          color: '#fff',
          fontWeight: '500',
        },
      });
    } catch (err) {
      toast.error('Failed to copy', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const downloadAsText = () => {
    if (!email) return;
    
    const content = `Subject: ${email.subject}\n\nTo: ${email.send_to_email}\n\n${email.body}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demand-letter.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Letter downloaded!', {
      duration: 2000,
      position: 'top-right',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-4xl mx-auto">
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
            <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4" />
            <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-48 mx-auto" />
          </div>

          {/* Skeleton Letter */}
          <SkeletonLetter />
        </div>
      </div>
    );
  }

  if (error || !email || !outcome || !stateInfo) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 animate-fadeIn">
        <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-error-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-h3 text-neutral-900 mb-2">Error</h2>
          <p className="text-body text-neutral-600 mb-6">{error || 'Failed to generate email'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <Toaster />
      
      {/* Success Celebration */}
      {showCelebration && sessionId && (
        <SuccessCelebration onComplete={() => setShowCelebration(false)} />
      )}

      <div className="max-w-4xl mx-auto">
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
            <div className="w-16 h-1 bg-success-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-success-600 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 font-medium text-neutral-900">Summary</span>
            </div>
            <div className="w-16 h-1 bg-primary-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 font-medium text-neutral-900">Letter</span>
            </div>
          </div>
        </div>

        {/* Success Header with Animation */}
        <div className="text-center mb-8">
          <AnimatedCheckmark className="mb-4" />
          <h1 className="text-h1 text-neutral-900 mb-2">
            Your Demand Letter is Ready
          </h1>
          <p className="text-body-lg text-neutral-600">
            Copy the text below or download as a file
          </p>
        </div>

        {/* Case Outcome Summary */}
        <div className="bg-info-50 border border-info-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-info-900 mb-2">Your Case Strength</h3>
          <p className="text-info-800 mb-4">{outcome.explanation}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-info-700">Amount withheld:</span>
              <span className="ml-2 font-semibold text-info-900">{formatCurrency(outcome.deposit_withheld)}</span>
            </div>
            <div>
              <span className="text-info-700">Potential recovery:</span>
              <span className="ml-2 font-semibold text-info-900">{formatCurrency(outcome.penalty_amount)}</span>
            </div>
          </div>
        </div>

        {/* Email Subject */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-4 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-700">Subject Line</label>
            <button
              onClick={() => copyToClipboard(email.subject, 'Subject')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 active:scale-95 transition-all duration-300 min-h-[44px]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Subject
            </button>
          </div>
          <div className="bg-neutral-50 rounded-md p-4 font-mono text-sm text-neutral-900">
            {email.subject}
          </div>
        </div>

        {/* Send To */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-4 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-700">Send To</label>
            <button
              onClick={() => copyToClipboard(email.send_to_email, 'Email address')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 active:scale-95 transition-all duration-300 min-h-[44px]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Email
            </button>
          </div>
          <div className="bg-neutral-50 rounded-md p-4 font-mono text-sm text-neutral-900">
            {email.send_to_email}
          </div>
        </div>

        {/* Email Body */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-700">Letter Body</label>
            <button
              onClick={() => copyToClipboard(email.body, 'Letter body')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 active:scale-95 transition-all duration-300 min-h-[44px]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Body
            </button>
          </div>
          <div className="bg-neutral-50 rounded-md p-4 max-h-96 overflow-y-auto scrollbar-thin">
            <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-900 leading-relaxed">
              {email.body}
            </pre>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mb-8">
          <button
            onClick={downloadAsText}
            className="inline-flex items-center px-6 py-3 border-2 border-neutral-300 shadow-sm text-base font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 active:scale-95 transition-all duration-300 min-h-[44px]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download as Text File
          </button>
        </div>

        {/* Instructions Checklist */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Next Steps</h3>
          
          <div className="space-y-4">
            {[
              { step: 1, title: 'Review and customize', desc: 'Add your property address and contact details where indicated (marked with brackets)' },
              { step: 2, title: 'Send via email', desc: `Copy the text and send to your landlord's email address: ${email.send_to_email}` },
              ...(stateInfo.mailing_requirements ? [{ step: 3, title: `Follow ${stateInfo.state_name} requirements`, desc: stateInfo.mailing_requirements }] : []),
              { step: stateInfo.mailing_requirements ? 4 : 3, title: 'Keep records', desc: 'Save a copy of the sent email and any responses for your records' },
              { step: stateInfo.mailing_requirements ? 5 : 4, title: 'Attach supporting documents', desc: 'If you have photos, receipts, or other evidence, attach them to your email' },
            ].map((item) => (
              <div key={item.step} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                  {item.step}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal References */}
        <div className="bg-neutral-100 rounded-lg p-6 mb-6">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">Legal References</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            {outcome.applicable_statutes.map((statute, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                {statute}
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-warning-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-warning-800">
              <p className="font-semibold mb-1">Important Legal Disclaimer</p>
              <p>This letter is provided for educational and informational purposes only and does not constitute legal advice. While this tool uses California law to generate your letter, every case is unique. For specific legal guidance, consult with a licensed attorney in your area.</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 mb-4">
            Questions? Issues? We're here to help.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Return to Home
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <EmailPageContent />
    </Suspense>
  );
}
