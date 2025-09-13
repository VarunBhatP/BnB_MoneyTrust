export interface Institution {
  id: string;
  name: string;
  type: 'government' | 'education' | 'healthcare' | 'nonprofit';
  logo?: string;
}

export interface Budget {
  id: string;
  institutionId: string;
  title: string;
  totalAmount: number;
  fiscalYear: string;
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  budgetId: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  description?: string;
}

export interface Project {
  id: string;
  departmentId: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  description?: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  vendorId: string;
  amount: number;
  transactionDate: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  documentUrl?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  registrationNumber: string;
  verified: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer' | 'citizen';
  institutionId?: string;
}

export interface BudgetFlowData {
  budget: Budget;
  departments: Department[];
  projects: Project[];
  transactions: Transaction[];
  vendors: Vendor[];
}

export interface SearchFilters {
  institutionId?: string;
  department?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  status?: string;
}
