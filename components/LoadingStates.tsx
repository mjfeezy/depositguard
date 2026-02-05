// Phase 3: Complete Loading State Components

// Spinner Component
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Skeleton Card
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-5/6" />
          <div className="h-4 bg-neutral-200 rounded w-4/5" />
        </div>
        <div className="flex justify-between pt-4 border-t border-neutral-200">
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCaseSummary() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 animate-pulse">
      <div className="h-6 bg-neutral-200 rounded w-1/3 mb-6"></div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between py-3 border-b border-neutral-100">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonLetter() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
        <div className="h-10 bg-neutral-200 rounded w-32"></div>
      </div>
      <div className="bg-neutral-50 rounded-md p-4">
        <div className="space-y-2">
          <div className="h-3 bg-neutral-200 rounded w-full"></div>
          <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTestimonial() {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-lg p-6 animate-pulse">
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-5 h-5 bg-neutral-200 rounded-full mr-1"></div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-neutral-200 rounded w-full"></div>
        <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
        <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
      </div>
      <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between pt-4 border-t border-primary-100">
        <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

// Progress Bar (for Stripe redirect)
export function ProgressBar({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-primary-600 h-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Full Page Loading Overlay (for payment redirect)
export function PaymentRedirectLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
          <Spinner size="lg" className="text-primary-600" />
        </div>
        <h2 className="text-h3 text-neutral-900 mb-2">
          Redirecting to secure payment...
        </h2>
        <p className="text-body text-neutral-600 mb-6">
          Please don't close this window
        </p>
        <ProgressBar progress={75} />
      </div>
    </div>
  );
}

// Page Transition Wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}

// Add to globals.css:
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out;
// }
