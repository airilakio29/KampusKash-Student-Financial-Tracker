import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { validateSavingsGoal } from '../services/savingsService';
import { X } from 'lucide-react';

export default function SavingsModal({ isOpen, onClose, mode = 'create', goalId = null, initialData = null }) {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, depositToSavingsGoal } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');

  const selectedGoal = goalId ? savingsGoals.find(g => g.id === goalId) : initialData;

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && selectedGoal) {
      setTitle(selectedGoal.title || '');
      setTargetAmount(selectedGoal.targetAmount !== undefined ? String(selectedGoal.targetAmount) : '');
      setCurrentAmount(selectedGoal.currentAmount !== undefined ? String(selectedGoal.currentAmount) : '');
      setTargetDate(selectedGoal.targetDate || '');
    } else if (mode === 'create') {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate(new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]);
    } else if (mode === 'deposit') {
      setDepositAmount('');
    }
    setError('');
  }, [isOpen, mode, selectedGoal]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'deposit') {
      const dep = Number(depositAmount);
      if (!depositAmount || isNaN(dep) || dep <= 0) {
        setError('Please enter a valid deposit amount greater than RM 0');
        return;
      }
      depositToSavingsGoal(goalId || selectedGoal?.id, dep);
      onClose();
      return;
    }

    if (mode === 'edit') {
      const goalPayload = {
        title: title.trim(),
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount || 0),
        targetDate: targetDate || ''
      };
      const validationError = validateSavingsGoal(goalPayload);
      if (validationError) {
        setError(validationError);
        return;
      }
      updateSavingsGoal(goalId || selectedGoal?.id, goalPayload);
      onClose();
      return;
    }

    // Create mode validation
    const newGoalPayload = {
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate: targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
    };

    const validationError = validateSavingsGoal(newGoalPayload);
    if (validationError) {
      setError(validationError);
      return;
    }

    addSavingsGoal(newGoalPayload);
    onClose();
  };

  const getTitle = () => {
    if (mode === 'deposit') return `Deposit to ${selectedGoal ? selectedGoal.title : 'Savings'}`;
    if (mode === 'edit') return 'Edit Savings Goal';
    return 'Create New Savings Goal';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {getTitle()}
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
          {mode === 'deposit' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="savings-deposit">Deposit Amount (RM)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--primary)' }}>
                  RM
                </span>
                <input
                  id="savings-deposit"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="50.00"
                  className="form-control"
                  style={{ paddingLeft: '3.2rem' }}
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="savings-title">Goal Title</label>
                <input
                  id="savings-title"
                  type="text"
                  placeholder="e.g. New Laptop for Semester, Emergency Fund"
                  className="form-control"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="savings-target">Target Amount (RM)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--primary)' }}>
                    RM
                  </span>
                  <input
                    id="savings-target"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="3000.00"
                    className="form-control"
                    style={{ paddingLeft: '3.2rem' }}
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="savings-current">
                  {mode === 'edit' ? 'Current Saved Amount (RM)' : 'Initial Saved Amount (Optional RM)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--primary)' }}>
                    RM
                  </span>
                  <input
                    id="savings-current"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="form-control"
                    style={{ paddingLeft: '3.2rem' }}
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="savings-date">Target Date</label>
                <input
                  id="savings-date"
                  type="date"
                  className="form-control"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {mode === 'deposit' ? 'Confirm Deposit' : mode === 'edit' ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
