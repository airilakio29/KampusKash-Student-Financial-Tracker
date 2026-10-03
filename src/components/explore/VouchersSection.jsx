import React, { useState } from 'react';
import {
  Ticket,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function VouchersSection({
  vouchers = [],
  savedVoucherIds = [],
  onCopyCode,
  onToggleSave,
  onSelectCafe,
  copiedCode
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'saved'

  // Filter vouchers based on selected tab
  const displayedVouchers = vouchers.filter((v) => {
    if (filterTab === 'saved') {
      return savedVoucherIds.includes(v.id);
    }
    if (filterTab === 'active') {
      return v.status !== 'expired';
    }
    return true; // 'all' shows all (with expired visually muted)
  });

  const savedCount = savedVoucherIds.length;

  return (
    <section className="explore-vouchers-section" aria-labelledby="vouchers-heading">
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        {/* Section Header & Tabs */}
        <div className="vouchers-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={18} color="var(--gold-sparkle)" />
              <h3 id="vouchers-heading" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Campus Student Vouchers & Perks
              </h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Exclusive cafe discounts, buy-1-free-1 deals, and cashback perks for student budgets in Ipoh.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="vouchers-filter-tabs">
            <button
              type="button"
              className={`voucher-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All Deals ({vouchers.length})
            </button>
            <button
              type="button"
              className={`voucher-tab-btn ${filterTab === 'active' ? 'active' : ''}`}
              onClick={() => setFilterTab('active')}
            >
              Active Only ({vouchers.filter((v) => v.status !== 'expired').length})
            </button>
            <button
              type="button"
              className={`voucher-tab-btn ${filterTab === 'saved' ? 'active' : ''}`}
              onClick={() => setFilterTab('saved')}
            >
              <Bookmark size={13} /> Saved ({savedCount})
            </button>
          </div>
        </div>

        {/* Empty State for Filter Tab */}
        {displayedVouchers.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Ticket size={36} color="var(--primary-light)" style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {filterTab === 'saved' ? 'No Saved Vouchers Yet' : 'No Vouchers Available'}
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              {filterTab === 'saved'
                ? 'Click the bookmark icon on any voucher card to save it for your next visit.'
                : 'Check back soon for new student deals and flash discounts.'}
            </p>
          </div>
        ) : (
          <div className="vouchers-grid">
            {displayedVouchers.map((voucher) => {
              const isSaved = savedVoucherIds.includes(voucher.id);
              const isExpired = voucher.status === 'expired';
              const isExpiringSoon = voucher.status === 'expiring_soon';
              const isCopied = copiedCode === voucher.code;

              return (
                <div
                  key={voucher.id}
                  className={`voucher-card ${isExpired ? 'expired-voucher' : ''}`}
                >
                  {/* Top Bar */}
                  <div className="voucher-card-top">
                    <button
                      type="button"
                      className="voucher-cafe-link"
                      onClick={() => onSelectCafe(voucher.cafeId)}
                      title={`Find ${voucher.cafeName} on map`}
                    >
                      📍 {voucher.cafeName}
                    </button>

                    <button
                      type="button"
                      className={`voucher-save-btn ${isSaved ? 'saved' : ''}`}
                      onClick={() => onToggleSave(voucher.id)}
                      title={isSaved ? 'Remove from saved' : 'Save voucher to wallet'}
                      aria-label={isSaved ? 'Remove voucher from saved' : 'Save voucher'}
                    >
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>

                  {/* Discount Value Badge */}
                  <div className="voucher-discount-badge-row">
                    <span className={`voucher-value-badge ${isExpiringSoon ? 'expiring' : isExpired ? 'muted' : 'active'}`}>
                      {voucher.discountValue}
                    </span>
                    <span className="voucher-min-spend">
                      Min spend: RM {Number(voucher.minSpend).toFixed(2)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="voucher-title">{voucher.title}</h4>

                  {/* Terms */}
                  <p className="voucher-terms">{voucher.terms}</p>

                  {/* Bottom Bar: Promo Code & Expiry */}
                  <div className="voucher-card-footer">
                    <div className="voucher-code-wrapper">
                      <span className="voucher-code-text">{voucher.code}</span>
                      <button
                        type="button"
                        className={`voucher-copy-btn ${isCopied ? 'copied' : ''}`}
                        onClick={() => onCopyCode(voucher.code)}
                        disabled={isExpired}
                        aria-label={`Copy code ${voucher.code}`}
                        title="Copy code to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className={`voucher-expiry-label ${isExpiringSoon ? 'expiring' : isExpired ? 'expired' : ''}`}>
                      <Clock size={12} />
                      <span>{voucher.expiryCountdown || voucher.expiryDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
