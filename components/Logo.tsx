interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "w-10 h-10", showText = true }: LogoProps) {
  return (
    <div className="flex items-center">
      <svg 
        className={className} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield outline */}
        <path
          d="M50 5 L85 20 L85 45 C85 65 75 80 50 95 C25 80 15 65 15 45 L15 20 L50 5 Z"
          fill="url(#gradient)"
          stroke="#1e40af"
          strokeWidth="3"
        />
        
        {/* Dollar sign */}
        <path
          d="M50 30 L50 70 M45 35 L55 35 C58 35 60 37 60 40 C60 43 58 45 55 45 L45 45 M45 55 L55 55 C58 55 60 57 60 60 C60 63 58 65 55 65 L45 65"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Checkmark in shield */}
        <path
          d="M35 48 L43 56 L65 34"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        
        {/* Gradient definition - Using design system colors */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* primary-500 */}
            <stop offset="100%" stopColor="#2563eb" /> {/* primary-600 */}
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <div className="ml-3">
          <div className="text-xl font-bold text-neutral-900 leading-none">
            DepositGuard
          </div>
          <div className="text-tiny text-neutral-600 leading-none mt-0.5">
            Know Your Rights
          </div>
        </div>
      )}
    </div>
  );
}
