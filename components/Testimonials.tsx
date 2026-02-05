export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Los Angeles, CA",
      amount: "$1,850",
      quote: "My landlord returned nothing from my $2,000 deposit with no explanation. I sent the letter from DepositGuard, and within a week I had a check for the full amount. Absolutely worth it.",
      rating: 5,
      outcome: "Full deposit recovered"
    },
    {
      name: "James T.",
      location: "San Diego, CA",
      amount: "$2,400",
      quote: "The letter was professional and cited the exact laws my landlord violated. He initially refused, but after receiving it, he sent back 80% of my deposit plus an apology.",
      rating: 5,
      outcome: "80% recovered + penalties"
    },
    {
      name: "Maria G.",
      location: "San Francisco, CA",
      amount: "$3,200",
      quote: "I didn't know my landlord was required to provide itemization within 21 days. This tool showed me I had a strong case, and the letter got results. I recovered my deposit plus statutory damages.",
      rating: 5,
      outcome: "Deposit + 2x penalties"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 text-neutral-900 mb-4">
            Real Results from Real Tenants
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            Thousands of California tenants have successfully recovered their deposits using our letters
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-neutral-700 mb-4 italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Outcome Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-800 mb-4">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {testimonial.outcome}
              </div>

              {/* Amount Recovered */}
              <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {testimonial.amount}
                  </div>
                  <div className="text-tiny text-neutral-600">Recovered</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-tiny text-neutral-600">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-4">
            Join thousands of tenants who've successfully recovered their deposits
          </p>
          <a
            href="/intake"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all duration-300"
          >
            Get Your Demand Letter
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
