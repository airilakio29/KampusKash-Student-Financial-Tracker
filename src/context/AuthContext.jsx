import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
import {
  fetchUserProfile,
  saveFullUserProfile
} from '../services/profileService';

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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const baseUser = formatFirebaseUser(firebaseUser);
        setUser(baseUser);

        // Fetch cloud profile from Firestore to enrich with bio, monthlyBudget, etc.
        try {
          const cloudProfile = await fetchUserProfile(firebaseUser.uid);
          if (cloudProfile) {
            setUser(prev => prev ? ({
              ...prev,
              ...cloudProfile,
              username: cloudProfile.username || prev.username,
              avatar: cloudProfile.avatar || prev.avatar
            }) : null);
          }
        } catch (err) {
          console.warn('Failed to load cloud profile on auth state change', err);
        }
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
      try {
        const cloudProfile = await fetchUserProfile(res.user.id);
        if (cloudProfile) {
          setUser(prev => prev ? ({ ...prev, ...cloudProfile }) : null);
        }
      } catch (err) {
        console.warn('Failed to fetch cloud profile post-login', err);
      }
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
      try {
        const cloudProfile = await fetchUserProfile(res.user.id);
        if (cloudProfile) {
          setUser(prev => prev ? ({ ...prev, ...cloudProfile }) : null);
        }
      } catch (err) {
        console.warn('Failed to fetch cloud profile post-Google login', err);
      }
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

  const updateUserProfile = useCallback((newDetails) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        ...newDetails,
        username: newDetails.username || prev.username,
        avatar: newDetails.avatar || prev.avatar
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save user cache', e);
      }
      return updated;
    });
  }, []);

  const saveProfile = useCallback(async (profileData) => {
    if (!user?.id) return { success: false, error: 'No user authenticated.' };
    updateUserProfile(profileData);
    return await saveFullUserProfile(user.id, profileData);
  }, [user, updateUserProfile]);

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
    updateUserProfile,
    saveProfile
  }), [user, isAuthResolved, updateUserProfile, saveProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
