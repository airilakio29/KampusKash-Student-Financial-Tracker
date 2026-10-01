import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  auth, 
  onAuthStateChanged,
  isFirebaseConfigured
} from '../firebase';
import { loadSavedTheme } from '../utils/themeEngine';
import {
  formatFirebaseUser,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as authLoginWithGoogle,
  sendPasswordReset,
  logoutUser
} from '../services/authService';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'student_tracker_user';
const LEGACY_KEYS = [
  'student_tracker_auth_state'
];

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
    const res = await loginWithEmail(email, password);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const signupWithFirebase = async (email, password, displayName, university) => {
    const res = await registerWithEmail(email, password, displayName, university);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const loginWithGoogle = async () => {
    const res = await authLoginWithGoogle();
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const resetPasswordWithFirebase = async (email) => {
    return await sendPasswordReset(email);
  };

  const logout = async () => {
    try {
      await logoutUser();
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
