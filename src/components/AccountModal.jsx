import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ACCOUNT_TYPES, validateAccount } from '../services/accountService';
import { X } from 'lucide-react';

export default function AccountModal({ isOpen, onClose, initialData = null }) {
  const { addAccount, updateAccount } = useFinance();

  const [accountName, setAccountName] = useState('');
  const [institution, setInstitution] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setAccountName(initialData.accountName || '');
      setInstitution(initialData.institution || '');
      setAccountType(initialData.accountType || 'savings');
      setBalance(initialData.balance != null ? String(initialData.balance) : '');
    } else {
      setAccountName('');
      setInstitution('');
      setAccountType('savings');
      setBalance('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const accountData = {
      accountName: accountName.trim(),
      institution: institution.trim(),
      accountType,
      balance: Number(balance) || 0
    };

    const validationError = validateAccount(accountData);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (initialData) {
      updateAccount(initialData.accountId, accountData);
    } else {
      addAccount(accountData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {initialData ? 'Edit Account' : 'Add New Account'}
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-icon" aria-label="Close">
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
          <div className="form-group">
            <label className="form-label">Account Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Maybank Savings, TNG eWallet"
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              maxLength={50}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institution (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Maybank, CIMB, Touch 'n Go"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              className="form-control"
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
            >
              {ACCOUNT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Balance (RM)</label>
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
                className="form-control"
                style={{ paddingLeft: '3.2rem', fontSize: '1.1rem', fontWeight: 700 }}
                placeholder="0.00"
                value={balance}
                onChange={e => setBalance(e.target.value)}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Enter your current account balance. Transactions will adjust this automatically.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {initialData ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
