import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ReceiptText,
  Target,
  PiggyBank,
  Settings,
  PlusCircle,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAddTransaction, isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'savings', label: 'Savings Goals', icon: PiggyBank },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
        />
      )}

      <aside style={{
        width: '260px',
        background: 'var(--bg-sidebar)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem',
        flexShrink: 0,
        zIndex: 100,
        transition: 'transform var(--transition-smooth)',
        position: 'relative'
      }} className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>

        <div>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                fontSize: '1rem'
              }}>
                KK
              </div>
              <div>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                  KampusKash
                </h1>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>
                  Your friendly campus wallet
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="mobile-close-btn"
              style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'none', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => {
              onOpenAddTransaction();
              if (isMobileOpen) setIsMobileOpen(false);
            }}
            className="btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              color: '#FFFFFF',
              marginBottom: '1.75rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}
          >
            <PlusCircle size={18} />
            <span>+ Add Transaction</span>
          </button>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Icon size={20} color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profile */}
        <div style={{
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem'
              }}>
                {user.avatar || user.username.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.username}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.university || 'Student'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.5rem',
              marginTop: '0.75rem',
              padding: '0.6rem',
              background: 'rgba(231, 76, 60, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(231, 76, 60, 0.2)',
              borderRadius: '4px',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            box-shadow: 4px 0 20px rgba(0,0,0,0.3);
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
