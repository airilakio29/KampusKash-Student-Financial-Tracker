import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Calendar, ShieldCheck, FileText, LogOut, ChevronDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Header({ onOpenMobileMenu, title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const { exportToPDF } = useFinance();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Derive a clean display name — never show UID or technical identifiers
  const displayName = (() => {
    const name = user?.username;
    if (!name) return 'Student';
    // Reject anything that looks like a UID/hash (20+ hex chars)
    if (/^[a-f0-9]{20,}$/i.test(name.replace(/[\s-]/g, ''))) return 'Student';
    return name;
  })();

  const avatarDisplay = (() => {
    const av = user?.avatar;
    if (av && av.startsWith('http')) {
      return displayName.charAt(0).toUpperCase();
    }
    return av || displayName.charAt(0).toUpperCase();
  })();

  const todayStr = new Date().toLocaleDateString('en-MY', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleExportPDF = () => {
    setIsProfileOpen(false);
    exportToPDF(user);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
  };

  return (
    <header className="app-header">
      {/* Left: Hamburger + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn btn-secondary btn-icon header-mobile-menu"
          aria-label="Open navigation menu"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

        <div style={{ minWidth: 0 }}>
          <h2 className="header-page-title">
            {title}
          </h2>
          <div className="header-subtitle">
            <span>Welcome back, <strong>{displayName}</strong> 👋</span>
          </div>
        </div>
      </div>

      {/* Right Desktop: Action Bar */}
      <div className="header-desktop-actions">
        {/* Date Display Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'var(--bg-card-subtle)',
          padding: '0.45rem 0.85rem',
          borderRadius: '20px',
          border: '1px solid var(--border-light)',
          fontSize: '0.82rem',
          color: 'var(--text-main)',
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }}>
          <Calendar size={14} color="var(--text-main)" />
          <span>{todayStr}</span>
        </div>

        {/* Signed-in Status Badge */}
        <div className="badge badge-income" style={{ whiteSpace: 'nowrap' }}>
          <ShieldCheck size={13} />
          <span>Signed In</span>
        </div>

        {/* Quick PDF Export */}
        <button
          onClick={handleExportPDF}
          className="btn btn-secondary btn-sm"
          title="Export PDF Report"
          aria-label="Export PDF"
        >
          <FileText size={15} />
          <span>Export PDF</span>
        </button>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          title="Log Out"
          aria-label="Log Out"
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Right Mobile: Avatar / Profile Dropdown Trigger */}
      <div className="header-mobile-actions" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileOpen(prev => !prev)}
          className="mobile-profile-trigger"
          aria-expanded={isProfileOpen}
          aria-label="User profile and quick actions menu"
        >
          <div className="mobile-profile-avatar">
            {avatarDisplay}
          </div>
          <ChevronDown
            size={16}
            style={{
              transition: 'transform var(--transition-fast)',
              transform: isProfileOpen ? 'rotate(180deg)' : 'none'
            }}
          />
        </button>

        {/* Mobile Dropdown Menu */}
        {isProfileOpen && (
          <div className="mobile-profile-dropdown">
            {/* User Details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <div className="mobile-profile-avatar" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                {avatarDisplay}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.university || 'Student'}
                </div>
              </div>
              <span className="badge badge-income" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                <ShieldCheck size={11} /> Active
              </span>
            </div>

            {/* Date Pill inside Dropdown */}
            <div style={{
              padding: '0.65rem 1rem',
              background: 'var(--bg-card-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <Calendar size={13} />
              <span>{todayStr}</span>
            </div>

            {/* Actions List with Accessible >= 44px Touch Targets */}
            <div style={{ padding: '0.5rem' }}>
              <button
                onClick={handleExportPDF}
                className="dropdown-action-btn"
                aria-label="Export PDF"
              >
                <FileText size={17} color="var(--primary-light)" />
                <span>Export PDF Report</span>
              </button>

              <button
                onClick={handleLogout}
                className="dropdown-action-btn dropdown-action-danger"
                aria-label="Log Out"
              >
                <LogOut size={17} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 2rem;
          background: color-mix(in srgb, var(--bg-app) 92%, transparent);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid color-mix(in srgb, var(--border-light) 100%, transparent);
          position: sticky;
          top: 0;
          z-index: 90;
          width: 100%;
          box-sizing: border-box;
        }

        .header-page-title {
          font-family: 'Plus Jakarta Sans', var(--font-sans);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-desktop-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .header-mobile-actions {
          display: none;
          position: relative;
        }

        .header-mobile-menu {
          display: none;
        }

        .mobile-profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-card-subtle);
          border: 1px solid var(--border-light);
          padding: 0.35rem 0.65rem;
          border-radius: 24px;
          color: var(--text-main);
          cursor: pointer;
          min-height: 44px;
          transition: background var(--transition-fast);
        }

        .mobile-profile-trigger:hover,
        .mobile-profile-trigger:focus-visible {
          background: color-mix(in srgb, var(--text-main) 12%, transparent);
        }

        .mobile-profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .mobile-profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: var(--bg-sidebar);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-lg);
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          z-index: 1000;
          animation: slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.85rem;
          border: none;
          background: transparent;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          min-height: 44px;
          transition: background var(--transition-fast);
          text-align: left;
        }

        .dropdown-action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .dropdown-action-danger {
          color: #FCA5A5;
        }

        .dropdown-action-danger:hover {
          background: rgba(231, 76, 60, 0.2);
        }

        @media (max-width: 900px) {
          .header-mobile-menu {
            display: inline-flex !important;
            min-width: 44px;
            min-height: 44px;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 0.85rem 1rem;
          }
          .header-page-title {
            font-size: 1.15rem;
          }
          .header-subtitle {
            font-size: 0.75rem;
          }
          .header-desktop-actions {
            display: none;
          }
          .header-mobile-actions {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
