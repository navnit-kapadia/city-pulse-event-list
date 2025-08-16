import { create } from 'zustand';

import { asyncStorageService } from '@/services/asyncStorage';
import {
  onAuthStateChange,
  signInWithGoogle,
  logout,
  restoreFirebaseSession,
} from '@/services/firebase';
import { getBiometricData, saveUserProfile } from '@/services/firestore';
import { User, AuthState } from '@/types/user';

interface AuthStore extends AuthState {
  login: () => Promise<void>;
  loginWithBiometric: (credentialId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  initAuth: () => void;
  clearError: () => void;
}

const createDefaultUser = (firebaseUser: any): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email!,
  displayName: firebaseUser.displayName || '',
  photoURL: firebaseUser.photoURL || '',
  phoneNumber: firebaseUser.phoneNumber || '',
  emailVerified: firebaseUser.emailVerified,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  favoriteEvents: [],
  preferences: {
    language: 'en',
    notifications: true,
    theme: 'light',
    location: {},
  },
});

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  login: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await signInWithGoogle();

      if (result.user) {
        const userData = createDefaultUser(result.user);

        await asyncStorageService.saveUser(userData);
        await saveUserProfile(result.user.uid, userData);

        const biometricUsers = JSON.parse(
          localStorage.getItem('cityPulse_biometric_users') || '[]'
        );

        if (!biometricUsers.includes(userData.email)) {
          const biometricData = await getBiometricData(result.user.uid);
          if (biometricData?.enabled) {
            biometricUsers.push(userData.email);
            localStorage.setItem('cityPulse_biometric_users', JSON.stringify(biometricUsers));
          }
        }

        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  loginWithBiometric: async () => {
    try {
      set({ isLoading: true, error: null });

      const biometricData = await asyncStorageService.getBiometricCredential();

      if (!biometricData) {
        throw new Error('No biometric credential found. Please register biometric login first.');
      }

      const userSession = await asyncStorageService.getUserSession();

      if (!userSession || userSession.firebaseUid !== biometricData.firebaseUid) {
        throw new Error(
          'User session expired. Please login with Google again to refresh your session.'
        );
      }

      const sessionRestored = await restoreFirebaseSession(biometricData.firebaseUid);

      if (!sessionRestored) {
        console.log('Firebase session not active, using stored session data');
      }

      const userData = userSession.userData;
      userData.lastLoginAt = new Date().toISOString();

      await asyncStorageService.saveUser(userData);
      await asyncStorageService.saveUserSession(userData.uid, userData);

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('Biometric login successful for user:', userData.email);
    } catch (error) {
      console.error('Biometric login error:', error);
      set({
        error: error instanceof Error ? error.message : 'Biometric login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await logout();
      await asyncStorageService.clearAll();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
    }
  },

  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...userData };
      asyncStorageService.saveUser(updatedUser);
      asyncStorageService.saveUserSession(updatedUser.uid, updatedUser);
      set({ user: updatedUser });
    }
  },

  clearError: () => set({ error: null }),

  initAuth: () => {
    set({ isLoading: true });

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          let userData = await asyncStorageService.getUser();

          if (!userData) {
            userData = createDefaultUser(firebaseUser);
            await asyncStorageService.saveUser(userData);
            await asyncStorageService.saveUserSession(firebaseUser.uid, userData);
          } else {
            userData.lastLoginAt = new Date().toISOString();
            await asyncStorageService.saveUser(userData);
            await asyncStorageService.saveUserSession(firebaseUser.uid, userData);
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          const userSession = await asyncStorageService.getUserSession();

          if (userSession) {
            set({
              user: userSession.userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        set({
          isLoading: false,
          error: 'Authentication failed',
          isAuthenticated: false,
          user: null,
        });
      }
    });

    return unsubscribe;
  },
}));
