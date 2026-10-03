/**
 * KampusKash Explore Service
 * Manages fetching cafes, vouchers, saved vouchers, and filtering logic.
 * Designed to be swapped for real API endpoints seamlessly.
 */

import { MOCK_CAFES, MOCK_VOUCHERS } from '../data/exploreMock.js';
import { db, doc, setDoc } from '../firebase.js';

export const SAVED_VOUCHERS_KEY_PREFIX = 'student_tracker_saved_vouchers_';

// Ipoh Reference Center (Padang Ipoh / Station / Old Town)
export const IPOH_CENTER = {
  latitude: 4.5975,
  longitude: 101.0901,
  name: 'Ipoh Central'
};

/**
 * Fetch list of cafes asynchronously.
 */
export async function getCafes() {
  // Simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...MOCK_CAFES];
}

/**
 * Fetch list of vouchers asynchronously.
 */
export async function getVouchers() {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...MOCK_VOUCHERS];
}

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Retrieve saved voucher IDs for a user from LocalStorage.
 */
export function getSavedVoucherIds(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${SAVED_VOUCHERS_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to parse saved vouchers from localStorage', err);
    return [];
  }
}

/**
 * Persist saved voucher IDs to LocalStorage and Firestore.
 */
export async function persistSavedVoucherIds(userId, voucherIds) {
  if (!userId) return;
  try {
    localStorage.setItem(`${SAVED_VOUCHERS_KEY_PREFIX}${userId}`, JSON.stringify(voucherIds));
  } catch (err) {
    console.warn('Failed to save vouchers to localStorage', err);
  }

  if (db) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        savedVouchers: voucherIds,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync saved vouchers to Firestore', err);
    }
  }
}

/**
 * Toggle saving a voucher. Returns updated array of saved voucher IDs.
 */
export async function toggleSaveVoucherId(userId, voucherId) {
  const current = getSavedVoucherIds(userId);
  const exists = current.includes(voucherId);
  const updated = exists ? current.filter((id) => id !== voucherId) : [...current, voucherId];
  await persistSavedVoucherIds(userId, updated);
  return updated;
}

/**
 * Filter and sort cafes based on user filters.
 */
export function filterAndSortCafes(cafes = [], options = {}, vouchers = []) {
  const {
    searchQuery = '',
    category = 'all',
    budgetPreset = 'all', // 'all', 'under10', '10to20', 'over20'
    hasVoucher = false,
    studyFriendly = false,
    sortBy = 'rating', // 'rating', 'cheapest', 'nearest'
    userLat = IPOH_CENTER.latitude,
    userLng = IPOH_CENTER.longitude
  } = options;

  const voucherCafeIdSet = new Set(
    vouchers.filter((v) => v.status !== 'expired').map((v) => v.cafeId)
  );

  const query = searchQuery.trim().toLowerCase();

  let result = cafes.filter((cafe) => {
    // 1. Search Query (Matches name, area, specialty, description)
    if (query) {
      const matchName = cafe.name.toLowerCase().includes(query);
      const matchArea = cafe.area.toLowerCase().includes(query);
      const matchCat = cafe.category.toLowerCase().includes(query);
      const matchDesc = cafe.shortDescription.toLowerCase().includes(query);
      const matchSpec = (cafe.featuredSpecialty || '').toLowerCase().includes(query);
      if (!matchName && !matchArea && !matchCat && !matchDesc && !matchSpec) {
        return false;
      }
    }

    // 2. Category Filter
    if (category !== 'all' && cafe.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 3. Budget Preset Filter
    if (budgetPreset === 'under10') {
      if (cafe.minBudget > 10) return false;
    } else if (budgetPreset === '10to20') {
      if (cafe.minBudget > 20 || cafe.maxBudget < 10) return false;
    } else if (budgetPreset === 'over20') {
      if (cafe.maxBudget < 20) return false;
    }

    // 4. Has Voucher Filter
    if (hasVoucher && !voucherCafeIdSet.has(cafe.id)) {
      return false;
    }

    // 5. Study Friendly Filter
    if (studyFriendly && (!cafe.hasWifi || !cafe.hasStudySeating)) {
      return false;
    }

    return true;
  });

  // Calculate distance for each cafe
  result = result.map((cafe) => ({
    ...cafe,
    distanceKm: calculateDistanceKm(userLat, userLng, cafe.latitude, cafe.longitude)
  }));

  // Sorting
  result.sort((a, b) => {
    if (sortBy === 'cheapest') {
      return a.minBudget - b.minBudget;
    }
    if (sortBy === 'nearest') {
      return a.distanceKm - b.distanceKm;
    }
    // Default: Top Rated
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.reviewCount - a.reviewCount;
  });

  return result;
}

/**
 * Check how a cafe fits into the user's remaining food budget.
 */
export function evaluateBudgetFit(cafe, foodBudgetStatus) {
  if (!foodBudgetStatus || !foodBudgetStatus.hasBudget) {
    return {
      status: 'no_budget',
      label: 'No Food Budget Set',
      message: 'Set a Food budget to track affordability'
    };
  }

  const remaining = Number(foodBudgetStatus.remaining) || 0;

  if (remaining >= cafe.maxBudget) {
    return {
      status: 'fits',
      label: 'Fits your budget',
      message: `RM ${remaining.toFixed(2)} remaining in Food budget`
    };
  }

  if (remaining >= cafe.minBudget) {
    return {
      status: 'tight',
      label: 'Fits minimum budget',
      message: `RM ${remaining.toFixed(2)} remaining in Food budget`
    };
  }

  return {
    status: 'over',
    label: 'Over your budget',
    message: `Exceeds current Food budget (RM ${remaining.toFixed(2)} left)`
  };
}
