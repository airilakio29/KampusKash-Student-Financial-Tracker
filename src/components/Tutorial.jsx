import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, LayoutDashboard, ReceiptText, Target, PiggyBank, Settings, PlusCircle, Palette } from 'lucide-react';

const TUTORIAL_STORAGE_KEY = 'kampuskash_tutorial_completed';

const STEPS = [
  {
    title: 'Welcome to KampusKash! 🎓',
    description: 'Your all-in-one student financial tracker. Let us walk you through the key features so you can start managing your money like a pro.',
    icon: LayoutDashboard,
    highlight: null,
    tip: 'This quick tour takes about 30 seconds. You can skip anytime.'
  },
  {
    title: 'Your Financial Dashboard 📊',
    description: 'The Dashboard gives you a bird\'s-eye view of your finances — total balance, income, expenses, and savings goals at a glance. Charts update in real-time as you log transactions.',
    icon: LayoutDashboard,
    highlight: 'dashboard',
    tip: 'Pro tip: Check your dashboard weekly to stay on top of your spending habits!'
  },
  {
    title: 'Track Every Transaction 💸',
    description: 'Log income (allowance, part-time work) and expenses (food, transport, tuition) with categories and dates. Edit or delete any transaction anytime.',
    icon: ReceiptText,
    highlight: 'transactions',
    tip: 'Use the "+ Add Transaction" button in the sidebar for quick entry!'
  },
  {
    title: 'Set Monthly Budgets 🎯',
    description: 'Create spending limits for each category (food, entertainment, transport). KampusKash will warn you when you\'re approaching your budget cap with color-coded progress bars.',
    icon: Target,
    highlight: 'budgets',
    tip: 'Start with 2-3 budget categories and expand as you get comfortable.'
  },
  {
    title: 'Savings Goals 🐷',
    description: 'Working towards a new laptop, emergency fund, or semester abroad? Create savings goals with target amounts and track your progress with visual indicators.',
    icon: PiggyBank,
    highlight: 'savings',
    tip: 'Even saving RM10/week adds up to RM520 by year-end!'
  },
  {
    title: 'Customize Your Theme 🎨',
    description: 'Make KampusKash truly yours! Choose from 9 beautiful themes — Ocean Blue, Mint Green, Rose Pink, Cute Cat, and more. Each theme transforms the entire interface.',
    icon: Palette,
    highlight: 'settings',
    tip: 'Head to Settings → Appearance to explore all available themes.'
  },
  {
    title: 'You\'re All Set! 🚀',
    description: 'You now know everything you need to take control of your student finances. Start by adding your first transaction!',
    icon: PlusCircle,
    highlight: null,
    tip: 'Remember: consistency is key. Log transactions daily for the best insights.'
  }
];

export default function Tutorial({ onComplete, setActiveTab }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [animating, setAnimating] = useState(false);

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const finish = useCallback(() => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  }, [onComplete]);

  const goNext = () => {
    if (animating) return;
    if (isLastStep) {
      finish();
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Navigate to highlighted tab if applicable
      if (STEPS[nextStep].highlight && setActiveTab) {
        setActiveTab(STEPS[nextStep].highlight);
      }
      setAnimating(false);
    }, 200);
  };

  const goBack = () => {
    if (animating || isFirstStep) return;
    setAnimating(true);
    setTimeout(() => {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (STEPS[prevStep].highlight && setActiveTab) {
        setActiveTab(STEPS[prevStep].highlight);
      }
      setAnimating(false);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      if (e.key === 'ArrowLeft') goBack();
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      animation: 'tutFadeIn 0.3s ease-out',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: 'var(--bg-card, rgba(74, 54, 87, 0.95))',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid var(--border-light, rgba(255, 255, 255, 0.12))',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), 0 0 100px color-mix(in srgb, var(--primary, #624873) 15%, transparent)',
        overflow: 'hidden',
        animation: 'tutSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: animating ? 0.5 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        {/* Progress bar */}
        <div style={{
          height: '3px',
          background: 'color-mix(in srgb, var(--text-main, #F3EDF9) 10%, transparent)'
        }}>
          <div style={{
            height: '100%',
            width: `${((currentStep + 1) / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--primary, #624873), var(--primary-light, #E8DEF5))',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '0 3px 3px 0'
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem 0'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted, #C4B5D4)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <button
            onClick={finish}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #C4B5D4)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              borderRadius: '50%',
              transition: 'all 0.15s ease'
            }}
            title="Skip tutorial"
            onMouseEnter={e => e.target.style.color = 'var(--text-main, #F3EDF9)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted, #C4B5D4)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          {/* Icon */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary, #624873), var(--primary-hover, #4A3657))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 24px color-mix(in srgb, var(--primary, #624873) 30%, transparent)'
          }}>
            <Icon size={26} color="var(--text-white, #FFFFFF)" />
          </div>

          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-main, #F3EDF9)',
            marginBottom: '0.75rem',
            lineHeight: 1.2
          }}>
            {step.title}
          </h2>

          <p style={{
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: 'var(--text-muted, #C4B5D4)',
            marginBottom: '1rem'
          }}>
            {step.description}
          </p>

          {/* Tip box */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'color-mix(in srgb, var(--primary, #624873) 12%, transparent)',
            borderRadius: '8px',
            border: '1px solid color-mix(in srgb, var(--primary, #624873) 20%, transparent)',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>💡</span>
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted, #C4B5D4)',
              lineHeight: 1.5,
              fontWeight: 500
            }}>
              {step.tip}
            </span>
          </div>

          {/* Navigation buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {!isFirstStep ? (
              <button
                onClick={goBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.1rem',
                  background: 'var(--bg-card-subtle, rgba(61, 46, 74, 0.5))',
                  color: 'var(--text-main, #F3EDF9)',
                  border: '1px solid var(--border-light, rgba(255, 255, 255, 0.12))',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s ease'
                }}
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={goNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.5rem',
                background: 'linear-gradient(135deg, var(--primary, #624873), var(--primary-hover, #4A3657))',
                color: 'var(--text-white, #FFFFFF)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 14px color-mix(in srgb, var(--primary, #624873) 40%, transparent)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
            >
              {isLastStep ? 'Get Started!' : 'Next'} <ChevronRight size={16} />
            </button>
          </div>

          {/* Step dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '1.25rem'
          }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === currentStep ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === currentStep
                  ? 'var(--primary, #624873)'
                  : i < currentStep
                    ? 'var(--primary-light, #E8DEF5)'
                    : 'color-mix(in srgb, var(--text-main, #F3EDF9) 15%, transparent)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tutFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes tutSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export function shouldShowTutorial() {
  return !localStorage.getItem(TUTORIAL_STORAGE_KEY);
}

export function resetTutorial() {
  localStorage.removeItem(TUTORIAL_STORAGE_KEY);
}
