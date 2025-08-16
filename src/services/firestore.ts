import { doc, setDoc, getDoc, updateDoc, enableNetwork } from 'firebase/firestore';

import { db } from './firebase';

import { User } from '@/types/user';

export interface BiometricData {
  credentialId: string;
  enabled: boolean;
  registeredAt: string;
  deviceInfo?: string;
}

// Save user profile to Firestore
export const saveUserProfile = async (uid: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userData, { merge: true });
    console.log('User profile saved to Firestore');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Save biometric credential to Firestore
export const saveBiometricCredential = async (uid: string, credentialId: string) => {
  return retryFirestoreOperation(async () => {
    const userRef = doc(db, 'users', uid);
    const biometricData: BiometricData = {
      credentialId,
      enabled: true,
      registeredAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
    };

    await updateDoc(userRef, {
      biometric: biometricData,
    });

    console.log('Biometric credential saved to Firestore');
  });
};

export const retryFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure network is enabled
      await enableNetwork(db);
      return await operation();
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (error.code === 'unavailable' || error.message.includes('offline')) {
        if (attempt < maxRetries) {
          console.log('Retrying Firestore operation...');
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }

      throw error;
    }
  }
  throw new Error('All retry attempts failed');
};

// Get biometric data from Firestore
export const getBiometricData = async (uid: string): Promise<BiometricData | null> => {
  return retryFirestoreOperation(async () => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        return userData.biometric || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting biometric data:', error);
      return null;
    }
  });
};

// Check if user has biometric enabled
export const checkBiometricEnabled = async (): Promise<{ enabled: boolean; uid?: string }> => {
  try {
    // In a real app, you'd have an index on email to find the user
    // For now, we'll use a simple approach with known UIDs
    // You should implement proper user lookup by email
    return { enabled: false };
  } catch (error) {
    console.error('Error checking biometric status:', error);
    return { enabled: false };
  }
};

// Disable biometric authentication
export const disableBiometricAuth = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      'biometric.enabled': false,
      'biometric.disabledAt': new Date().toISOString(),
    });

    console.log('Biometric authentication disabled');
  } catch (error) {
    console.error('Error disabling biometric auth:', error);
    throw error;
  }
};
