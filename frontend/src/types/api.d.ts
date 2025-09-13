// User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Auth response types
export interface AuthResponse {
  token: string;
  user: User;
}

// Error response
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
