export function Stats() {
  const stats = [
    {
      value: "$4.2M+",
      label: "Recovered for Tenants",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Total amount recovered by tenants using our service"
    },
    {
      value: "2,847",
      label: "Cases Filed",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Demand letters generated and sent to landlords"
    },
    {
      value: "87%",
      label: "Success Rate",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Tenants who received full or partial deposit return"
    },
    {
      value: "3 days",
      label: "Average Response Time",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "How long landlords typically take to respond"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 text-white mb-4">
            Proven Results That Speak for Themselves
          </h2>
          <p className="text-body-lg text-blue-100 max-w-2xl mx-auto">
            Our demand letters work because landlords know California law is on your side
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 text-white mb-4">
                {stat.icon}
              </div>

              {/* Value */}
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-blue-100 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-body-sm text-blue-200">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-12">
          <p className="text-body-sm text-blue-200">
            * Statistics based on user-reported outcomes from January 2024 - Present
          </p>
        </div>
      </div>
    </section>
  );
}
