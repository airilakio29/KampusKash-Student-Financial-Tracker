import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ACCOUNT_TYPE_ICONS } from '../services/accountService';
import PieChart from '../components/PieChart';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PlusCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Landmark
} from 'lucide-react';

export default function DashboardView({ onOpenAddTransaction, onOpenAddBudget, onOpenAddSavings, onOpenAddAccount }) {
  const {
    totalBalance,
    totalIncome,
    totalExpense,
    totalSavedInGoals,
    totalAccountBalance,
    categorySpendingBreakdown,
    transactions,
    categories,
    budgets,
    savingsGoals,
    accounts
  } = useFinance();

  const recentTransactions = transactions.slice(0, 5);

  // Budget Health calculation
  const totalBudgetedLimit = budgets.reduce((sum, b) => sum + Number(b.monthlyLimit), 0);
  const totalBudgetedSpent = budgets.reduce((sum, b) => {
    const catSpent = transactions
      .filter(t => t.type === 'expense' && t.categoryId === b.categoryId)
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    return sum + catSpent;
  }, 0);

  const overallBudgetHealthPct = totalBudgetedLimit > 0
    ? Math.min(100, (totalBudgetedSpent / totalBudgetedLimit) * 100).toFixed(1)
    : 0;

  // Use account balance if accounts exist, otherwise fall back to transaction-derived balance
  const displayBalance = accounts.length > 0 ? totalAccountBalance : totalBalance;

  return (
    <div>
      {/* 4 Hero Metric Summary Cards */}
      <div className="grid-metrics" data-tour="dashboard-metrics">
        <div className="card metric-card">
          <div className="metric-icon-box balance">
            <Wallet size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Total Balance</div>
            <div className="metric-value" style={{ color: displayBalance < 0 ? 'var(--expense)' : 'var(--text-main)' }}>
              RM {displayBalance.toFixed(2)}
            </div>
            <div className="metric-sub">
              <span>{accounts.length > 0 ? `Across ${accounts.length} account${accounts.length !== 1 ? 's' : ''}` : 'Current Available Cash'}</span>
            </div>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box income">
            <TrendingUp size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Total Income</div>
            <div className="metric-value" style={{ color: 'var(--income)' }}>
              RM {totalIncome.toFixed(2)}
            </div>
            <div className="metric-sub" style={{ color: 'var(--income)' }}>
              <ArrowUpRight size={14} /> Allowance & Loans
            </div>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box expense">
            <TrendingDown size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Total Expenses</div>
            <div className="metric-value" style={{ color: 'var(--expense)' }}>
              RM {totalExpense.toFixed(2)}
            </div>
            <div className="metric-sub" style={{ color: 'var(--expense)' }}>
              <ArrowDownRight size={14} /> Tuition, Food & Rent
            </div>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box savings">
            <PiggyBank size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Saved in Goals</div>
            <div className="metric-value" style={{ color: 'var(--primary)' }}>
              RM {totalSavedInGoals.toFixed(2)}
            </div>
            <div className="metric-sub">
              <span>{savingsGoals.length} Active Student Goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Breakdown (if accounts exist) */}
      {accounts.length > 0 && (
        <div className="card" style={{ marginBottom: '1.75rem' }} data-tour="accounts">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={18} color="var(--primary)" /> My Accounts
            </span>
            <button onClick={onOpenAddAccount} className="btn btn-secondary btn-sm">
              + Add Account
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            {accounts.map(acc => {
              const icon = ACCOUNT_TYPE_ICONS[acc.accountType] || '📋';
              return (
                <div key={acc.accountId} style={{
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.accountName}
                    </div>
                    <div style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: acc.balance >= 0 ? 'var(--text-main)' : 'var(--expense)'
                    }}>
                      RM {Number(acc.balance).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Dashboard Section: Category Pie Chart + Recent Activity */}
      <div className="grid-dashboard-main">
        {/* Direct Category Spending Pie Chart */}
        <div className="card">
          <div className="card-title">
            <span>Category Spending Breakdown</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Real-time</span>
          </div>
          <PieChart data={categorySpendingBreakdown} />
        </div>

        {/* Recent Activity Table */}
        <div className="card">
          <div className="card-title">
            <span>Recent Transactions</span>
            <button onClick={onOpenAddTransaction} className="btn btn-secondary btn-sm">
              <PlusCircle size={14} /> Add
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No transactions yet. Click "+ Add" to log your first income or expense!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentTransactions.map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                const isIncome = t.type === 'income';
                return (
                  <div key={t.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-card-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {t.date} · {cat ? cat.name : 'Uncategorized'}
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isIncome ? 'var(--income)' : 'var(--expense)',
                      whiteSpace: 'nowrap',
                      marginLeft: '0.5rem'
                    }}>
                      {isIncome ? '+' : '-'} RM {Number(t.amount).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Budget Health Summary + Active Savings Progress */}
      <div className="grid-dashboard-bottom">
        {/* Budget Health Meter */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--primary)" /> Semester Budget Health
            </span>
            <button onClick={onOpenAddBudget} className="btn btn-secondary btn-sm">
              + Set Budget
            </button>
          </div>

          {budgets.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No category monthly limits configured yet. Click "+ Set Budget" to set category caps!
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Total Spent: <strong>RM {totalBudgetedSpent.toFixed(2)}</strong> of RM {totalBudgetedLimit.toFixed(2)}
                </span>
                <span style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: overallBudgetHealthPct > 90 ? 'var(--expense)' : overallBudgetHealthPct > 70 ? 'var(--warning)' : 'var(--primary)'
                }}>
                  {overallBudgetHealthPct}% Spent
                </span>
              </div>

              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${overallBudgetHealthPct > 90 ? 'progress-danger' : overallBudgetHealthPct > 70 ? 'progress-warning' : 'progress-safe'}`}
                  style={{ width: `${overallBudgetHealthPct}%` }}
                />
              </div>

              {overallBudgetHealthPct > 90 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.85rem',
                  padding: '0.5rem 0.85rem',
                  background: 'var(--expense-bg)',
                  color: 'var(--expense)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}>
                  <AlertTriangle size={15} /> Budget Warning: You have reached 90%+ of your planned category limits.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Savings Goals Card */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PiggyBank size={18} color="var(--primary)" /> Top Savings Goals
            </span>
            <button onClick={onOpenAddSavings} className="btn btn-secondary btn-sm">
              + New Goal
            </button>
          </div>

          {savingsGoals.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No savings goals yet. Create a goal for your new laptop or emergency fund!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savingsGoals.slice(0, 2).map(goal => {
                const current = Number(goal.currentAmount || 0);
                const target = Number(goal.targetAmount || 1);
                const pct = Math.min(100, (current / target) * 100).toFixed(1);
                return (
                  <div key={goal.id} style={{ background: 'var(--bg-card-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{goal.title}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                        RM {current.toFixed(2)} / RM {target.toFixed(2)} ({pct}%)
                      </span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '8px' }}>
                      <div className="progress-bar-fill progress-safe" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
