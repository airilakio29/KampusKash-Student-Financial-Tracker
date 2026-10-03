/**
 * KiroKash Theme & Design Token Engine
 * Manages 10 preset themes, custom color overrides, CSS design token injection,
 * and persistence across desktop and mobile.
 */

export const STORAGE_KEY_THEME = 'student_tracker_theme_customization';

export const PRESET_THEMES = [
  {
    id: 'kiro',
    name: 'Kiro',
    icon: '⚡',
    description: 'Signature onyx black with neon electric purple glow',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#0A0A0F',
      '--bg-card': 'rgba(15, 12, 27, 0.75)',
      '--bg-card-subtle': 'rgba(24, 18, 43, 0.65)',
      '--bg-sidebar': '#060609',
      '--bg-sidebar-active': '#7928CA',
      '--primary': '#8B5CF6',
      '--primary-hover': '#7928CA',
      '--primary-light': '#EDE9FE',
      '--primary-badge': '#A855F7',
      '--text-main': '#F8FAFC',
      '--text-muted': '#C4B5FD',
      '--text-light': '#A78BFA',
      '--text-white': '#FFFFFF',
      '--income': '#10B981',
      '--expense': '#F43F5E',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(168, 85, 247, 0.22)'
    }
  },
  {
    id: 'purple',
    name: 'KiroKash Purple',
    icon: '🔮',
    description: 'Original signature gemstone purple interface',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#624873',
      '--bg-card': 'rgba(74, 54, 87, 0.65)',
      '--bg-card-subtle': 'rgba(61, 46, 74, 0.55)',
      '--bg-sidebar': '#2A1F35',
      '--bg-sidebar-active': '#5A4870',
      '--primary': '#624873',
      '--primary-hover': '#4A3657',
      '--primary-light': '#E8DEF5',
      '--primary-badge': '#F3EDF9',
      '--text-main': '#F3EDF9',
      '--text-muted': '#C4B5D4',
      '--text-light': '#9A8AB0',
      '--text-white': '#FFFFFF',
      '--income': '#C4B5D4',
      '--expense': '#F87171',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(255, 255, 255, 0.12)'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    icon: '🌊',
    description: 'Deep navy and refreshing azure ocean theme',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#0F172A',
      '--bg-card': 'rgba(30, 41, 59, 0.75)',
      '--bg-card-subtle': 'rgba(15, 23, 42, 0.6)',
      '--bg-sidebar': '#020617',
      '--bg-sidebar-active': '#0284C7',
      '--primary': '#38BDF8',
      '--primary-hover': '#0284C7',
      '--primary-light': '#E0F2FE',
      '--primary-badge': '#BAE6FD',
      '--text-main': '#F0F9FF',
      '--text-muted': '#93C5FD',
      '--text-light': '#60A5FA',
      '--text-white': '#FFFFFF',
      '--income': '#34D399',
      '--expense': '#F87171',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(255, 255, 255, 0.12)'
    }
  },
  {
    id: 'mint',
    name: 'Mint Green',
    icon: '🌿',
    description: 'Fresh mint and emerald campus theme',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#064E3B',
      '--bg-card': 'rgba(6, 78, 59, 0.75)',
      '--bg-card-subtle': 'rgba(4, 47, 36, 0.6)',
      '--bg-sidebar': '#022C22',
      '--bg-sidebar-active': '#059669',
      '--primary': '#10B981',
      '--primary-hover': '#059669',
      '--primary-light': '#D1FAE5',
      '--primary-badge': '#A7F3D0',
      '--text-main': '#ECFDF5',
      '--text-muted': '#6EE7B7',
      '--text-light': '#34D399',
      '--text-white': '#FFFFFF',
      '--income': '#34D399',
      '--expense': '#F87171',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(255, 255, 255, 0.12)'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    icon: '🌅',
    description: 'Vibrant dusk purple and warm orange glow',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#4C1D95',
      '--bg-card': 'rgba(88, 28, 135, 0.75)',
      '--bg-card-subtle': 'rgba(58, 12, 95, 0.6)',
      '--bg-sidebar': '#2E1065',
      '--bg-sidebar-active': '#C2410C',
      '--primary': '#F97316',
      '--primary-hover': '#EA580C',
      '--primary-light': '#FFEDD5',
      '--primary-badge': '#FED7AA',
      '--text-main': '#FFF7ED',
      '--text-muted': '#FDBA74',
      '--text-light': '#FB923C',
      '--text-white': '#FFFFFF',
      '--income': '#34D399',
      '--expense': '#EF4444',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(255, 255, 255, 0.12)'
    }
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    icon: '🌸',
    description: 'Soft rose quartz and pastel crimson',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#831843',
      '--bg-card': 'rgba(131, 24, 67, 0.75)',
      '--bg-card-subtle': 'rgba(80, 7, 36, 0.6)',
      '--bg-sidebar': '#500724',
      '--bg-sidebar-active': '#BE185D',
      '--primary': '#F472B6',
      '--primary-hover': '#DB2777',
      '--primary-light': '#FCE7F3',
      '--primary-badge': '#FBCFE8',
      '--text-main': '#FDF2F8',
      '--text-muted': '#F472B6',
      '--text-light': '#F43F5E',
      '--text-white': '#FFFFFF',
      '--income': '#34D399',
      '--expense': '#FB7185',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(255, 255, 255, 0.12)'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: '🌙',
    description: 'High-contrast midnight dark theme',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#121212',
      '--bg-card': 'rgba(30, 30, 30, 0.85)',
      '--bg-card-subtle': 'rgba(20, 20, 20, 0.7)',
      '--bg-sidebar': '#1E1E1E',
      '--bg-sidebar-active': '#3700B3',
      '--primary': '#BB86FC',
      '--primary-hover': '#9965F4',
      '--primary-light': '#E8DEF5',
      '--primary-badge': '#D7BCE8',
      '--text-main': '#F3EDF9',
      '--text-muted': '#B0B0B0',
      '--text-light': '#888888',
      '--text-white': '#FFFFFF',
      '--income': '#03DAC6',
      '--expense': '#CF6679',
      '--warning': '#FBBF24',
      '--border-light': 'rgba(255, 255, 255, 0.1)'
    }
  },
  {
    id: 'cute_cat',
    name: 'Cute Cat',
    icon: '🐱',
    description: 'Pastel lilac theme with subtle cat decorative accents',
    isDecorativeCat: true,
    tokens: {
      '--bg-app': '#5C4468',
      '--bg-card': 'rgba(82, 60, 93, 0.8)',
      '--bg-card-subtle': 'rgba(67, 49, 76, 0.65)',
      '--bg-sidebar': '#35253E',
      '--bg-sidebar-active': '#936D9E',
      '--primary': '#F4A261',
      '--primary-hover': '#E76F51',
      '--primary-light': '#FFE8D6',
      '--primary-badge': '#FFD099',
      '--text-main': '#FFF5EB',
      '--text-muted': '#E8C5E8',
      '--text-light': '#C39EC3',
      '--text-white': '#FFFFFF',
      '--income': '#2A9D8F',
      '--expense': '#E76F51',
      '--warning': '#E9C46A',
      '--border-light': 'rgba(255, 255, 255, 0.15)'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    description: 'Pine forest greens with warm golden accents',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#1B3B2B',
      '--bg-card': 'rgba(35, 68, 51, 0.8)',
      '--bg-card-subtle': 'rgba(24, 48, 36, 0.65)',
      '--bg-sidebar': '#0F261B',
      '--bg-sidebar-active': '#2D5A43',
      '--primary': '#48BB78',
      '--primary-hover': '#38A169',
      '--primary-light': '#F0FFF4',
      '--primary-badge': '#C6F6D5',
      '--text-main': '#F0FFF4',
      '--text-muted': '#9AE6B4',
      '--text-light': '#68D391',
      '--text-white': '#FFFFFF',
      '--income': '#68D391',
      '--expense': '#FC8181',
      '--warning': '#F6AD55',
      '--border-light': 'rgba(255, 255, 255, 0.12)'
    }
  },
  {
    id: 'cream',
    name: 'Minimal Cream',
    icon: '🍦',
    description: 'Clean light cream background with dark slate text',
    isDecorativeCat: false,
    tokens: {
      '--bg-app': '#F5F2EB',
      '--bg-card': '#FFFFFF',
      '--bg-card-subtle': '#FAF8F5',
      '--bg-sidebar': '#1E293B',
      '--bg-sidebar-active': '#059669',
      '--primary': '#059669',
      '--primary-hover': '#047857',
      '--primary-light': '#E6F4F1',
      '--primary-badge': '#D1FAE5',
      '--text-main': '#1E293B',
      '--text-muted': '#64748B',
      '--text-light': '#94A3B8',
      '--text-white': '#FFFFFF',
      '--income': '#059669',
      '--expense': '#DC2626',
      '--warning': '#D97706',
      '--border-light': 'rgba(0, 0, 0, 0.08)'
    }
  }
];

export function applyThemeTokens(themeConfig) {
  if (!themeConfig) return;
  const root = document.documentElement;

  // 1. Find matching preset or default
  const preset = PRESET_THEMES.find(t => t.id === themeConfig.presetId) || PRESET_THEMES[0];

  // 2. Base tokens from preset
  const finalTokens = { ...preset.tokens };

  // 3. Apply custom color overrides if specified
  if (themeConfig.customColors) {
    if (themeConfig.customColors.primary) finalTokens['--primary'] = themeConfig.customColors.primary;
    if (themeConfig.customColors.bgApp) finalTokens['--bg-app'] = themeConfig.customColors.bgApp;
    if (themeConfig.customColors.bgCard) finalTokens['--bg-card'] = themeConfig.customColors.bgCard;
    if (themeConfig.customColors.textMain) finalTokens['--text-main'] = themeConfig.customColors.textMain;
    if (themeConfig.customColors.income) finalTokens['--income'] = themeConfig.customColors.income;
    if (themeConfig.customColors.expense) finalTokens['--expense'] = themeConfig.customColors.expense;
  }

  // 4. Inject CSS variables to :root
  Object.entries(finalTokens).forEach(([prop, val]) => {
    root.style.setProperty(prop, val);
  });

  // 5. Store active theme attribute for decorative elements (e.g. Kiro, Cute Cat)
  root.setAttribute('data-theme-preset', preset.id);
  if (preset.id === 'kiro') {
    root.setAttribute('data-kiro', 'true');
  } else {
    root.removeAttribute('data-kiro');
  }
  if (preset.isDecorativeCat) {
    root.setAttribute('data-cute-cat', 'true');
  } else {
    root.removeAttribute('data-cute-cat');
  }

  // 6. Broadcast event so components (Kiro particles, headers, etc.) update dynamically
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { presetId: preset.id, config: themeConfig } }));
  }
}

export function loadSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) {
      const config = JSON.parse(saved);
      applyThemeTokens(config);
      return config;
    }
  } catch (e) {
    console.error('Failed to load theme from LocalStorage', e);
  }
  const defaultConfig = { presetId: 'kiro', customColors: null };
  applyThemeTokens(defaultConfig);
  return defaultConfig;
}

export function saveTheme(themeConfig) {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(themeConfig));
    applyThemeTokens(themeConfig);
  } catch (e) {
    console.error('Failed to save theme to LocalStorage', e);
  }
}
