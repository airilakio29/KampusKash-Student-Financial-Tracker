/**
 * KampusKash Settings Service
 * Handles user preferences, tutorial completion, and theme persistence.
 * Phase 1: LocalStorage + Firestore users/{userId} settings.
 * Future (Phase 2): AWS DynamoDB settings partition.
 */

import { db, doc, setDoc, getDoc } from '../firebase.js';

const TUTORIAL_KEY_PREFIX = 'kampuskash_tutorial_completed_';

/**
 * Save user preferences to Firestore and LocalStorage.
 */
export async function saveUserSettings(userId, settings) {
  if (!userId) return;
  try {
    localStorage.setItem(`kampuskash_settings_${userId}`, JSON.stringify(settings));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

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
  try {
    localStorage.setItem(`${TUTORIAL_KEY_PREFIX}${userId}`, String(completed));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

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
  // Check local cache first
  try {
    const local = localStorage.getItem(`${TUTORIAL_KEY_PREFIX}${userId}`);
    if (local !== null) return local === 'true';
  } catch {
    // fallback
  }

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
