import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-h3 text-neutral-900 mb-2">{title}</h3>
      <p className="text-body text-neutral-600 mb-6 max-w-md mx-auto">{description}</p>
      
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all duration-300"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all duration-300"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

// Specific Empty States

export function CaseNotFoundEmpty() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      }
      title="We couldn't find that case"
      description="The link may be expired or invalid. Try starting a new case to generate your demand letter."
      actionLabel="Start a New Case"
      actionHref="/intake"
    />
  );
}

export function PaymentRequiredEmpty() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      }
      title="Payment Required"
      description="Complete your payment to access your demand letter. Your case information has been saved."
      actionLabel="Complete Payment"
      actionHref="/summary"
    />
  );
}

export function StateNotAvailableEmpty({ state }: { state: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      }
      title={`We're not available in ${state} yet`}
      description="Join our waitlist to be notified when we launch in your state. We're expanding as quickly as we can!"
      actionLabel="Join Waitlist"
      actionHref={`/coming-soon?state=${state}`}
    />
  );
}

export function GenericErrorEmpty({ 
  onRetry 
}: { 
  onRetry?: () => void 
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title="Something went wrong"
      description="We encountered an unexpected error. Please try again or contact support if the problem persists."
      actionLabel={onRetry ? "Try Again" : "Go Home"}
      {...(onRetry ? { onAction: onRetry } : { actionHref: "/" })}
    />
  );
}

export function NoDataEmpty({ 
  message = "No data available",
  description = "There's nothing here yet. Check back later or start by creating something new."
}: {
  message?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      }
      title={message}
      description={description}
    />
  );
}
