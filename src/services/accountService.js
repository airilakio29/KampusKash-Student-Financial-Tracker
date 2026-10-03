/**
 * KiroKash Account Service
 * Manages user financial accounts (Savings, Current, E-wallet, Cash, Credit Card, Other).
 * Phase 1: source = "manual" only.
 * Future: source can be "bank" or "imported".
 */

import { db, doc, setDoc } from '../firebase.js';

export const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'other', label: 'Other' }
];

export const ACCOUNT_TYPE_ICONS = {
  savings: '🏦',
  current: '💳',
  ewallet: '📱',
  cash: '💵',
  credit_card: '💳',
  other: '📋'
};

/**
 * Create a new account object with proper defaults.
 */
export function createAccount({ accountName, institution, accountType, balance, currency = 'RM' }) {
  const now = new Date().toISOString();
  return {
    accountId: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    accountName: (accountName || '').trim(),
    institution: (institution || '').trim(),
    accountType: accountType || 'savings',
    balance: Number(balance) || 0,
    currency: currency || 'RM',
    source: 'manual',
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Validate an account before saving.
 * Returns an error string or null if valid.
 */
export function validateAccount(account) {
  if (!account.accountName || !account.accountName.trim()) {
    return 'Please enter an account name';
  }
  if (account.accountName.trim().length > 50) {
    return 'Account name must be 50 characters or fewer';
  }
  const bal = Number(account.balance);
  if (isNaN(bal) || !isFinite(bal)) {
    return 'Please enter a valid balance amount';
  }
  const validTypes = ACCOUNT_TYPES.map(t => t.value);
  if (!validTypes.includes(account.accountType)) {
    return 'Please select a valid account type';
  }
  return null;
}

/**
 * Persist accounts array to Firestore.
 */
export async function persistAccounts(userId, accounts) {
  if (!userId || !db) return;
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, {
      accounts,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to persist accounts to Firestore', e);
  }
}

/**
 * Calculate total balance across all accounts.
 */
export function calculateTotalAccountBalance(accounts = []) {
  return accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
}

/**
 * Get account by ID.
 */
export function getAccountById(accounts = [], accountId) {
  return accounts.find(a => a.accountId === accountId) || null;
}
