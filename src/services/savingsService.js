/**
 * KampusKash Savings Service
 * Handles savings goals creation, validation, progress calculation, and persistence.
 * Phase 1: Local state + Firestore users/{userId} sync.
 * Future (Phase 2): AWS Lambda + DynamoDB.
 */

import { db, doc, setDoc } from '../firebase.js';

/**
 * Create a new savings goal with proper defaults.
 */
export function createSavingsGoal({ title, targetAmount, currentAmount = 0, targetDate }) {
  const now = new Date().toISOString();
  return {
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: (title || '').trim(),
    targetAmount: Math.max(0, Number(targetAmount) || 0),
    currentAmount: Math.max(0, Number(currentAmount) || 0),
    targetDate: targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Validate a savings goal.
 */
export function validateSavingsGoal(goal) {
  if (!goal.title || !goal.title.trim()) {
    return 'Please enter a goal title (e.g. New Laptop)';
  }
  const target = Number(goal.targetAmount);
  if (isNaN(target) || target <= 0 || !isFinite(target)) {
    return 'Please enter a valid target amount greater than RM 0';
  }
  const current = Number(goal.currentAmount || 0);
  if (isNaN(current) || current < 0 || !isFinite(current)) {
    return 'Saved amount cannot be negative or invalid';
  }
  return null;
}

/**
 * Calculate savings progress metrics.
 */
export function calculateSavingsProgress(goal) {
  if (!goal) return { current: 0, target: 0, percentage: 0, remaining: 0, isCompleted: false };

  const current = Math.max(0, Number(goal.currentAmount || 0));
  const target = Math.max(0, Number(goal.targetAmount || 0));
  const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const remaining = Math.max(0, target - current);
  const isCompleted = target > 0 && current >= target;

  return {
    current,
    target,
    percentage: Number(percentage.toFixed(1)),
    remaining,
    isCompleted
  };
}

/**
 * Persist savings goals to Firestore.
 */
export async function persistSavingsGoals(userId, savingsGoals) {
  if (!userId || !db) return;
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, {
      savingsGoals,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to persist savings goals to Firestore', err);
  }
}
