import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export interface DashboardData {
  totalBudget: number;
  institutionCount: number;
  activeProjects: number;
  transparencyScore: number;
  budgetOverview: any; // Replace with specific type if available
  recentTransactions: {
    id: string;
    amount: number;
    description: string;
    date: string;
  }[];
}

export const useDashboardData = () => {
  return useQuery<DashboardData, Error>(
    ['dashboardData'],
    () => apiService.getDashboardData(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
};