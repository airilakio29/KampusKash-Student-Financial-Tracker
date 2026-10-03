import React from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  Wifi,
  BookOpen,
  Check,
  Ticket,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Copy,
  ExternalLink,
  Utensils
} from 'lucide-react';

export default function CafeDetailsModal({
  cafe,
  isOpen,
  onClose,
  vouchers = [],
  foodBudgetStatus = null,
  onAddToExpenses,
  onLocateOnMap,
  onCopyVoucherCode,
  onSaveVoucher,
  isVoucherSaved,
  onNavigateToBudgets
}) {
  if (!isOpen || !cafe) return null;

  const cafeVouchers = vouchers.filter((v) => v.cafeId === cafe.id);

  const isBudgetSet = foodBudgetStatus?.hasBudget;
  const remainingFood = isBudgetSet ? foodBudgetStatus.remaining : 0;
  const budgetLimit = isBudgetSet ? foodBudgetStatus.limit : 0;
  const budgetFits = isBudgetSet && remainingFood >= cafe.maxBudget;
  const budgetTight = isBudgetSet && remainingFood >= cafe.minBudget && remainingFood < cafe.maxBudget;
  const budgetOver = isBudgetSet && remainingFood < cafe.minBudget;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content cafe-details-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="cafe-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="cafe-area-tag">{cafe.area}</span>
              <span className="cafe-category-tag">{cafe.category}</span>
              {cafe.isHalal && <span className="cafe-halal-tag">Halal Certified / Friendly</span>}
            </div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {cafe.name}
            </h2>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Cafe Visual Banner / Specialty Highlight */}
        <div
          className="cafe-featured-banner"
          style={{
            background: `linear-gradient(135deg, rgba(42, 31, 53, 0.95), ${cafe.accentColor || '#624873'}40)`,
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>
              Featured Student Specialty
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Utensils size={15} color="var(--primary-light)" /> {cafe.featuredSpecialty || 'Specialty Coffee & Bakes'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>
            <Star size={14} fill="#FBBF24" color="#FBBF24" />
            <strong style={{ fontSize: '0.9rem' }}>{cafe.rating.toFixed(1)}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({cafe.reviewCount} student reviews)</span>
          </div>
        </div>

        {/* Short Description */}
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          {cafe.shortDescription}
        </p>

        {/* Info Grid: Address, Hours, Amenities */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.25rem'
          }}
        >
          <div className="cafe-detail-box">
            <div className="detail-box-label">
              <MapPin size={14} /> Address
            </div>
            <div className="detail-box-val">{cafe.address}</div>
          </div>

          <div className="cafe-detail-box">
            <div className="detail-box-label">
              <Clock size={14} /> Hours
            </div>
            <div className="detail-box-val">{cafe.openingHours}</div>
          </div>
        </div>

        {/* Amenities Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className={`amenity-chip-large ${cafe.hasWifi ? 'active' : ''}`}>
            <Wifi size={14} /> {cafe.hasWifi ? 'High Speed WiFi' : 'No Public WiFi'}
          </span>
          <span className={`amenity-chip-large ${cafe.hasStudySeating ? 'active' : ''}`}>
            <BookOpen size={14} /> {cafe.hasStudySeating ? 'Study Seating & Plugs' : 'Limited Study Seating'}
          </span>
          <span className="amenity-chip-large active">
            💰 Typical: RM {cafe.typicalAmount}
          </span>
        </div>

        {/* KiroKash Student Budget Health Analysis (Requirement 7.1) */}
        <div
          className="budget-analysis-card"
          style={{
            padding: '1.15rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-light)' }}>
              Student Budget Analysis
            </span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-main)', fontSize: '0.75rem' }}>
              Price Tier: {cafe.priceTier.toUpperCase()}
            </span>
          </div>

          {isBudgetSet ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Estimated Spend:</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
                  RM {cafe.minBudget} - RM {cafe.maxBudget} (avg RM {cafe.typicalAmount})
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Remaining Food Budget:</span>
                <strong style={{ fontSize: '1rem', color: budgetOver ? 'var(--expense)' : 'var(--income)' }}>
                  RM {remainingFood.toFixed(2)} / RM {budgetLimit.toFixed(2)}
                </strong>
              </div>

              {budgetFits ? (
                <div className="budget-status-box fits" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--income-bg)', color: 'var(--income)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Fits comfortably within your remaining monthly Food allowance.</span>
                </div>
              ) : budgetTight ? (
                <div className="budget-status-box tight" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--warning-bg)', color: '#FBBF24', fontSize: '0.85rem', fontWeight: 600 }}>
                  <AlertCircle size={16} />
                  <span>Tight budget: fits minimum spend (RM {cafe.minBudget}), but keep an eye on extra sides.</span>
                </div>
              ) : (
                <div className="budget-status-box over" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--expense-bg)', color: 'var(--expense)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <AlertCircle size={16} />
                  <span>Exceeds your remaining Food budget. Consider a budget-friendly option or adjusting your allowance.</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                You have not set a <strong>Food & Dining</strong> monthly budget yet. Setting one helps you track whether visiting this cafe fits your monthly allowance.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  if (onNavigateToBudgets) onNavigateToBudgets();
                }}
              >
                Go to Budgets View <ExternalLink size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Linked Vouchers for this cafe */}
        {cafeVouchers.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Ticket size={16} color="var(--primary-light)" /> Available Deals at {cafe.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {cafeVouchers.map((v) => {
                const isSaved = isVoucherSaved(v.id);
                const isExpired = v.status === 'expired';
                return (
                  <div
                    key={v.id}
                    className={`mini-voucher-card ${isExpired ? 'expired' : ''}`}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <span className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.72rem' }}>
                          {v.discountValue}
                        </span>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{v.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Min spend: RM {v.minSpend} • {v.terms}
                      </div>
                    </div>

                    {!isExpired && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onCopyVoucherCode(v.code)}
                          title="Copy voucher promo code"
                        >
                          <Copy size={12} /> {v.code}
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => onSaveVoucher(v.id)}
                          title={isSaved ? 'Saved to wallet' : 'Save voucher'}
                        >
                          {isSaved ? 'Saved ★' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              if (onLocateOnMap) onLocateOnMap(cafe.id);
            }}
          >
            <MapPin size={16} /> Locate on Map
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onAddToExpenses(cafe);
              }}
              style={{ fontWeight: 700 }}
            >
              <PlusCircle size={16} /> Add to Expenses (~RM {cafe.typicalAmount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
