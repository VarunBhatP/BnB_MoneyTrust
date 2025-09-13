import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { ApiError } from '@/types/api';
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies';

export const AUTH_TOKEN = 'auth_token';

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getCookie(AUTH_TOKEN);
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated;
};

// Logout function
export const logout = () => {
  deleteCookie(AUTH_TOKEN);
  window.location.href = '/auth/login';
};

export const useAuthForm = (isLogin: boolean) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: any) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let response;
      
      if (isLogin) {
        response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      // Store the token in HTTP-only cookie
      if (response?.token) {
        setCookie(AUTH_TOKEN, response.token, 7); // 7 days expiration
        // Redirect to dashboard or home page
        router.push('/dashboard');
      }
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
};
