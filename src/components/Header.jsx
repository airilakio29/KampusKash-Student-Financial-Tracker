import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Calendar, ShieldCheck, FileText, LogOut } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Header({ onOpenMobileMenu, title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const { exportToPDF } = useFinance();

  const todayStr = new Date().toLocaleDateString('en-MY', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '1.25rem 2rem',
      background: 'color-mix(in srgb, var(--bg-app) 92%, transparent)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid color-mix(in srgb, var(--border-light) 100%, transparent)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn btn-secondary btn-icon header-mobile-menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {title}
          </h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
            <span>Welcome back, <strong>{user.username}</strong> 👋</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
          fontWeight: 500
        }}>
          <Calendar size={14} color="var(--text-main)" />
          <span>{todayStr}</span>
        </div>

        {/* Signed-in Status Badge */}
        <div className="badge badge-income">
          <ShieldCheck size={13} />
          <span>Signed In</span>
        </div>

        {/* Log Out Button */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          title="Log Out"
        >
          <LogOut size={15} />
          <span className="export-text">Log Out</span>
        </button>

        {/* Quick PDF Export */}
        <button
          onClick={() => exportToPDF(user)}
          className="btn btn-secondary btn-sm"
          title="Export PDF"
        >
          <FileText size={15} />
          <span className="export-text">Export PDF</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .header-mobile-menu {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .export-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
