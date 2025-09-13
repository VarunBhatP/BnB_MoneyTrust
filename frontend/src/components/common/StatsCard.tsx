import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="stats-card">
      <div className="icon">{icon}</div>
      <div className="content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
        <p className="trend">{trend}</p>
      </div>
    </div>
  );
};

export default StatsCard;