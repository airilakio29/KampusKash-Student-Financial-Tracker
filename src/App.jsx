import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { missingFirebaseKeys } from './firebase';

import SplashScreen from './components/SplashScreen';
import GlitterBackground from './components/GlitterBackground';
import Auth from './Auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Tutorial from './components/Tutorial';

import DashboardView from './views/DashboardView';
import TransactionsView from './views/TransactionsView';
import BudgetsView from './views/BudgetsView';
import SavingsView from './views/SavingsView';
import SettingsView from './views/SettingsView';

import TransactionModal from './components/TransactionModal';
import BudgetModal from './components/BudgetModal';
import SavingsModal from './components/SavingsModal';
import CategoryModal from './components/CategoryModal';

function AppContent() {
  const { tutorialCompleted, completeTutorial } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isReplayingTutorial, setIsReplayingTutorial] = useState(false);

  const isTourActive = !tutorialCompleted || isReplayingTutorial;

  // Modal Control States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [savingsModalMode, setSavingsModalMode] = useState('create');
  const [selectedSavingsGoalId, setSelectedSavingsGoalId] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleOpenAddBudget = () => {
    setIsBudgetModalOpen(true);
  };

  const handleOpenAddSavings = () => {
    setSavingsModalMode('create');
    setSelectedSavingsGoalId(null);
    setIsSavingsModalOpen(true);
  };

  const handleOpenDepositSavings = (goalId) => {
    setSavingsModalMode('deposit');
    setSelectedSavingsGoalId(goalId);
    setIsSavingsModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAddTransaction={handleOpenAddTransaction}
            onOpenAddBudget={handleOpenAddBudget}
            onOpenAddSavings={handleOpenAddSavings}
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
        return <BudgetsView onOpenAddBudget={handleOpenAddBudget} />;
      case 'savings':
        return (
          <SavingsView
            onOpenAddSavings={handleOpenAddSavings}
            onOpenDepositSavings={handleOpenDepositSavings}
          />
        );
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
          {renderActiveView()}
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
      />

      <SavingsModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        mode={savingsModalMode}
        goalId={selectedSavingsGoalId}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
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

function AuthScreen() {
  return (
    <>
      <GlitterBackground />
      <Auth />
    </>
  );
}

function AppAuthenticator() {
  const { user, isAuthenticated, isAuthResolved, isFirebaseConfigured } = useAuth();

  if (!isFirebaseConfigured) {
    return <FirebaseSetupNotice />;
  }

  if (!isAuthResolved) {
    // The splash screen handles the visual loading state; render nothing here
    return null;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <FinanceProvider key={user.id}>
      <AppContent />
    </FinanceProvider>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinished = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <AuthProvider>
      {!splashDone && <SplashScreen onFinished={handleSplashFinished} />}
      {splashDone && <AppAuthenticator />}
    </AuthProvider>
  );
}
