export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];

  if (!confirmPassword) {
    errors.push('Password confirmation is required');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];

  if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSearchInput = (keyword: string, city: string): ValidationResult => {
  const errors: string[] = [];

  if (!keyword.trim() && !city.trim()) {
    errors.push('Please enter a keyword or city to search');
  }

  if (keyword && keyword.trim().length < 2) {
    errors.push('Keyword must be at least 2 characters long');
  }

  if (city && city.trim().length < 2) {
    errors.push('City must be at least 2 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
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
