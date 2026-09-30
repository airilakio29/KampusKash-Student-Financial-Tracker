import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  isFirebaseConfigured
} from '../firebase';
import { loadSavedTheme } from '../utils/themeEngine';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'student_tracker_user';
const LEGACY_KEYS = [
  'student_tracker_auth_state'
];

const formatFirebaseUser = (fbUser, overrides = {}) => {
  let name = fbUser.displayName;
  if (!name || name === fbUser.uid || name.length > 25) {
    name = fbUser.email ? fbUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : 'Student';
  }
  name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').trim();

  return {
    id: fbUser.uid,
    username: name || 'Student',
    email: fbUser.email || '',
    university: 'Campus Student',
    avatar: fbUser.photoURL || '🎓',
    isFirebaseUser: true,
    currency: 'RM',
    ...overrides
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthResolved, setIsAuthResolved] = useState(!isFirebaseConfigured);

  // Initialize theme on app load
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Purge any session left over from the old local-only auth scheme
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.error('Failed to clear legacy auth state', e);
    }
  }, []);

  // Firebase is the single source of truth for the session
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(formatFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsAuthResolved(true);
    });

    return () => unsubscribe();
  }, []);

  // Cache the resolved profile for offline display only; never for access control
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save user state', e);
    }
  }, [user]);

  const loginWithFirebase = async (email, password) => {
    if (!auth) return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const formattedUser = formatFirebaseUser(userCredential.user);
      setUser(formattedUser);
      return { success: true, user: formattedUser };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const signupWithFirebase = async (email, password, displayName, university) => {
    if (!auth) return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      if (displayName) {
        await updateProfile(fbUser, { displayName });
      }
      const formattedUser = formatFirebaseUser(fbUser, {
        username: displayName || email.split('@')[0],
        university: university || 'Campus Student'
      });
      setUser(formattedUser);
      return { success: true, user: formattedUser };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const formattedUser = formatFirebaseUser(result.user, {
        username: result.user.displayName || 'Google Student',
        university: 'Google Auth Student',
        avatar: result.user.photoURL || '🌐'
      });
      setUser(formattedUser);
      return { success: true, user: formattedUser };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const resetPasswordWithFirebase = async (email) => {
    if (!auth) return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const logout = async () => {
    try {
      if (auth) await firebaseSignOut(auth);
    } catch (e) {
      console.error('Firebase signout failed', e);
    }
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Failed to clear user cache', e);
    }
  };

  const updateUserProfile = (newDetails) => {
    setUser(prev => prev ? ({ ...prev, ...newDetails }) : null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isAuthResolved,
    isFirebaseConfigured,
    loginWithFirebase,
    signupWithFirebase,
    loginWithGoogle,
    resetPasswordWithFirebase,
    logout,
    updateUserProfile
  }), [user, isAuthResolved]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
