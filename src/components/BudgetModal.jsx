import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { validateBudget } from '../services/budgetService';
import { X } from 'lucide-react';

export default function BudgetModal({ isOpen, onClose, initialData = null }) {
  const { categories, budgets, upsertBudget } = useFinance();
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId || '');
      setLimit(initialData.monthlyLimit !== undefined ? String(initialData.monthlyLimit) : '');
    } else {
      setCategoryId('');
      setLimit('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateBudget({ categoryId, monthlyLimit: limit });
    if (validationError) {
      setError(validationError);
      return;
    }

    upsertBudget(categoryId, Number(limit));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {initialData ? 'Edit Category Budget' : 'Set Monthly Budget Limit'}
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--expense-bg)', color: 'var(--expense)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="budget-category">Expense Category</label>
            <select
              id="budget-category"
              className="form-control"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              disabled={Boolean(initialData)} // Category fixed when editing existing budget
            >
              <option value="">Select Category...</option>
              {expenseCategories.map(cat => {
                const existing = budgets.find(b => b.categoryId === cat.id);
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {existing && (!initialData || initialData.categoryId !== cat.id) ? `(Current: RM ${existing.monthlyLimit})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="budget-limit">Monthly Limit (RM)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--primary)' }}>
                RM
              </span>
              <input
                id="budget-limit"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="400.00"
                className="form-control"
                style={{ paddingLeft: '3.2rem' }}
                value={limit}
                onChange={e => setLimit(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {initialData ? 'Update Budget' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
