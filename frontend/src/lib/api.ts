import { getCookie } from './cookies';
import { AUTH_TOKEN } from '@/hooks/useAuthForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bnb-backend-api.onrender.com';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, cache, next } = options;

  // Get the auth token from cookies
  const token = typeof window !== 'undefined' ? getCookie(AUTH_TOKEN) : null;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...headers,
    },
    credentials: 'include', // Important for cookies to be sent with requests
    cache,
    next,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) =>
    apiRequest<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: userData,
    }),
};

// Example API (you can expand this with more endpoints)
export const api = {
  // Add more API endpoints here as needed
  getExample: () => apiRequest<any>('/api/example'),
};
