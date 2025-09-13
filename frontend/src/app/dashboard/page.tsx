'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your BnB Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-gray-600">Total Bookings</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-gray-600">This Month's Revenue</h3>
            <p className="text-2xl font-bold">$4,250</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-gray-600">Occupancy Rate</h3>
            <p className="text-2xl font-bold">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
