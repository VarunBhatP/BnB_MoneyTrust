import React from 'react';

interface FlowDetailsProps {
  data: any; // Replace with actual type if known
  selectedLevel: 'department' | 'project' | 'vendor';
}

const FlowDetails: React.FC<FlowDetailsProps> = ({ data, selectedLevel }) => {
  return (
    <div className="flow-details">
      <h3>Flow Details ({selectedLevel})</h3>
      {/* Placeholder for details */}
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
};

export default FlowDetails;