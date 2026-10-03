import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getCafes,
  getVouchers,
  calculateDistanceKm,
  filterAndSortCafes,
  evaluateBudgetFit,
  IPOH_CENTER
} from '../src/services/exploreService.js';

describe('Explore Service & Cafe Logic', () => {
  it('should fetch at least 12 cafes asynchronously with all required fields', async () => {
    const cafes = await getCafes();
    assert.ok(cafes.length >= 12, 'Must have at least 12 cafes');

    for (const cafe of cafes) {
      assert.ok(cafe.id, 'Cafe must have id');
      assert.ok(cafe.name, 'Cafe must have name');
      assert.ok(cafe.area, 'Cafe must have area');
      assert.ok(typeof cafe.latitude === 'number', 'Latitude must be number');
      assert.ok(typeof cafe.longitude === 'number', 'Longitude must be number');
      assert.ok(cafe.shortDescription, 'Must have shortDescription');
      assert.ok(cafe.category, 'Must have category');
      assert.ok(cafe.minBudget > 0, 'minBudget must be > 0');
      assert.ok(cafe.maxBudget >= cafe.minBudget, 'maxBudget >= minBudget');
      assert.ok(['budget', 'mid', 'premium'].includes(cafe.priceTier), 'priceTier valid');
      assert.ok(typeof cafe.rating === 'number', 'Rating must be number');
      assert.ok(cafe.openingHours, 'Must have openingHours');
      assert.ok(typeof cafe.hasWifi === 'boolean', 'hasWifi must be boolean');
      assert.ok(typeof cafe.hasStudySeating === 'boolean', 'hasStudySeating must be boolean');
      assert.ok(typeof cafe.xPercent === 'number' && cafe.xPercent >= 0 && cafe.xPercent <= 100, 'xPercent must be 0-100');
      assert.ok(typeof cafe.yPercent === 'number' && cafe.yPercent >= 0 && cafe.yPercent <= 100, 'yPercent must be 0-100');
    }
  });

  it('should fetch at least 8 vouchers linked to cafes with all required fields', async () => {
    const vouchers = await getVouchers();
    assert.ok(vouchers.length >= 8, 'Must have at least 8 vouchers');

    for (const voucher of vouchers) {
      assert.ok(voucher.id, 'Voucher must have id');
      assert.ok(voucher.cafeId, 'Voucher must have cafeId');
      assert.ok(voucher.title, 'Voucher must have title');
      assert.ok(voucher.discountType, 'Must have discountType');
      assert.ok(voucher.discountValue, 'Must have discountValue');
      assert.ok(voucher.code, 'Must have code');
      assert.ok(voucher.expiryDate, 'Must have expiryDate');
      assert.ok(voucher.terms, 'Must have terms');
      assert.ok(['active', 'expiring_soon', 'expired'].includes(voucher.status), 'status valid');
    }
  });

  it('should calculate realistic distance in km within Ipoh', () => {
    // Distance from center to Old Town cafe (~1-2km)
    const dist = calculateDistanceKm(IPOH_CENTER.latitude, IPOH_CENTER.longitude, 4.5968, 101.0776);
    assert.ok(dist >= 0 && dist < 15, `Distance ${dist}km is reasonable for Ipoh`);
  });

  it('should filter cafes by search query correctly', async () => {
    const cafes = await getCafes();
    const vouchers = await getVouchers();

    const filtered = filterAndSortCafes(cafes, { searchQuery: 'Old Town' }, vouchers);
    assert.ok(filtered.length > 0, 'Should find Old Town cafes');
    for (const c of filtered) {
      const match = c.name.includes('Old Town') || c.area === 'Old Town' || c.shortDescription.includes('Old Town');
      assert.ok(match, 'Cafe should match Old Town query');
    }
  });

  it('should filter cafes by budget preset and study friendly', async () => {
    const cafes = await getCafes();
    const vouchers = await getVouchers();

    const under10 = filterAndSortCafes(cafes, { budgetPreset: 'under10' }, vouchers);
    for (const c of under10) {
      assert.ok(c.minBudget <= 10, 'Min budget should be <= 10');
    }

    const studyOnly = filterAndSortCafes(cafes, { studyFriendly: true }, vouchers);
    for (const c of studyOnly) {
      assert.ok(c.hasWifi && c.hasStudySeating, 'Must have wifi and study seating');
    }
  });

  it('should evaluate budget suitability accurately against remaining food budget', () => {
    const cafe = { minBudget: 10, maxBudget: 20 };

    // Case 1: No food budget set
    const noBudget = evaluateBudgetFit(cafe, { hasBudget: false });
    assert.equal(noBudget.status, 'no_budget');

    // Case 2: Fits completely (remaining >= maxBudget)
    const fits = evaluateBudgetFit(cafe, { hasBudget: true, remaining: 50 });
    assert.equal(fits.status, 'fits');

    // Case 3: Tight (minBudget <= remaining < maxBudget)
    const tight = evaluateBudgetFit(cafe, { hasBudget: true, remaining: 15 });
    assert.equal(tight.status, 'tight');

    // Case 4: Over budget (remaining < minBudget)
    const over = evaluateBudgetFit(cafe, { hasBudget: true, remaining: 5 });
    assert.equal(over.status, 'over');
  });
});
