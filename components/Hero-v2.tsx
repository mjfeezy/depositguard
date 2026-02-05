import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute right-0 top-0 h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-600" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-body-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Trusted by 2,800+ California Tenants
            </div>

            {/* Headline - Using design system display size */}
            <h1 className="text-4xl sm:text-5xl lg:text-display font-bold text-neutral-900 leading-tight mb-6">
              Get Your Security Deposit
              <span className="block text-primary-600">Back from Your Landlord</span>
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Professional demand letters based on California law. Most landlords respond within 3 days because they know the law is on your side.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {/* PRIMARY CTA */}
              <Link
                href="/intake"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Generate My Letter — $49
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              {/* SECONDARY CTA */}
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-neutral-300 text-base font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-300"
              >
                See How It Works
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - Hero Image/Illustration Area */}
          <div className="relative">
            {/* Placeholder for hero image/illustration */}
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl shadow-xl overflow-hidden aspect-square">
              {/* Mockup of demand letter */}
              <div className="absolute inset-0 p-8 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-4">
                    {/* Letter header */}
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Your Demand Letter</div>
                        <div className="text-tiny text-neutral-600">Professional • Legal • Effective</div>
                      </div>
                    </div>

                    {/* Letter preview lines */}
                    <div className="space-y-3">
                      <div className="h-2 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-2 bg-neutral-200 rounded w-full"></div>
                      <div className="h-2 bg-neutral-200 rounded w-5/6"></div>
                      <div className="h-2 bg-primary-200 rounded w-2/3 mt-4"></div>
                      <div className="h-2 bg-neutral-200 rounded w-full"></div>
                      <div className="h-2 bg-neutral-200 rounded w-4/5"></div>
                      <div className="h-2 bg-neutral-200 rounded w-full"></div>
                      <div className="h-2 bg-neutral-200 rounded w-3/4"></div>
                    </div>

                    {/* Checkmark badges */}
                    <div className="flex gap-2 pt-4 border-t border-neutral-100">
                      <span className="inline-flex items-center px-2 py-1 rounded text-tiny font-medium bg-success-100 text-success-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Legal
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-tiny font-medium bg-info-100 text-info-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        CA Law
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats cards */}
              <div className="absolute top-8 -left-4 bg-white rounded-lg shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="text-3xl font-bold text-success-600">$1,850</div>
                <div className="text-tiny text-neutral-600">Avg. Recovery</div>
              </div>

              <div className="absolute bottom-8 -right-4 bg-white rounded-lg shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary-600">3 days</div>
                <div className="text-tiny text-neutral-600">Avg. Response</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
