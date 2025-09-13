import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bringing Clarity to Financial Transparency
            </h1>
            <p className="text-xl text-blue-100 mb-10">
              Track every dollar, build trust, and ensure accountability with our blockchain-powered financial transparency platform. 
              From government budgets to school funds, we make financial data accessible, understandable, and verifiable for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/auth/register" 
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started <span className="ml-2">→</span>
              </Link>
              <Link 
                href="#how-it-works" 
                className="flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-white/[0.04]" />
    </section>
  );
};

export default Hero;
