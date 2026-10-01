/**
 * KampusKash Authentication Service
 * Wraps Firebase Authentication methods and provides user formatting
 * Phase 1: Firebase Auth & Google Login
 * Future (Phase 2): AWS Cognito
 */

import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  isFirebaseConfigured
} from '../firebase.js';

/**
 * Check if a string looks like a technical UID or hex hash
 */
export function isTechnicalId(str) {
  if (!str || typeof str !== 'string') return true;
  const clean = str.replace(/[\s-_]/g, '');
  // 20+ hex characters or 28+ alphanumeric chars with no vowels/spaces
  if (/^[a-f0-9]{20,}$/i.test(clean)) return true;
  if (/^[a-zA-Z0-9]{28,}$/.test(clean)) return true;
  return false;
}

/**
 * Format raw Firebase User into clean application user object.
 * Priority for display name:
 * 1. Saved profile displayName
 * 2. Firebase Authentication displayName
 * 3. Clean name derived from email prefix
 * 4. Generic fallback "Student"
 * Never returns UID or technical hash.
 */
export function formatFirebaseUser(fbUser, overrides = {}) {
  if (!fbUser) return null;

  let name = overrides.username || fbUser.displayName;
  if (!name || name === fbUser.uid || isTechnicalId(name)) {
    if (fbUser.email) {
      name = fbUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    } else {
      name = 'Student';
    }
  }

  // Capitalize words
  name = name
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .trim() || 'Student';

  return {
    id: fbUser.uid,
    username: name,
    email: fbUser.email || '',
    university: overrides.university || 'Campus Student',
    avatar: overrides.avatar || fbUser.photoURL || '🎓',
    isFirebaseUser: true,
    currency: overrides.currency || 'RM',
    ...overrides
  };
}

export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
  }
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = formatFirebaseUser(cred.user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
}

export async function registerWithEmail(email, password, displayName, university) {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const user = formatFirebaseUser(cred.user, {
      username: displayName || email.split('@')[0],
      university: university || 'Campus Student'
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
}

export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
  }
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = formatFirebaseUser(cred.user, {
      username: cred.user.displayName || 'Google Student',
      university: 'Campus Student',
      avatar: cred.user.photoURL || '🌐'
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
}

export async function sendPasswordReset(email, customSettings) {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
  }
  try {
    const actionCodeSettings = customSettings || {
      url: 'https://kampuskash.vercel.app/reset-password',
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
}

export async function verifyResetCode(actionCode) {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
  }
  try {
    const email = await verifyPasswordResetCode(auth, actionCode);
    return { success: true, email };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
}

export async function confirmNewPassword(actionCode, newPassword) {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, code: 'auth/not-configured', error: 'Firebase is not configured.' };
  }
  try {
    await confirmPasswordReset(auth, actionCode, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
}

export { confirmPasswordReset };

export async function logoutUser() {
  if (auth) {
    await firebaseSignOut(auth);
  }
}
