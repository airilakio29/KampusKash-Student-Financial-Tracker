import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  PlusCircle, 
  FileText, 
  Trash2, 
  Edit3, 
  Repeat,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function TransactionsView({ onOpenAddTransaction, onEditTransaction }) {
  const { transactions, categories, deleteTransaction, exportToPDF } = useFinance();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Filtering
  const filtered = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? t.categoryId === selectedCategory : true;
    const matchesType = selectedType === 'all' ? true : t.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {/* Header Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.25rem', fontWeight: 700 }}>
              Transaction Records
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filtered.length} of {transactions.length} entries
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => exportToPDF(user)} className="btn btn-secondary">
              <FileText size={16} /> Export PDF
            </button>
            <button data-tour="transactions-add-btn" onClick={onOpenAddTransaction} className="btn btn-primary">
              <PlusCircle size={16} /> + Add Transaction
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          padding: '1rem',
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search title or note..."
              className="form-control"
              style={{ paddingLeft: '2.5rem', height: '40px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-control"
              style={{ height: '40px' }}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="form-control"
              style={{ height: '40px' }}
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="all">All Types (Income & Expense)</option>
              <option value="income">Income Only (+RM)</option>
              <option value="expense">Expense Only (-RM)</option>
            </select>
          </div>
        </div>

        {/* Transaction Table */}
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No transactions found.</p>
            <span style={{ fontSize: '0.85rem' }}>Try clearing your search query or filter tags.</span>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title & Notes</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount (RM)</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const cat = categories.find(c => c.id === t.categoryId);
                  const isIncome = t.type === 'income';
                  return (
                    <tr key={t.id}>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {t.date}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span>{t.title}</span>
                          {t.isRecurring && (
                            <span className="badge badge-recurring" title="Recurring Monthly">
                              <Repeat size={12} /> Recurring
                            </span>
                          )}
                          {t.source === 'bank' && (
                            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', fontSize: '0.68rem' }} title="Bank Synced Feed">
                              💳 Bank
                            </span>
                          )}
                          {t.source === 'imported' && (
                            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', fontSize: '0.68rem' }} title="Imported CSV File">
                              📁 Import
                            </span>
                          )}
                        </div>
                        {t.note && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                            {t.note}
                          </div>
                        )}
                      </td>
                      <td>
                        <span 
                          className="badge" 
                          style={{ 
                            background: `${cat ? cat.color : '#94A3B8'}20`, 
                            color: cat ? cat.color : '#475569' 
                          }}
                        >
                          {cat ? cat.name : 'Uncategorized'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                          {isIncome ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {t.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: isIncome ? 'var(--income)' : 'var(--expense)' }}>
                        {isIncome ? '+' : '-'} RM {t.amount.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                          <button 
                            onClick={() => onEditTransaction(t)}
                            className="btn btn-secondary btn-icon" 
                            style={{ width: '32px', height: '32px' }}
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Delete transaction "${t.title}"?`)) {
                                deleteTransaction(t.id);
                              }
                            }}
                            className="btn btn-danger btn-icon" 
                            style={{ width: '32px', height: '32px' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
