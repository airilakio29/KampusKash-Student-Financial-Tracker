import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'Study Cafe', label: 'Study Cafes' },
  { id: 'Coffee', label: 'Coffee & Brews' },
  { id: 'Local Food', label: 'Local Eats' },
  { id: 'Dessert', label: 'Desserts & Ice' },
  { id: 'Halal Friendly', label: 'Halal Friendly' }
];

const BUDGET_PRESETS = [
  { id: 'all', label: 'Any Budget' },
  { id: 'under10', label: '< RM 10 (Student Saver)' },
  { id: '10to20', label: 'RM 10 - 20 (Standard)' },
  { id: 'over20', label: '> RM 20 (Treat Day)' }
];

export default function ExploreFilters({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  budgetPreset,
  onBudgetPresetChange,
  hasVoucher,
  onHasVoucherToggle,
  studyFriendly,
  onStudyFriendlyToggle,
  sortBy,
  onSortByChange,
  onResetFilters,
  totalResults
}) {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  // Check if any non-default filter is applied
  const isFiltered =
    Boolean(searchQuery.trim()) ||
    category !== 'all' ||
    budgetPreset !== 'all' ||
    hasVoucher ||
    studyFriendly ||
    sortBy !== 'rating';

  return (
    <div className="explore-filters-card card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Top Search & Mobile Collapse Trigger */}
      <div className="explore-filters-top-row">
        {/* Search Box */}
        <div className="explore-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search cafe name, area (Old Town, Bercham...), or specialty..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search cafes"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="btn btn-secondary mobile-filter-toggle"
          onClick={() => setIsMobilePanelOpen((prev) => !prev)}
          aria-expanded={isMobilePanelOpen}
        >
          <SlidersHorizontal size={16} />
          <span>Filters & Sort</span>
          {isMobilePanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Main Filter Controls (Desktop visible, mobile collapsible) */}
      <div className={`explore-filters-body ${isMobilePanelOpen ? 'mobile-visible' : ''}`}>
        <div className="filters-grid-row">
          {/* Category Dropdown */}
          <div className="filter-item">
            <label className="filter-label" htmlFor="explore-category-select">
              Category
            </label>
            <select
              id="explore-category-select"
              className="form-control filter-select"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Presets */}
          <div className="filter-item">
            <label className="filter-label" htmlFor="explore-budget-select">
              Budget Range
            </label>
            <select
              id="explore-budget-select"
              className="form-control filter-select"
              value={budgetPreset}
              onChange={(e) => onBudgetPresetChange(e.target.value)}
            >
              {BUDGET_PRESETS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <label className="filter-label" htmlFor="explore-sort-select">
              Sort By
            </label>
            <select
              id="explore-sort-select"
              className="form-control filter-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <option value="rating">Top Rated (★)</option>
              <option value="cheapest">Cheapest First (Min RM)</option>
              <option value="nearest">Nearest to Old Town</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Toggle Chips & Results Count */}
        <div className="filters-chips-row">
          <div className="filter-chips-group">
            <button
              type="button"
              className={`filter-chip ${hasVoucher ? 'active' : ''}`}
              onClick={onHasVoucherToggle}
              aria-pressed={hasVoucher}
            >
              🎟️ Has Student Voucher
            </button>

            <button
              type="button"
              className={`filter-chip ${studyFriendly ? 'active' : ''}`}
              onClick={onStudyFriendlyToggle}
              aria-pressed={studyFriendly}
            >
              💻 Study Friendly (WiFi + Desks)
            </button>
          </div>

          <div className="filter-summary-actions">
            <span className="results-count-text">
              Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'cafe' : 'cafes'}
            </span>

            {isFiltered && (
              <button
                type="button"
                className="btn btn-secondary btn-sm reset-filters-btn"
                onClick={onResetFilters}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
