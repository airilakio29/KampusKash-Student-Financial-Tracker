import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { missingFirebaseKeys } from './firebase';

import FullScreenLoader from './components/FullScreenLoader';
import ResetPassword from './components/ResetPassword';
import GlitterBackground from './components/GlitterBackground';
import Auth from './Auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Tutorial from './components/Tutorial';

import DashboardView from './views/DashboardView';
import TransactionsView from './views/TransactionsView';
import BudgetsView from './views/BudgetsView';
import SavingsView from './views/SavingsView';
import AccountsView from './views/AccountsView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

import TransactionModal from './components/TransactionModal';
import BudgetModal from './components/BudgetModal';
import SavingsModal from './components/SavingsModal';
import CategoryModal from './components/CategoryModal';
import AccountModal from './components/AccountModal';

function AppContent() {
  const { tutorialCompleted, completeTutorial, isLoading, loadError } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isReplayingTutorial, setIsReplayingTutorial] = useState(false);

  const isTourActive = !tutorialCompleted || isReplayingTutorial;

  // Modal Control States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [savingsModalMode, setSavingsModalMode] = useState('create');
  const [selectedSavingsGoalId, setSelectedSavingsGoalId] = useState(null);
  const [editingSavings, setEditingSavings] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleOpenAddBudget = () => {
    setEditingBudget(null);
    setIsBudgetModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsBudgetModalOpen(true);
  };

  const handleOpenAddSavings = () => {
    setSavingsModalMode('create');
    setSelectedSavingsGoalId(null);
    setEditingSavings(null);
    setIsSavingsModalOpen(true);
  };

  const handleEditSavings = (goal) => {
    setSavingsModalMode('edit');
    setSelectedSavingsGoalId(goal.id);
    setEditingSavings(goal);
    setIsSavingsModalOpen(true);
  };

  const handleOpenDepositSavings = (goalId) => {
    setSavingsModalMode('deposit');
    setSelectedSavingsGoalId(goalId);
    setEditingSavings(null);
    setIsSavingsModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddAccount = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAddTransaction={handleOpenAddTransaction}
            onOpenAddBudget={handleOpenAddBudget}
            onOpenAddSavings={handleOpenAddSavings}
            onOpenAddAccount={handleOpenAddAccount}
          />
        );
      case 'transactions':
        return (
          <TransactionsView
            onOpenAddTransaction={handleOpenAddTransaction}
            onEditTransaction={handleEditTransaction}
          />
        );
      case 'budgets':
        return (
          <BudgetsView
            onOpenAddBudget={handleOpenAddBudget}
            onEditBudget={handleEditBudget}
          />
        );
      case 'savings':
        return (
          <SavingsView
            onOpenAddSavings={handleOpenAddSavings}
            onOpenDepositSavings={handleOpenDepositSavings}
            onEditSavings={handleEditSavings}
          />
        );
      case 'accounts':
        return (
          <AccountsView
            onOpenAddAccount={handleOpenAddAccount}
            onEditAccount={handleEditAccount}
          />
        );
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return (
          <SettingsView
            onOpenAddCategory={handleOpenAddCategory}
            onReplayTutorial={() => setIsReplayingTutorial(true)}
          />
        );
      default:
        return (
          <DashboardView
            onOpenAddTransaction={handleOpenAddTransaction}
            onOpenAddBudget={handleOpenAddBudget}
            onOpenAddSavings={handleOpenAddSavings}
            onOpenAddAccount={handleOpenAddAccount}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Financial Dashboard';
      case 'transactions': return 'Transaction Records';
      case 'budgets': return 'Category Budgets';
      case 'savings': return 'Student Savings Goals';
      case 'accounts': return 'My Accounts';
      case 'reports': return 'Reports & Analytics';
      case 'settings': return 'App Settings & Backup';
      default: return 'Financial Dashboard';
    }
  };

  return (
    <div className="app-container">
      <GlitterBackground />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTransaction={handleOpenAddTransaction}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="main-wrapper">
        <Header
          title={getPageTitle()}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        <main className="content-area">
          {isLoading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Loading your finances...
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Syncing with your account data
              </div>
            </div>
          ) : (
            <>
              {loadError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--warning-bg)',
                  color: 'var(--warning)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  ⚠️ {loadError}
                </div>
              )}
              {renderActiveView()}
            </>
          )}
        </main>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        initialData={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        initialData={editingBudget}
      />

      <SavingsModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        mode={savingsModalMode}
        goalId={selectedSavingsGoalId}
        initialData={editingSavings}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        initialData={editingAccount}
      />

      {/* Modern Contextual Product Tour */}
      {isTourActive && (
        <Tutorial
          onComplete={() => {
            completeTutorial();
            setIsReplayingTutorial(false);
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isTransactionModalOpen={isTransactionModalOpen}
          onOpenAddTransaction={handleOpenAddTransaction}
        />
      )}
    </div>
  );
}

function FirebaseSetupNotice() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        padding: '2.5rem 2rem',
        background: 'var(--bg-card, rgba(54, 40, 68, 0.85))',
        borderRadius: '16px',
        border: '1px solid var(--border-light, rgba(255, 255, 255, 0.15))',
        boxShadow: '0 32px 64px -16px rgba(0, 0, 0, 0.6)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Firebase setup required
        </h1>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted, rgba(255,255,255,0.65))' }}>
          Add your Firebase web app credentials to the <code>.env</code> file, then restart the dev server.
        </p>
        <ul style={{ margin: '1rem 0 0', paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.9 }}>
          {missingFirebaseKeys.map((key) => (
            <li key={key}><code>{key}</code></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function checkPasswordResetRoute() {
  try {
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (pathname.includes('/reset-password') || pathname.endsWith('reset-password')) {
      return true;
    }
    if (mode === 'resetPassword' || Boolean(oobCode)) {
      return true;
    }
    const hash = window.location.hash;
    if (hash.includes('reset-password') || hash.includes('oobCode')) {
      return true;
    }
  } catch {
    // Fallback
  }
  return false;
}

function AppAuthenticator() {
  const { user, isAuthenticated, isFirebaseConfigured } = useAuth();
  const [inResetFlow, setInResetFlow] = useState(checkPasswordResetRoute);

  // Synchronize on URL changes / back-forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      setInResetFlow(checkPasswordResetRoute());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  if (!isFirebaseConfigured) {
    return <FirebaseSetupNotice />;
  }

  // Custom Password Reset Page for Firebase Action Emails or /reset-password
  if (inResetFlow) {
    return (
      <>
        <GlitterBackground />
        <ResetPassword onBackToLogin={() => setInResetFlow(false)} />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <GlitterBackground />
        <Auth />
      </>
    );
  }

  return (
    <FinanceProvider key={user.id}>
      <AppContent />
    </FinanceProvider>
  );
}

function AppWithLoader() {
  const { isAuthResolved } = useAuth();

  return (
    <>
      <FullScreenLoader isResolved={isAuthResolved} />
      {isAuthResolved && <AppAuthenticator />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithLoader />
    </AuthProvider>
  );
}
