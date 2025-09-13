import React from 'react';

interface BudgetFlowChartProps {
  data: any; // Replace with specific type if available
  level: 'department' | 'project' | 'vendor';
}

const BudgetFlowChart: React.FC<BudgetFlowChartProps> = ({ data, level }) => {
  return (
    <div className="budget-flow-chart">
      <h3>Budget Flow Chart ({level})</h3>
      {/* Placeholder for chart implementation */}
      <p>Chart data: {JSON.stringify(data)}</p>
    </div>
  );
};

export default BudgetFlowChart;