import axios from 'axios';
import { BudgetFlowData, SearchFilters } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000/api';

const apiClient = axios.create({    
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Dashboard data
  getDashboardData: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },

  // Budget flow data
  getBudgetData: async (institutionId?: string) => {
    const url = institutionId 
      ? `/budget/${institutionId}/flow` 
      : '/budget/flow';
    const response = await apiClient.get<BudgetFlowData>(url);
    return response.data;
  },

  // Search transactions
  searchTransactions: async (filters: SearchFilters) => {
    const response = await apiClient.post('/search', filters);
    return response.data;
  },

  // Get institutions
  getInstitutions: async () => {
    const response = await apiClient.get('/institutions');
    return response.data;
  },

  // Get reports
  getReports: async (type: string, params: any) => {
    const response = await apiClient.get(`/reports/${type}`, { params });
    return response.data;
  },

  // Upload budget file
  uploadBudgetFile: async (file: File, institutionId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('institutionId', institutionId);
    
    const response = await apiClient.post('/upload/budget', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
