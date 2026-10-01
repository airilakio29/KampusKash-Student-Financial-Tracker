# UFinance — Student Financial Tracker 🎓💰

[![Deploy to GitHub Pages](https://github.com/airilakio29/UFinance-Student-Financial-Tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/airilakio29/UFinance-Student-Financial-Tracker/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

> **A modern, vibrant, student-focused financial management platform** designed to track allowances, daily expenses, category budget limits, and savings goals in **Ringgit Malaysia (RM)** with real-time updates and interactive guided onboarding.

🌐 **Live Demo:** [https://airilakio29.github.io/UFinance-Student-Financial-Tracker/](https://airilakio29.github.io/UFinance-Student-Financial-Tracker/)

---

## 🌟 Highlights & Features

### 🎓 1. Student-Centric Financial Overview
- **Tailored Metrics**: Track *Allowance Balance*, *Total Income*, *Total Expenses*, and *Saved Goals* formatted in Ringgit Malaysia (RM).
- **Semester Budget Health Meter**: Real-time visualization of monthly allowance consumption rate.
- **Interactive SVG Spending Chart**: Visual breakdown of expenses by category with hover tooltips and dynamic color indicators.

### 🧭 2. Interactive Contextual Product Tour
- **Step-by-Step Guided Walkthrough**: Highlights key interface elements directly on the page (Metric summary cards, Quick-add button, Navigation tabs, Modal form fields, and Theme selector).
- **Target Pulsing Animation**: Elegant spotlight pulse effect guiding user focus without obstructing usability.
- **Persistent State**: Progress is stored locally and synchronized across devices via Firestore. Easily replayable anytime from the Settings page.

### 🎨 3. Dynamic Theme System & Visual Polish
- **9 Curated Themes**: Switch instantly between *Velvet Dusk*, *Emerald Night*, *Royal Purple*, *Cyberpunk*, *Ocean Breeze*, and more.
- **Custom Theme Creator**: Pick your own primary and secondary color accents with instant live preview.
- **Interactive Gemstone Canvas**: Subtle, high-performance HTML5 Canvas particle background generating sparkling emerald, mint, and gold crystal gems.
- **Smooth Splash Screen**: Polished introductory animation on launch.

### 💳 4. Smart Transaction Management
- Categorized income and expense logging with customizable notes, dates, and amounts.
- Multi-criteria filtering by search term, category, and transaction type.
- Instant **PDF Statement Export** (`jspdf` + `jspdf-autotable`) branded for student accounting.
- **CSV Data Export** for spreadsheets and external financial planning.

### 🎯 5. Category Budget Caps & Smart Alerts
- Set monthly spending ceilings per category.
- Visual status badges with dynamic alerts:
  - 🟢 **Safe** (< 70% of budget)
  - 🟡 **Warning** (70% – 90% of budget)
  - 🔴 **Over Budget** (> 90% of budget)

### 🌱 6. Goal-Oriented Savings Tracker
- Set financial milestones for tuition fees, emergency reserves, laptops, or textbooks.
- Target date deadlines with automatic progress percentage and visual bar meters.
- Quick deposit and withdrawal modal workflow.

### ☁️ 7. Hybrid Cloud Sync & Guest Mode
- **Firebase Firestore Integration**: Real-time cloud sync per user UID for cross-device access.
- **Guest / Offline Mode**: Fully operational standalone using browser `localStorage`.
- **JSON Backup & Restore**: One-click export and import of all user financial records.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), Canvas API, Vanilla CSS Design System |
| **Document Generation** | [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| **Backend & Cloud** | [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/), [Firebase Firestore](https://firebase.google.com/) |
| **Hosting & CI/CD** | GitHub Pages + GitHub Actions / Vercel |

---

## 📂 Project Structure

```text
UFinance-Student-Financial-Tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment to gh-pages
├── public/                     # Static assets and icons
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── CategoryModal.jsx   # Custom category manager
│   │   ├── GlitterBackground.jsx # HTML5 Canvas animated particles
│   │   ├── Header.jsx          # Top navigation bar & user profile
│   │   ├── PieChart.jsx        # SVG category spending breakdown
│   │   ├── Sidebar.jsx         # Responsive navigation & quick actions
│   │   ├── SplashScreen.jsx    # Animated launch screen
│   │   ├── TransactionModal.jsx# Income/expense creation modal
│   │   └── Tutorial.jsx        # Interactive contextual product tour
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state
│   │   └── FinanceContext.jsx  # Central financial store & Firestore sync
│   ├── utils/
│   │   └── themeEngine.js      # 9 preset themes & custom CSS variable injector
│   ├── views/
│   │   ├── BudgetsView.jsx     # Category budget management view
│   │   ├── DashboardView.jsx   # Main metric dashboard
│   │   ├── SavingsView.jsx     # Savings goals tracker view
│   │   ├── SettingsView.jsx    # Theme picker, data backup, & tutorial replay
│   │   └── TransactionsView.jsx# Filterable transaction table & PDF export
│   ├── App.jsx                 # Application root & view router
│   ├── firebase.js             # Firebase client configuration
│   └── main.jsx                # DOM root entry point
├── server.js                   # Express backend server
├── vite.config.js              # Vite build configuration
└── package.json                # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/airilakio29/UFinance-Student-Financial-Tracker.git
   cd UFinance-Student-Financial-Tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file in the root directory if you wish to connect your own Firebase project:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   *(If not provided, UFinance gracefully defaults to guest mode with local persistence.)*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   This runs both the backend Express server and Vite client concurrently at `http://localhost:5173/` (or `http://localhost:5174/`).

---

## 📦 Available Scripts

- `npm run dev`: Runs both the Express server and Vite development client concurrently.
- `npm run client`: Starts the Vite client development server only.
- `npm run server`: Starts the Express backend server only.
- `npm run build`: Compiles and bundles production-ready assets into the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run deploy`: Builds and publishes the current distribution to GitHub Pages (`gh-pages` branch).

---

## 🌐 Deployment

### GitHub Pages (Automated)
Pushing commits to the `main` branch automatically triggers the GitHub Actions workflow defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), building the project and deploying it directly to GitHub Pages:
[https://airilakio29.github.io/UFinance-Student-Financial-Tracker/](https://airilakio29.github.io/UFinance-Student-Financial-Tracker/)

### Vercel / Netlify
The project includes a `vercel.json` configuration for zero-config deployment to Vercel.

---

## 📜 License

This project is open-source and licensed under the [MIT License](LICENSE).
