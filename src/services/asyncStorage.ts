import { Event } from '@/types/event';
import { User } from '@/types/user';

const STORAGE_KEYS = {
  user: 'cityPulse_user',
  favorites: 'cityPulse_favorites',
  preferences: 'cityPulse_preferences',
  userSession: 'cityPulse_user_session',
  biometric: 'cityPulse_biometric',
} as const;

interface UserSession {
  firebaseUid: string;
  userData: User;
  savedAt: string;
  expiresAt: string;
}

interface BiometricCredential {
  firebaseUid: string;
  credentialId: string;
  createdAt: string;
}

interface UserPreferences {
  userId: string;
  [key: string]: any;
}

class AsyncStorageService {
  private async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      throw error;
    }
  }

  private async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      throw error;
    }
  }

  // User session management for biometric login
  async saveUserSession(firebaseUid: string, userData: User): Promise<void> {
    try {
      const sessionData: UserSession = {
        firebaseUid,
        userData,
        savedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      };
      await this.setItem(STORAGE_KEYS.userSession, JSON.stringify(sessionData));
      console.log('User session saved for biometric login');
    } catch (error) {
      console.error('Failed to save user session:', error);
      throw error;
    }
  }

  async getUserSession(): Promise<{ firebaseUid: string; userData: User } | null> {
    try {
      const data = await this.getItem(STORAGE_KEYS.userSession);
      if (!data) return null;

      const sessionData: UserSession = JSON.parse(data);

      // Check if session is expired
      if (new Date() > new Date(sessionData.expiresAt)) {
        await this.removeItem(STORAGE_KEYS.userSession);
        return null;
      }

      return {
        firebaseUid: sessionData.firebaseUid,
        userData: sessionData.userData,
      };
    } catch (error) {
      console.error('Failed to get user session:', error);
      return null;
    }
  }

  // Biometric credential management
  async saveBiometricCredential(firebaseUid: string, credentialId: string): Promise<void> {
    try {
      const biometricData: BiometricCredential = {
        firebaseUid,
        credentialId,
        createdAt: new Date().toISOString(),
      };
      await this.setItem(STORAGE_KEYS.biometric, JSON.stringify(biometricData));
      console.log('Biometric credential linked to Firebase user:', firebaseUid);
    } catch (error) {
      console.error('Failed to save biometric credential:', error);
      throw error;
    }
  }

  async getBiometricCredential(): Promise<BiometricCredential | null> {
    try {
      const data = await this.getItem(STORAGE_KEYS.biometric);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get biometric credential:', error);
      return null;
    }
  }

  async clearBiometricData(): Promise<void> {
    try {
      await this.removeItem(STORAGE_KEYS.biometric);
      await this.removeItem(STORAGE_KEYS.userSession);
      console.log('Biometric data cleared');
    } catch (error) {
      console.error('Failed to clear biometric data:', error);
    }
  }

  // User management
  async saveUser(user: User): Promise<void> {
    if (!user?.uid) {
      throw new Error('User object must have uid property');
    }

    try {
      await this.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      console.log('User saved successfully:', user.uid);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await this.getItem(STORAGE_KEYS.user);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  // Favorites management
  async saveFavoriteEvent(event: Event): Promise<void> {
    if (!event?.id) {
      throw new Error('Event object must have id property');
    }

    try {
      const favorites = await this.getFavoriteEvents();
      const isAlreadyFavorite = favorites.some((fav) => fav.id === event.id);

      if (!isAlreadyFavorite) {
        favorites.push(event);
        await this.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
        console.log('Favorite event saved:', event.id);
      }
    } catch (error) {
      console.error('Failed to save favorite event:', error);
      throw error;
    }
  }

  async removeFavoriteEvent(eventId: string): Promise<void> {
    try {
      const favorites = await this.getFavoriteEvents();
      const updatedFavorites = favorites.filter((event) => event.id !== eventId);
      await this.setItem(STORAGE_KEYS.favorites, JSON.stringify(updatedFavorites));
      console.log('Favorite event removed:', eventId);
    } catch (error) {
      console.error('Failed to remove favorite event:', error);
      throw error;
    }
  }

  async getFavoriteEvents(): Promise<Event[]> {
    try {
      const favoritesData = await this.getItem(STORAGE_KEYS.favorites);
      return favoritesData ? JSON.parse(favoritesData) : [];
    } catch (error) {
      console.error('Failed to get favorite events:', error);
      return [];
    }
  }

  // User preferences management
  async saveUserPreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    try {
      const prefData: UserPreferences = { userId, ...preferences };
      await this.setItem(STORAGE_KEYS.preferences, JSON.stringify(prefData));
      console.log('User preferences saved');
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const prefData = await this.getItem(STORAGE_KEYS.preferences);
      return prefData ? JSON.parse(prefData) : null;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return null;
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await this.removeItem(STORAGE_KEYS.user);
      await this.removeItem(STORAGE_KEYS.favorites);
      await this.removeItem(STORAGE_KEYS.preferences);
      console.log('All storage cleared');
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
}

export const asyncStorageService = new AsyncStorageService();
