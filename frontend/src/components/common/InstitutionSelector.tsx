import React from 'react';

interface InstitutionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({ value, onChange }) => {
  // Placeholder institutions
  const institutions = ['Institution A', 'Institution B', 'Institution C'];

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select Institution</option>
      {institutions.map((inst) => (
        <option key={inst} value={inst}>{inst}</option>
      ))}
    </select>
  );
};

export default InstitutionSelector;