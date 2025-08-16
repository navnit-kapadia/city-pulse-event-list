import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { enableNetwork, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

enableNetwork(db).catch((error) => {
  console.log('Error enabling Firestore network:', error);
});

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get fresh ID token (auto-refreshes if needed)
export const getFreshIdToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    // Force refresh to get latest token
    const idToken = await currentUser.getIdToken(true);
    return idToken;
  } catch (error) {
    console.error('Error getting fresh ID token:', error);
    return null;
  }
};

// Sign in with existing Firebase session using stored token
export const restoreFirebaseSession = async (userUid: string): Promise<boolean> => {
  try {
    // Check if user is already signed in
    if (auth.currentUser && auth.currentUser.uid === userUid) {
      console.log('User already signed in');
      return true;
    }

    // Wait for auth state to be determined
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user && user.uid === userUid) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error('Error restoring Firebase session:', error);
    return false;
  }
};
