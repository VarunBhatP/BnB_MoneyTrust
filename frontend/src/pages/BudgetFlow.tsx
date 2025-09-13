import React, { useState } from 'react';
import { useBudgetData } from '../hooks/useBudgetData';
import BudgetFlowChart from '../components/charts/BudgetFlowChart';
import InstitutionSelector from '../components/common/InstitutionSelector';
import FlowDetails from '../components/common/FlowDetails';
import { Download } from 'lucide-react';

const BudgetFlow: React.FC = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'department' | 'project' | 'vendor'>('department');
  
  const { data: flowData, isLoading } = useBudgetData(selectedInstitution);

  return (
    <div className="budget-flow">
      <header className="page-header">
        <h1>Budget Flow Visualization</h1>
        <p>Follow the money trail from budget allocation to final expenditure</p>
      </header>

      <div className="flow-controls">
        <InstitutionSelector
          value={selectedInstitution}
          onChange={setSelectedInstitution}
        />
        
        <div className="level-selector">
          <label>View Level:</label>
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value as 'department' | 'project' | 'vendor')}
          >
            <option value="department">Department Level</option>
            <option value="project">Project Level</option>
            <option value="vendor">Vendor Level</option>
          </select>
        </div>

        <button className="export-btn">
          <Download size={16} />
          Export Flow Data
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading budget flow data...</p>
        </div>
      ) : (
        <div className="flow-content">
          <div className="flow-chart-container">
            <BudgetFlowChart 
              data={flowData} 
              level={selectedLevel}
            />
          </div>
          
          <div className="flow-sidebar">
            <FlowDetails 
              data={flowData}
              selectedLevel={selectedLevel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetFlow;
