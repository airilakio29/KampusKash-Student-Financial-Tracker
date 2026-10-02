/**
 * KampusKash Tutorial Service
 * Central definition of tour steps, walkthrough milestones, and helpers.
 */

export const TOUR_STEPS = [
  {
    id: 'welcome',
    targetSelector: '[data-tour="dashboard-metrics"]',
    tab: 'dashboard',
    title: 'Welcome to KampusKash',
    description: 'Your all-in-one student financial command center. Track your total balance across accounts, monitor allowance and loan income, keep expenses in check, and view your goal savings at a glance.',
    iconName: 'LayoutDashboard',
    preferredPosition: 'bottom'
  },
  {
    id: 'student-identity',
    targetSelector: '[data-tour="motto-banner"], [data-tour="header-greeting"]',
    tab: 'dashboard',
    title: 'Student Identity & Financial Motto',
    description: 'Personalize your financial mindset! Your custom motto (e.g. "CS Student | Saving for a laptop") and campus affiliation are displayed here to keep you inspired every day.',
    iconName: 'Sparkles',
    preferredPosition: 'bottom'
  },
  {
    id: 'my-accounts',
    targetSelector: '[data-tour="accounts"], [data-tour="nav-accounts"]',
    tab: 'dashboard',
    title: 'My Accounts & Balances',
    description: 'Keep tabs on all your funds across CIMB, MAE/Maybank, Bank Islam, cash reserves, and Touch \'n Go e-wallets. Add accounts anytime with instant automatic balance synchronization.',
    iconName: 'Landmark',
    preferredPosition: 'top'
  },
  {
    id: 'spending-breakdown',
    targetSelector: '[data-tour="category-chart"]',
    tab: 'dashboard',
    title: 'Category Spending Breakdown',
    description: 'See exactly where your money goes in real-time. Interactive color-coded charts categorize your living costs — from food and campus transport to study materials.',
    iconName: 'PieChart',
    preferredPosition: 'top'
  },
  {
    id: 'export-pdf',
    targetSelector: '[data-tour="export-pdf-btn"]',
    tab: 'dashboard',
    title: 'One-Click PDF Statement',
    description: 'Generate a clean, printable PDF financial report on demand — perfect for sharing with parents, scholarship administrators, or monthly budget auditing.',
    iconName: 'FileText',
    preferredPosition: 'bottom'
  },
  {
    id: 'transactions-nav',
    targetSelector: '[data-tour="nav-transactions"]',
    tab: 'transactions',
    title: 'Transaction Records & Smart Search',
    description: 'Explore your complete transaction ledger. Search instantly by title, notes, or merchant, and filter expenses or income with responsive one-click sorting.',
    iconName: 'ReceiptText',
    preferredPosition: 'right'
  },
  {
    id: 'add-transaction',
    targetSelector: '[data-tour="transactions-add-btn"], [data-tour="add-transaction"]',
    tab: 'transactions',
    title: 'Record Income & Expenses',
    description: 'Quickly log everyday spending, part-time wages, or allowance payouts. Link entries to specific accounts (Maybank, CIMB, Cash) for automatic balance deduction.',
    iconName: 'PlusCircle',
    preferredPosition: 'bottom'
  },
  {
    id: 'budgets-nav',
    targetSelector: '[data-tour="nav-budgets"]',
    tab: 'budgets',
    title: 'Category Budgets & Limit Warnings',
    description: 'Set monthly spending limits for food, groceries, or entertainment. Visual alert indicators notify you when you approach 80% or exceed your target budget.',
    iconName: 'Target',
    preferredPosition: 'right'
  },
  {
    id: 'savings-nav',
    targetSelector: '[data-tour="nav-savings"]',
    tab: 'savings',
    title: 'Student Savings Goals',
    description: 'Save towards what matters most — emergency funds, semester tuition, or a new laptop. Deposit funds toward goals and track percentage completion in real-time.',
    iconName: 'PiggyBank',
    preferredPosition: 'right'
  },
  {
    id: 'reports-nav',
    targetSelector: '[data-tour="nav-reports"]',
    tab: 'reports',
    title: 'Reports & Trend Analytics',
    description: 'Gain deep financial insights with multi-month cashflow bar charts, net savings calculations, and spending breakdown across all your linked accounts.',
    iconName: 'BarChart3',
    preferredPosition: 'right'
  },
  {
    id: 'profile-customization',
    targetSelector: '[data-tour="settings-profile-card"], [data-tour="sidebar-profile-card"], [data-tour="profile-btn"]',
    tab: 'settings',
    title: 'Student Profile & Avatar Customizer',
    description: 'Express your campus persona! Pick from 8 modern preset avatars (Scholar, Techie, Smart Saver, Creative, etc.) or upload your personal photo (<2MB) with circular live preview. Customize your name, campus, motto, and currency target.',
    iconName: 'User',
    preferredPosition: 'top'
  },
  {
    id: 'theme-selector',
    targetSelector: '[data-tour="theme-selector"]',
    tab: 'settings',
    title: 'Dark Royal Aesthetic & Themes',
    description: 'Personalize your workspace with curated themes like Dark Royal Gemstone, Midnight Emerald, and Crimson Velvet, or customize fine-tuned color accents.',
    iconName: 'Palette',
    preferredPosition: 'top'
  },
  {
    id: 'data-backup-replay',
    targetSelector: '[data-tour="replay-tutorial-btn"], [data-tour="backup-manager"]',
    tab: 'settings',
    title: 'Data Backup & Tutorial Replay',
    description: 'Keep full control of your financial data with JSON export and import. You can replay this interactive tutorial anytime from Settings whenever you need a tour.',
    iconName: 'BookOpen',
    preferredPosition: 'top'
  },
  {
    id: 'finish',
    targetSelector: null,
    tab: 'settings',
    title: "You're Ready to Master Your Finances! 🎓",
    description: 'KampusKash makes smart campus budgeting simple and rewarding. Start tracking your income, setting budgets, and achieving your financial goals today!',
    iconName: 'Check',
    preferredPosition: 'center'
  }
];

export function getTourStepById(id) {
  return TOUR_STEPS.find(step => step.id === id);
}

export function getTotalTourSteps() {
  return TOUR_STEPS.length;
}
