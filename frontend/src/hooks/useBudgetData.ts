import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { BudgetFlowData } from '../types';

export const useBudgetData = (institutionId?: string) => {
  return useQuery<BudgetFlowData, Error>(
    ['budgetData', institutionId],
    () => apiService.getBudgetData(institutionId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
};