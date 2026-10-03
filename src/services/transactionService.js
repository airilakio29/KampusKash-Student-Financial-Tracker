/**
 * KiroKash Transaction Service
 * Manages transaction CRUD and financial calculations.
 * Phase 1: source = "manual" only.
 */


/**
 * Create a new transaction with proper defaults.
 */
export function createTransaction({
  type, title, amount, categoryId, date, accountId, source, isRecurring, note
}) {
  const now = new Date().toISOString();
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: type || 'expense',
    title: (title || '').trim(),
    amount: Number(amount) || 0,
    categoryId: categoryId || '',
    accountId: accountId || null,
    date: date || new Date().toISOString().split('T')[0],
    source: source || 'manual',
    isRecurring: Boolean(isRecurring),
    note: (note || '').trim(),
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Validate a transaction before saving.
 */
export function validateTransaction(tx) {
  if (!tx.title || !tx.title.trim()) {
    return 'Please enter a transaction title';
  }
  const amount = Number(tx.amount);
  if (!amount || amount <= 0 || isNaN(amount) || !isFinite(amount)) {
    return 'Please enter a valid amount greater than RM 0';
  }
  if (!tx.categoryId) {
    return 'Please select a category';
  }
  if (!tx.date) {
    return 'Please select a date';
  }
  return null;
}

/**
 * Calculate total income from transactions.
 */
export function calculateTotalIncome(transactions = []) {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculate total expenses from transactions.
 */
export function calculateTotalExpenses(transactions = []) {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculate total balance (income - expenses).
 */
export function calculateTransactionBalance(transactions = []) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

/**
 * Calculate spending per category.
 */
export function calculateCategorySpending(transactions = [], categories = []) {
  return categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        amount: spent
      };
    })
    .filter(item => item.amount > 0);
}

/**
 * Calculate budget usage for a specific category.
 */
export function calculateBudgetUsage(transactions = [], categoryId) {
  return transactions
    .filter(t => t.type === 'expense' && t.categoryId === categoryId)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculate savings goal progress.
 */
export function calculateSavingsProgress(goal) {
  if (!goal) return { percentage: 0, remaining: 0 };
  const current = Number(goal.currentAmount || 0);
  const target = Number(goal.targetAmount || 1);
  const pct = Math.min(100, (current / target) * 100);
  return {
    percentage: pct,
    remaining: Math.max(0, target - current)
  };
}

/**
 * Filter transactions by multiple criteria.
 */
export function filterTransactions(transactions = [], filters = {}) {
  return transactions.filter(t => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = (t.title || '').toLowerCase().includes(q);
      const matchNote = (t.note || '').toLowerCase().includes(q);
      const matchCategory = (filters._categoryNameMap?.[t.categoryId] || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNote && !matchCategory) return false;
    }
    // Type
    if (filters.type && filters.type !== 'all' && t.type !== filters.type) return false;
    // Category
    if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
    // Account
    if (filters.accountId) {
      if (filters.accountId === '__unassigned') {
        if (t.accountId) return false;
      } else {
        if (t.accountId !== filters.accountId) return false;
      }
    }
    // Date range
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    return true;
  });
}

/**
 * Get monthly aggregates for reporting.
 */
export function getMonthlyAggregates(transactions = [], monthsBack = 6) {
  const now = new Date();
  const months = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7); // YYYY-MM
    const label = d.toLocaleDateString('en-MY', { month: 'short', year: 'numeric' });
    const monthTx = transactions.filter(t => (t.date || '').startsWith(key));
    months.push({
      key,
      label,
      income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0),
      expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0)
    });
  }
  return months;
}

/**
 * Get spending breakdown by account.
 */
export function getSpendingByAccount(transactions = [], accounts = []) {
  const result = {};
  // Unassigned bucket
  const unassigned = transactions.filter(t => t.type === 'expense' && !t.accountId);
  if (unassigned.length > 0) {
    result['__unassigned'] = {
      name: 'Unassigned',
      amount: unassigned.reduce((s, t) => s + Number(t.amount || 0), 0)
    };
  }
  accounts.forEach(acc => {
    const accTx = transactions.filter(t => t.type === 'expense' && t.accountId === acc.accountId);
    if (accTx.length > 0) {
      result[acc.accountId] = {
        name: acc.accountName,
        amount: accTx.reduce((s, t) => s + Number(t.amount || 0), 0)
      };
    }
  });
  return result;
}
