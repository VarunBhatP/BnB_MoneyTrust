const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Get Started in Three Simple Steps
          </p>
        </div>

        <div className="mt-20">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                1
              </div>
              <div className="ml-16">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Sign Up</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create your account and verify your email address to get started.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                2
              </div>
              <div className="ml-16">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Connect Data</h3>
                <p className="mt-2 text-base text-gray-500">
                  Link your financial accounts or upload transaction data securely.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                3
              </div>
              <div className="ml-16">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Start Tracking</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor transactions and generate reports with just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
