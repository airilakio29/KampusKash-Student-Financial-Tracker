import React, { useEffect, useRef } from 'react';
import { Star, Wifi, BookOpen, Ticket, AlertCircle, CheckCircle2, ArrowRight, PlusCircle, ExternalLink } from 'lucide-react';

export default function CafeCard({
  cafe,
  isSelected,
  onSelect,
  onOpenDetails,
  onAddToExpenses,
  vouchers = [],
  foodBudgetStatus = null,
  onNavigateToBudgets
}) {
  const cardRef = useRef(null);

  // Auto scroll card into view when selected from the map
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [isSelected]);

  const cafeVouchers = vouchers.filter((v) => v.cafeId === cafe.id && v.status !== 'expired');
  const hasVoucher = cafeVouchers.length > 0;

  // Evaluate budget status
  const remainingFood = foodBudgetStatus?.hasBudget ? foodBudgetStatus.remaining : null;
  const isBudgetSet = foodBudgetStatus?.hasBudget;

  const budgetFits = isBudgetSet && remainingFood >= cafe.maxBudget;
  const budgetTight = isBudgetSet && remainingFood >= cafe.minBudget && remainingFood < cafe.maxBudget;
  const budgetOver = isBudgetSet && remainingFood < cafe.minBudget;

  return (
    <div
      ref={cardRef}
      className={`cafe-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(cafe.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(cafe.id);
        }
      }}
      aria-label={`${cafe.name} in ${cafe.area}`}
    >
      {/* Top Card Row */}
      <div className="cafe-card-header">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
            <span className="cafe-area-tag">{cafe.area}</span>
            <span className="cafe-category-tag">{cafe.category}</span>
            {hasVoucher && (
              <span className="cafe-voucher-tag">
                <Ticket size={12} /> {cafeVouchers[0].discountValue}
              </span>
            )}
          </div>
          <h4 className="cafe-name">{cafe.name}</h4>
        </div>

        <div className="cafe-rating-badge">
          <Star size={13} fill="#FBBF24" color="#FBBF24" />
          <span>{cafe.rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="cafe-description">{cafe.shortDescription}</p>

      {/* Meta Bar: Budget & Features */}
      <div className="cafe-meta-bar">
        <div className="cafe-budget-badge">
          <span className="budget-label">Budget:</span>
          <strong>RM {cafe.minBudget} - RM {cafe.maxBudget}</strong>
        </div>

        <div className="cafe-amenities">
          {cafe.hasWifi && (
            <span className="amenity-chip" title="Fast WiFi Available">
              <Wifi size={13} /> WiFi
            </span>
          )}
          {cafe.hasStudySeating && (
            <span className="amenity-chip" title="Study Desks & Power Plugs">
              <BookOpen size={13} /> Study
            </span>
          )}
          {cafe.distanceKm != null && (
            <span className="amenity-chip" title="Distance from Ipoh Old Town">
              📍 {cafe.distanceKm} km
            </span>
          )}
        </div>
      </div>

      {/* KiroKash Budget Hint (Requirement 7.1) */}
      <div className="cafe-budget-hint-row">
        {isBudgetSet ? (
          budgetFits ? (
            <div className="budget-hint-chip fits">
              <CheckCircle2 size={13} />
              <span>Fits your budget (RM {remainingFood.toFixed(0)} left in Food)</span>
            </div>
          ) : budgetTight ? (
            <div className="budget-hint-chip tight">
              <AlertCircle size={13} />
              <span>Tight budget • Fits min spend (RM {remainingFood.toFixed(0)} left)</span>
            </div>
          ) : (
            <div className="budget-hint-chip over">
              <AlertCircle size={13} />
              <span>Over your budget (Only RM {remainingFood.toFixed(0)} left in Food)</span>
            </div>
          )
        ) : (
          <div className="budget-hint-chip no-budget">
            <span>No Food budget set •</span>
            <button
              type="button"
              className="budget-prompt-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateToBudgets) onNavigateToBudgets();
              }}
            >
              Set in Budgets <ExternalLink size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="cafe-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(cafe);
          }}
          aria-label={`View full details of ${cafe.name}`}
        >
          View Details <ArrowRight size={13} />
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm add-expense-quick-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToExpenses(cafe);
          }}
          title={`Log expense at ${cafe.name} (~RM ${cafe.typicalAmount})`}
          aria-label={`Add ${cafe.name} to expenses`}
        >
          <PlusCircle size={14} />
          <span>Add to expenses</span>
        </button>
      </div>
    </div>
  );
}
