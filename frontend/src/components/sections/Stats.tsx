import { Stat } from '@/types';

const stats: Stat[] = [
  { label: 'Institutions Trust Us', value: '50+' },
  { label: 'Transactions Tracked', value: '1M+' },
  { label: 'Dollars Secured', value: '$500M+' },
  { label: 'Satisfied Users', value: '100K+' }
];

const Stats = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-4xl font-extrabold text-blue-600">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
