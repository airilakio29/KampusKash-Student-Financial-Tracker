/**
 * KampusKash Profile Service
 * Manages user profile details and ensures technical IDs (Firebase UID, hashes)
 * are NEVER displayed as user-facing names.
 * Priority:
 * 1. Saved profile name
 * 2. Auth display name
 * 3. Derived name from email
 * 4. Fallback "Student"
 */

import { db, doc, setDoc, getDoc } from '../firebase.js';
import { isTechnicalId } from './authService.js';

/**
 * Cleanly format any user's display name, guaranteeing no technical ID or hash is shown.
 */
export function getCleanDisplayName(user) {
  if (!user) return 'Student';
  const name = user.username || user.displayName;
  if (!name || isTechnicalId(name) || name === user.id) {
    if (user.email) {
      const emailPrefix = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      return emailPrefix
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
        .trim() || 'Student';
    }
    return 'Student';
  }
  return name;
}

/**
 * Update user profile in Firestore and return updated data.
 */
export async function updateUserProfile(userId, profileUpdates) {
  if (!userId || !db) return profileUpdates;
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, {
      profile: profileUpdates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return profileUpdates;
  } catch (err) {
    console.warn('Failed to update profile in Firestore', err);
    throw err;
  }
}

/**
 * Fetch user profile from Firestore.
 */
export async function fetchUserProfile(userId) {
  if (!userId || !db) return null;
  const userDocRef = doc(db, 'users', userId);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data().profile || null;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch profile from Firestore', err);
    return null;
  }
}
