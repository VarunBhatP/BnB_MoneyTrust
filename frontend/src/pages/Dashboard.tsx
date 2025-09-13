import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import StatsCard from '../components/common/StatsCard';
import BudgetOverview from '../components/charts/BudgetOverview';
import RecentTransactions from '../components/common/RecentTransactions';
import { DollarSign, Building2, Users, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error loading dashboard data</div>;

  const stats = {
    totalBudget: dashboardData?.totalBudget || 0,
    institutions: dashboardData?.institutionCount || 0,
    activeProjects: dashboardData?.activeProjects || 0,
    transparency: dashboardData?.transparencyScore || 0,
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Financial Transparency Dashboard</h1>
        <p>Track and monitor money flow across institutions with complete transparency</p>
      </header>

      <div className="stats-grid">
        <StatsCard
          title="Total Budget"
          value={`$${stats.totalBudget.toLocaleString()}`}
          icon={<DollarSign />}
          trend={"+5.2%"}
        />
        <StatsCard
          title="Institutions"
          value={stats.institutions.toString()}
          icon={<Building2 />}
          trend={"+2"}
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={<Users />}
          trend={"+12%"}
        />
        <StatsCard
          title="Transparency Score"
          value={`${stats.transparency}%`}
          icon={<FileText />}
          trend={"+3.1%"}
        />
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <BudgetOverview data={dashboardData?.budgetOverview} />
        </div>
        
        <div className="recent-section">
          <RecentTransactions transactions={dashboardData?.recentTransactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
