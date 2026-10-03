/**
 * KiroKash Settings Service
 * Handles user preferences, tutorial completion, and theme persistence.
 * Phase 1: LocalStorage + Firestore users/{userId} settings.
 * Future (Phase 2): AWS DynamoDB settings partition.
 */

import { db, doc, setDoc, getDoc } from '../firebase.js';

const TUTORIAL_KEY_PREFIX = 'kirokash_tutorial_completed_';
const LEGACY_TUTORIAL_KEY_PREFIX = 'kampuskash_tutorial_completed_';

const memStore = new Map();

function safeGetItem(key) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return memStore.get(key) ?? null;
}

function safeSetItem(key, val) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem(key, String(val));
    }
  } catch {
    // fallback
  }
  memStore.set(key, String(val));
}

/**
 * Save user preferences to Firestore and LocalStorage.
 */
export async function saveUserSettings(userId, settings) {
  if (!userId) return;
  safeSetItem(`kirokash_settings_${userId}`, JSON.stringify(settings));
  safeSetItem(`kampuskash_settings_${userId}`, JSON.stringify(settings));

  if (db) {
    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(userDocRef, {
        settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to save settings to Firestore', err);
    }
  }
}

/**
 * Update onboarding / tutorial completion status for the user in Firestore.
 */
export async function setTutorialCompletion(userId, completed) {
  if (!userId) return;
  safeSetItem(`${TUTORIAL_KEY_PREFIX}${userId}`, String(completed));

  if (db) {
    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(userDocRef, {
        tutorialCompleted: Boolean(completed),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync tutorial completion to Firestore', err);
    }
  }
}

/**
 * Retrieve tutorial completion status for a user.
 */
export async function getTutorialCompletion(userId) {
  if (!userId) return false;
  const local = safeGetItem(`${TUTORIAL_KEY_PREFIX}${userId}`) ?? safeGetItem(`${LEGACY_TUTORIAL_KEY_PREFIX}${userId}`);
  if (local !== null) return local === 'true';

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists() && typeof snap.data().tutorialCompleted === 'boolean') {
        return snap.data().tutorialCompleted;
      }
    } catch (err) {
      console.warn('Failed to get tutorial status from Firestore', err);
    }
  }

  return false;
}

export const ONBOARDING_KEY_PREFIX = 'kirokash_onboarding_completed_';
export const ONBOARDING_STEP_PREFIX = 'kirokash_onboarding_step_';

/**
 * Persist onboarding completion status and current step to Firestore and LocalStorage.
 */
export async function setOnboardingStatus(userId, { completed = false, step = 'profile' }) {
  if (!userId) return;
  safeSetItem(`${ONBOARDING_KEY_PREFIX}${userId}`, String(completed));
  safeSetItem(`${ONBOARDING_STEP_PREFIX}${userId}`, step);
  if (completed) {
    safeSetItem(`${TUTORIAL_KEY_PREFIX}${userId}`, 'true');
  }

  if (db) {
    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(userDocRef, {
        onboardingCompleted: Boolean(completed),
        onboardingStep: step,
        tutorialCompleted: Boolean(completed),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync onboarding status to Firestore', err);
    }
  }
}

/**
 * Retrieve onboarding completion status and current step for a user.
 */
export async function getOnboardingStatus(userId) {
  if (!userId) return { completed: false, step: 'profile' };

  const localCompleted = safeGetItem(`${ONBOARDING_KEY_PREFIX}${userId}`);
  const localStep = safeGetItem(`${ONBOARDING_STEP_PREFIX}${userId}`);

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data.onboardingCompleted === 'boolean') {
          return {
            completed: data.onboardingCompleted,
            step: data.onboardingStep || (data.onboardingCompleted ? 'completed' : 'profile')
          };
        }
      }
    } catch (err) {
      console.warn('Failed to get onboarding status from Firestore', err);
    }
  }

  if (localCompleted !== null) {
    return {
      completed: localCompleted === 'true',
      step: localStep || (localCompleted === 'true' ? 'completed' : 'profile')
    };
  }

  return { completed: false, step: 'profile' };
}

