export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  favoriteEvents: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  notifications: boolean;
  theme: 'light' | 'dark';
  location: {
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
