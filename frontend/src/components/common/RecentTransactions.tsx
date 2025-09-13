import React from 'react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            <span>{tx.description}</span>
            <span>{tx.amount}</span>
            <span>{tx.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;