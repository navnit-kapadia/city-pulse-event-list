import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isLoading, error, isAuthenticated, login, logout, updateUser, initAuth } =
    useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };
};
