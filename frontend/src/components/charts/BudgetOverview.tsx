import React from 'react';

interface BudgetOverviewProps {
  data: any; // Replace with actual type if known
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ data }) => {
  return (
    <div className="budget-overview">
      <h3>Budget Overview Chart</h3>
      {/* Placeholder for chart implementation */}
      <p>Chart data: {JSON.stringify(data)}</p>
    </div>
  );
};

export default BudgetOverview;