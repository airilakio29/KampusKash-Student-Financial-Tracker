import React, { useRef, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { PRESET_THEMES, loadSavedTheme, saveTheme } from '../utils/themeEngine';
import { 
  PlusCircle, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Palette,
  Sparkles,
  Check,
  BookOpen
} from 'lucide-react';
import { resetTutorial } from '../components/Tutorial';

const getHexFromToken = (tokenValue) => {
  if (!tokenValue) return '#000000';
  if (tokenValue.startsWith('#')) return tokenValue.slice(0, 7);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = tokenValue;
  return ctx.fillStyle;
};

const getPresetColors = (presetId) => {
  const preset = PRESET_THEMES.find(t => t.id === presetId) || PRESET_THEMES[0];
  return {
    primary: getHexFromToken(preset.tokens['--primary']),
    bgApp: getHexFromToken(preset.tokens['--bg-app']),
    bgCard: getHexFromToken(preset.tokens['--bg-card']),
    income: getHexFromToken(preset.tokens['--income']),
    expense: getHexFromToken(preset.tokens['--expense']),
    textMain: getHexFromToken(preset.tokens['--text-main'])
  };
};

export default function SettingsView({ onOpenAddCategory, onReplayTutorial }) {
  const { 
    categories, 
    deleteCategory, 
    exportJSONBackup, 
    importJSONBackup, 
    resetToSampleData 
  } = useFinance();
  const { user } = useAuth();

  const fileInputRef = useRef(null);
  const [msg, setMsg] = useState({ text: '', isError: false });

  const [activeThemeConfig, setActiveThemeConfig] = useState(() => loadSavedTheme());
  const [customColors, setCustomColors] = useState(() => activeThemeConfig.customColors || getPresetColors(activeThemeConfig.presetId));
  const [useCustomColors, setUseCustomColors] = useState(() => Boolean(activeThemeConfig.customColors));

  const handleSelectPreset = (presetId) => {
    // When a preset is selected, reset custom colors to that preset's defaults
    const newConfig = { presetId, customColors: null };
    setActiveThemeConfig(newConfig);
    saveTheme(newConfig);
    setUseCustomColors(false);
    setCustomColors(getPresetColors(presetId));
    setMsg({ text: `Theme updated to "${PRESET_THEMES.find(t => t.id === presetId)?.name}"!`, isError: false });
  };

  const handleCustomColorChange = (key, hexValue) => {
    const updatedCustom = { ...customColors, [key]: hexValue };
    setCustomColors(updatedCustom);
    setUseCustomColors(true);
    const newConfig = { presetId: activeThemeConfig.presetId, customColors: updatedCustom };
    setActiveThemeConfig(newConfig);
    saveTheme(newConfig);
  };

  const handleResetTheme = () => {
    setUseCustomColors(false);
    const defaultConfig = { presetId: 'purple', customColors: null };
    setActiveThemeConfig(defaultConfig);
    saveTheme(defaultConfig);
    setCustomColors(getPresetColors('purple'));
    setMsg({ text: 'Theme reset to KampusKash Purple default.', isError: false });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const success = importJSONBackup(json);
        if (success) {
          setMsg({ text: 'Backup data restored successfully!', isError: false });
        } else {
          setMsg({ text: 'Invalid backup file format.', isError: true });
        }
      } catch {
        setMsg({ text: 'Failed to read JSON backup file.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Settings & Customization
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Logged in as <strong>{user?.username}</strong> ({user?.email || 'Local User'}). Customize theme appearance, manage categories, or export backups.
        </p>
      </div>

      {msg.text && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: msg.isError ? 'var(--expense-bg)' : 'var(--income-bg)',
          color: msg.isError ? 'var(--expense)' : 'var(--income)',
          fontWeight: 600,
          fontSize: '0.88rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {msg.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {msg.text}
        </div>
      )}

      {/* PHASE 2: CUSTOMIZABLE THEME & APPEARANCE SECTION */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title" style={{ marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={18} color="var(--primary)" /> Appearance & Theme Customization
          </span>
          <button onClick={handleResetTheme} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} /> Reset Theme
          </button>
        </div>

        {/* 9 Preset Theme Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          {PRESET_THEMES.map(preset => {
            const isSelected = activeThemeConfig.presetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-subtle)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{preset.icon}</span> {preset.name}
                  </span>
                  {isSelected && (
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} />
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, minHeight: '32px' }}>
                  {preset.description}
                </p>

                {/* Color Swatch Preview */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '0.2rem' }}>
                  <span style={{ flex: 1, height: '14px', borderRadius: '3px', background: preset.tokens['--bg-app'] }} title="Background" />
                  <span style={{ flex: 1, height: '14px', borderRadius: '3px', background: preset.tokens['--bg-sidebar'] }} title="Sidebar" />
                  <span style={{ flex: 1, height: '14px', borderRadius: '3px', background: preset.tokens['--primary'] }} title="Primary" />
                  <span style={{ flex: 1, height: '14px', borderRadius: '3px', background: preset.tokens['--income'] }} title="Income" />
                  <span style={{ flex: 1, height: '14px', borderRadius: '3px', background: preset.tokens['--expense'] }} title="Expense" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Theme Color Adjuster */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="var(--primary)" /> Fine-Tune Custom Accent Colors
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Primary Accent
              </label>
              <input
                type="color"
                value={customColors.primary}
                onChange={e => handleCustomColorChange('primary', e.target.value)}
                style={{ width: '100%', height: '34px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Background Tone
              </label>
              <input
                type="color"
                value={customColors.bgApp}
                onChange={e => handleCustomColorChange('bgApp', e.target.value)}
                style={{ width: '100%', height: '34px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Card Tone
              </label>
              <input
                type="color"
                value={customColors.bgCard}
                onChange={e => handleCustomColorChange('bgCard', e.target.value)}
                style={{ width: '100%', height: '34px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Income Accent
              </label>
              <input
                type="color"
                value={customColors.income}
                onChange={e => handleCustomColorChange('income', e.target.value)}
                style={{ width: '100%', height: '34px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Expense Accent
              </label>
              <input
                type="color"
                value={customColors.expense}
                onChange={e => handleCustomColorChange('expense', e.target.value)}
                style={{ width: '100%', height: '34px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Category Management */}
        <div className="card">
          <div className="card-title">
            <span>Category Manager</span>
            <button onClick={onOpenAddCategory} className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> Add Category
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '350px', overflowY: 'auto' }}>
            {categories.map(cat => (
              <div 
                key={cat.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: cat.color
                  }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat.name}</span>
                  <span className={`badge ${cat.type === 'income' ? 'badge-income' : 'badge-expense'}`} style={{ fontSize: '0.7rem' }}>
                    {cat.type}
                  </span>
                </div>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="btn btn-danger btn-icon"
                  style={{ width: '28px', height: '28px' }}
                  title="Delete category"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="card">
          <div className="card-title">
            <span>Data Backup & Management</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Export your full financial dataset as a JSON file or restore from a previous backup.
            </p>

            <button onClick={exportJSONBackup} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Download size={16} /> Export JSON Data Backup
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              style={{ display: 'none' }}
            />

            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="btn btn-secondary" 
              style={{ justifyContent: 'center' }}
            >
              <Upload size={16} /> Import / Restore JSON Backup
            </button>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <button 
              onClick={() => {
                if (window.confirm('Reset all financial data to default sample dataset?')) {
                  resetToSampleData();
                  setMsg({ text: 'Data reset to initial sample set.', isError: false });
                }
              }} 
              className="btn btn-danger" 
              style={{ justifyContent: 'center' }}
            >
              <RotateCcw size={16} /> Hard Reset Sample Data
            </button>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <button 
              onClick={() => {
                resetTutorial();
                if (onReplayTutorial) onReplayTutorial();
                setMsg({ text: 'Tutorial will now replay. Enjoy the walkthrough!', isError: false });
              }} 
              className="btn btn-secondary" 
              style={{ justifyContent: 'center' }}
            >
              <BookOpen size={16} /> Replay Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
