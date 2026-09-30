import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Repeat } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, initialData = null }) {
  const { categories, addTransaction, updateTransaction } = useFinance();

  const [type, setType] = useState(initialData ? initialData.type : 'expense');
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [amount, setAmount] = useState(initialData ? initialData.amount : '');
  const [categoryId, setCategoryId] = useState(initialData ? initialData.categoryId : '');
  const [date, setDate] = useState(initialData ? initialData.date : new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState(initialData ? (initialData.source || 'manual') : 'manual');
  const [isRecurring, setIsRecurring] = useState(initialData ? initialData.isRecurring : false);
  const [note, setNote] = useState(initialData ? initialData.note : '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a transaction title');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than RM 0');
      return;
    }
    const selectedCatId = categoryId || (filteredCategories[0] ? filteredCategories[0].id : '');
    if (!selectedCatId) {
      setError('Please select a category');
      return;
    }

    const payload = {
      type,
      title: title.trim(),
      amount: Number(amount),
      categoryId: selectedCatId,
      date,
      source,
      isRecurring,
      note: note.trim()
    };

    if (initialData) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--expense-bg)',
            color: 'var(--expense)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Income / Expense Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => {
                setType('expense');
                setCategoryId('');
              }}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => {
                setType('income');
                setCategoryId('');
              }}
            >
              Income
            </button>
          </div>

          {/* Amount Input with RM prefix */}
          <div className="form-group">
            <label className="form-label">Amount (RM)</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 700,
                color: 'var(--primary)'
              }}>
                RM
              </span>
              <input
                type="number"
                step="0.01"
                required
                className="form-control"
                style={{ paddingLeft: '3.2rem', fontSize: '1.1rem', fontWeight: 700 }}
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="form-group">
            <label className="form-label">Title / Description</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Cafeteria Lunch, PTPTN Loan"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              <option value="">Select Category...</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Source (Architecture for Future Bank Sync) */}
          <div className="form-group">
            <label className="form-label">Transaction Origin / Source</label>
            <select
              className="form-control"
              value={source}
              onChange={e => setSource(e.target.value)}
            >
              <option value="manual">📝 Manual Entry</option>
              <option value="bank">💳 Bank Integration Feed (Future Ready)</option>
              <option value="imported">📁 Imported File / CSV</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              required
              className="form-control"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* Note Input */}
          <div className="form-group">
            <label className="form-label">Optional Note</label>
            <input
              type="text"
              className="form-control"
              placeholder="Add details, receipt reference..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* Recurring Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="isRecurring" style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Repeat size={14} color="var(--primary)" /> Recurring monthly expense / income
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {initialData ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
