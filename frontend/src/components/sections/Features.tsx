import { Feature } from '@/types';

const features: Feature[] = [
  {
    icon: '🔍',
    title: 'Complete Transparency',
    description: 'Track every penny as it moves through departments, projects, and vendors with our blockchain-powered ledger.'
  },
  {
    icon: '🔒',
    title: 'Immutable Records',
    description: 'Every transaction is permanently recorded and verifiable, eliminating doubts about data authenticity.'
  },
  {
    icon: '📊',
    title: 'Real-time Tracking',
    description: 'See funds move in real-time with our intuitive visualizations that make complex financial data easy to understand.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Financial Transparency
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-md text-2xl">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
