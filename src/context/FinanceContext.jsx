import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateFinancialPDF } from '../utils/pdfExport';
import { useAuth } from './AuthContext';
import { db, doc, onSnapshot, setDoc } from '../firebase';

const FinanceContext = createContext();

const STORAGE_KEYS = {
  TRANSACTIONS: 'student_tracker_transactions',
  CATEGORIES: 'student_tracker_categories',
  BUDGETS: 'student_tracker_budgets',
  SAVINGS: 'student_tracker_savings'
};

const defaultCategories = [
  { id: 'cat-1', name: 'Allowance', type: 'income', color: '#10B981', icon: 'Wallet' },
  { id: 'cat-2', name: 'Scholarship / Loan', type: 'income', color: '#059669', icon: 'Award' },
  { id: 'cat-3', name: 'Part-time Job', type: 'income', color: '#3B82F6', icon: 'Briefcase' },
  { id: 'cat-4', name: 'Tuition & Fees', type: 'expense', color: '#EF4444', icon: 'GraduationCap' },
  { id: 'cat-5', name: 'Hostel & Rent', type: 'expense', color: '#F59E0B', icon: 'Home' },
  { id: 'cat-6', name: 'Food & Dining', type: 'expense', color: '#8B5CF6', icon: 'Utensils' },
  { id: 'cat-7', name: 'Books & Supplies', type: 'expense', color: '#EC4899', icon: 'BookOpen' },
  { id: 'cat-8', name: 'Transport & Commute', type: 'expense', color: '#14B8A6', icon: 'Bus' },
  { id: 'cat-9', name: 'Entertainment & Leisure', type: 'expense', color: '#6366F1', icon: 'Film' }
];

const defaultTransactions = [];
const defaultBudgets = [];
const defaultSavings = [];

export function FinanceProvider({ children }) {
  const { user, updateUserProfile } = useAuth();
  const userId = user.id;

  // State
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.CATEGORIES}_${userId}`);
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch { return defaultCategories; }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`);
      return saved ? JSON.parse(saved) : defaultTransactions;
    } catch { return defaultTransactions; }
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.BUDGETS}_${userId}`);
      return saved ? JSON.parse(saved) : defaultBudgets;
    } catch { return defaultBudgets; }
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.SAVINGS}_${userId}`);
      return saved ? JSON.parse(saved) : defaultSavings;
    } catch { return defaultSavings; }
  });

  // Real-time Firestore Sync per User UID
  useEffect(() => {
    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profile && updateUserProfile) {
          if (user.username !== data.profile.username || user.university !== data.profile.university) {
            updateUserProfile(data.profile);
          }
        }
        if (data.categories) setCategories(data.categories);
        if (data.transactions) setTransactions(data.transactions);
        if (data.budgets) setBudgets(data.budgets);
        if (data.savingsGoals) setSavingsGoals(data.savingsGoals);
      } else {
        // Initial Seed for New Firestore User - empty transactions, budgets, savings
        setDoc(userDocRef, {
          profile: {
            username: user.username,
            email: user.email,
            university: user.university,
            currency: user.currency || 'RM'
          },
          categories: defaultCategories,
          transactions: [],
          budgets: [],
          savingsGoals: [],
          createdAt: new Date().toISOString()
        }).catch(err => console.warn('Firestore seed warning', err));
      }
    }, (err) => {
      console.warn('Firestore sync listener active in local mode', err);
    });

    return () => unsubscribe();
  }, [userId]);

  // Helper to sync changes to Firestore & LocalStorage
  const persistUserData = (newCat = categories, newTx = transactions, newBud = budgets, newSav = savingsGoals) => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.CATEGORIES}_${userId}`, JSON.stringify(newCat));
      localStorage.setItem(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`, JSON.stringify(newTx));
      localStorage.setItem(`${STORAGE_KEYS.BUDGETS}_${userId}`, JSON.stringify(newBud));
      localStorage.setItem(`${STORAGE_KEYS.SAVINGS}_${userId}`, JSON.stringify(newSav));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }

    if (user?.id) {
      const userDocRef = doc(db, 'users', userId);
      setDoc(userDocRef, {
        categories: newCat,
        transactions: newTx,
        budgets: newBud,
        savingsGoals: newSav,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(e => console.warn('Firestore sync error', e));
    }
  };

  // Financial Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBalance = totalIncome - totalExpense;

  const totalSavedInGoals = savingsGoals
    .reduce((sum, s) => sum + Number(s.currentAmount || 0), 0);

  // Category breakdown calculation for Pie Chart
  const categorySpendingBreakdown = categories
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

  // Transaction CRUD (supports 'source': 'manual' | 'bank' | 'imported')
  const addTransaction = (newTx) => {
    const created = {
      ...newTx,
      id: `tx-${Date.now()}`,
      amount: Number(newTx.amount),
      source: newTx.source || 'manual'
    };
    const updated = [created, ...transactions];
    setTransactions(updated);
    persistUserData(categories, updated, budgets, savingsGoals);
  };

  const updateTransaction = (id, updatedTx) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updatedTx, amount: Number(updatedTx.amount) } : t);
    setTransactions(updated);
    persistUserData(categories, updated, budgets, savingsGoals);
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    persistUserData(categories, updated, budgets, savingsGoals);
  };

  // Category CRUD
  const addCategory = (newCat) => {
    const cat = {
      ...newCat,
      id: `cat-${Date.now()}`,
      color: newCat.color || '#52B788'
    };
    const updated = [...categories, cat];
    setCategories(updated);
    persistUserData(updated, transactions, budgets, savingsGoals);
  };

  const deleteCategory = (id) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    persistUserData(updated, transactions, budgets, savingsGoals);
  };

  // Budget CRUD
  const upsertBudget = (categoryId, monthlyLimit) => {
    let updated = [];
    const existingIndex = budgets.findIndex(b => b.categoryId === categoryId);
    if (existingIndex >= 0) {
      updated = [...budgets];
      updated[existingIndex] = { ...updated[existingIndex], monthlyLimit: Number(monthlyLimit) };
    } else {
      updated = [...budgets, { id: `b-${Date.now()}`, categoryId, monthlyLimit: Number(monthlyLimit) }];
    }
    setBudgets(updated);
    persistUserData(categories, transactions, updated, savingsGoals);
  };

  const deleteBudget = (id) => {
    const updated = budgets.filter(b => b.id !== id);
    setBudgets(updated);
    persistUserData(categories, transactions, updated, savingsGoals);
  };

  // Savings Goal CRUD
  const addSavingsGoal = (newGoal) => {
    const goal = {
      ...newGoal,
      id: `s-${Date.now()}`,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount || 0)
    };
    const updated = [...savingsGoals, goal];
    setSavingsGoals(updated);
    persistUserData(categories, transactions, budgets, updated);
  };

  const depositToSavingsGoal = (goalId, amount) => {
    const numAmount = Number(amount);
    const updatedGoals = savingsGoals.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + numAmount };
      }
      return g;
    });
    setSavingsGoals(updatedGoals);

    const goal = savingsGoals.find(g => g.id === goalId);
    let updatedTx = transactions;
    if (goal) {
      const depositTx = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: `Savings Deposit: ${goal.title}`,
        amount: numAmount,
        type: 'expense',
        categoryId: 'cat-6',
        isRecurring: false,
        source: 'manual',
        note: 'Deposit towards savings goal'
      };
      updatedTx = [depositTx, ...transactions];
      setTransactions(updatedTx);
    }
    persistUserData(categories, updatedTx, budgets, updatedGoals);
  };

  const deleteSavingsGoal = (id) => {
    const updated = savingsGoals.filter(g => g.id !== id);
    setSavingsGoals(updated);
    persistUserData(categories, transactions, budgets, updated);
  };

  // Data Export to PDF
  const exportToPDF = (currentUser) => {
    generateFinancialPDF({
      transactions,
      categories,
      totalBalance,
      totalIncome,
      totalExpense,
      totalSavedInGoals,
      user: currentUser || user
    });
  };

  // Data Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Title', 'Amount (RM)', 'Category', 'Source', 'Recurring', 'Note'];
    const rows = transactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      return [
        t.id,
        t.date,
        t.type,
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount.toFixed(2),
        `"${cat ? cat.name : 'Uncategorized'}"`,
        t.source || 'manual',
        t.isRecurring ? 'Yes' : 'No',
        `"${(t.note || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_finance_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Backup & Restore JSON Data
  const exportJSONBackup = () => {
    const dataBundle = {
      version: 1,
      exportDate: new Date().toISOString(),
      user: user.username,
      categories,
      transactions,
      budgets,
      savingsGoals
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataBundle, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `student_finance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importJSONBackup = (jsonData) => {
    try {
      const newCat = jsonData.categories || categories;
      const newTx = jsonData.transactions || transactions;
      const newBud = jsonData.budgets || budgets;
      const newSav = jsonData.savingsGoals || savingsGoals;
      setCategories(newCat);
      setTransactions(newTx);
      setBudgets(newBud);
      setSavingsGoals(newSav);
      persistUserData(newCat, newTx, newBud, newSav);
      return true;
    } catch (err) {
      console.error('Failed to import JSON data', err);
      return false;
    }
  };

  return (
    <FinanceContext.Provider value={{
      categories,
      transactions,
      budgets,
      savingsGoals,
      totalBalance,
      totalIncome,
      totalExpense,
      totalSavedInGoals,
      categorySpendingBreakdown,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      upsertBudget,
      deleteBudget,
      addSavingsGoal,
      depositToSavingsGoal,
      deleteSavingsGoal,
      exportToPDF,
      exportToCSV,
      exportJSONBackup,
      importJSONBackup
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
