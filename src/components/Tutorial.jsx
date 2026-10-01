import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  LayoutDashboard, 
  ReceiptText, 
  PlusCircle, 
  Target, 
  PiggyBank, 
  Settings, 
  Palette, 
  DollarSign, 
  Layers,
  Landmark,
  BarChart3,
  Wallet
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

const TOUR_STEPS = [
  {
    id: 'welcome',
    targetSelector: '[data-tour="dashboard-metrics"]',
    tab: 'dashboard',
    title: 'Welcome to KampusKash',
    description: 'This is your financial dashboard. You can review your total balance, track incoming funds, monitor expenses, and check savings progress from here.',
    icon: LayoutDashboard,
    actionType: 'info',
    preferredPosition: 'bottom'
  },
  {
    id: 'transactions-nav',
    targetSelector: '[data-tour="nav-transactions"]',
    tab: 'dashboard',
    title: 'Transactions View',
    description: 'Click Transactions in the sidebar to review and manage all your income and expense records.',
    icon: ReceiptText,
    actionType: 'click',
    preferredPosition: 'right'
  },
  {
    id: 'add-transaction',
    targetSelector: '[data-tour="transactions-add-btn"], [data-tour="add-transaction"]',
    tab: 'transactions',
    title: 'Record a Transaction',
    description: 'Click Add Transaction to open the entry form and record money coming in or going out.',
    icon: PlusCircle,
    actionType: 'click',
    preferredPosition: 'bottom'
  },
  {
    id: 'transaction-type',
    targetSelector: '[data-tour="transaction-type"]',
    title: 'Transaction Type',
    description: 'Select whether this entry is an expense or income.',
    icon: Layers,
    actionType: 'select',
    preferredPosition: 'bottom',
    requiresModal: true
  },
  {
    id: 'transaction-amount',
    targetSelector: '[data-tour="transaction-amount"]',
    title: 'Transaction Amount',
    description: 'Enter the amount in Ringgit for this transaction.',
    icon: DollarSign,
    actionType: 'input',
    preferredPosition: 'bottom',
    requiresModal: true
  },
  {
    id: 'transaction-category',
    targetSelector: '[data-tour="transaction-category"]',
    title: 'Assign a Category',
    description: 'Pick a category so your spending is properly grouped in your charts and budgets.',
    icon: Layers,
    actionType: 'select',
    preferredPosition: 'bottom',
    requiresModal: true
  },
  {
    id: 'transaction-account',
    targetSelector: '[data-tour="transaction-account"]',
    title: 'Choose Account',
    description: 'Optionally link this transaction to one of your accounts (Maybank, CIMB, Cash, E-Wallet).',
    icon: Wallet,
    actionType: 'select',
    preferredPosition: 'bottom',
    requiresModal: true
  },
  {
    id: 'transaction-save',
    targetSelector: '[data-tour="transaction-save"]',
    title: 'Save Your Entry',
    description: 'Click Save Changes or Add Transaction to record your transaction into your account.',
    icon: Check,
    actionType: 'completion',
    preferredPosition: 'top',
    requiresModal: true
  },
  {
    id: 'dashboard-update',
    targetSelector: '[data-tour="dashboard-metrics"]',
    tab: 'dashboard',
    title: 'Updated Balance',
    description: 'Your new transaction is now saved and immediately reflected across your dashboard metrics.',
    icon: LayoutDashboard,
    actionType: 'info',
    preferredPosition: 'bottom'
  },
  {
    id: 'budgets-nav',
    targetSelector: '[data-tour="nav-budgets"]',
    tab: 'dashboard',
    title: 'Category Budgets',
    description: 'Set monthly spending limits for categories such as food, transport, and study materials.',
    icon: Target,
    actionType: 'info',
    preferredPosition: 'right'
  },
  {
    id: 'savings-nav',
    targetSelector: '[data-tour="nav-savings"]',
    tab: 'dashboard',
    title: 'Savings Goals',
    description: 'Create and monitor progress toward targets like tuition fees, equipment, or travel.',
    icon: PiggyBank,
    actionType: 'info',
    preferredPosition: 'right'
  },
  {
    id: 'accounts-nav',
    targetSelector: '[data-tour="nav-accounts"]',
    tab: 'dashboard',
    title: 'Multi-Account Balances',
    description: 'Track and manage your bank accounts, e-wallets, and cash reserves all in one place.',
    icon: Landmark,
    actionType: 'info',
    preferredPosition: 'right'
  },
  {
    id: 'reports-nav',
    targetSelector: '[data-tour="nav-reports"]',
    tab: 'dashboard',
    title: 'Reports & Analytics',
    description: 'Analyze your cash flows, monthly trends, and category spending distributions.',
    icon: BarChart3,
    actionType: 'info',
    preferredPosition: 'right'
  },
  {
    id: 'settings-nav',
    targetSelector: '[data-tour="nav-settings"]',
    tab: 'dashboard',
    title: 'Settings and Backup',
    description: 'Manage custom categories, download data backups, or customize your workspace from Settings.',
    icon: Settings,
    actionType: 'click',
    preferredPosition: 'right'
  },
  {
    id: 'theme-selector',
    targetSelector: '[data-tour="theme-selector"]',
    tab: 'settings',
    title: 'Personalize Your Theme',
    description: 'Choose from preset color palettes or fine-tune individual accents to suit your preferences.',
    icon: Palette,
    actionType: 'info',
    preferredPosition: 'top'
  },
  {
    id: 'finish',
    targetSelector: null,
    tab: 'settings',
    title: 'Setup Complete',
    description: 'You are now ready to track your campus finances. You can replay this tour anytime from Settings.',
    icon: Check,
    actionType: 'info',
    preferredPosition: 'center'
  }
];

export default function Tutorial({
  onComplete,
  activeTab,
  setActiveTab,
  isTransactionModalOpen,
  onOpenAddTransaction
}) {
  const { user } = useAuth();
  const { transactions, completeTutorial } = useFinance();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [cardPlacement, setCardPlacement] = useState({ top: 100, left: 100, placement: 'bottom' });
  const [isElementVisible, setIsElementVisible] = useState(false);

  const cardRef = useRef(null);
  const initialTxCount = useRef(transactions ? transactions.length : 0);

  const step = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const Icon = step.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Complete tour handler
  const handleFinish = useCallback(() => {
    if (user?.id) {
      resetTutorial(user.id);
      try {
        localStorage.setItem(getTutorialStorageKey(user.id), 'true');
      } catch (e) {
        console.error(e);
      }
    }
    if (completeTutorial) {
      completeTutorial();
    }
    if (onComplete) {
      onComplete();
    }
  }, [user, completeTutorial, onComplete]);

  // Navigate to step
  const goToStep = useCallback((index) => {
    if (index < 0 || index >= TOUR_STEPS.length) return;
    const nextStep = TOUR_STEPS[index];

    // Synchronize tab if needed
    if (nextStep.tab && setActiveTab && activeTab !== nextStep.tab) {
      setActiveTab(nextStep.tab);
    }

    // Auto-open transaction modal if step requires it and it's not open
    if (nextStep.requiresModal && !isTransactionModalOpen && onOpenAddTransaction) {
      onOpenAddTransaction();
    }

    setCurrentStepIndex(index);
  }, [activeTab, setActiveTab, isTransactionModalOpen, onOpenAddTransaction]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleFinish();
    } else {
      goToStep(currentStepIndex + 1);
    }
  }, [isLastStep, currentStepIndex, goToStep, handleFinish]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStepIndex - 1);
    }
  }, [isFirstStep, currentStepIndex, goToStep]);

  // Find target element in DOM
  const findTargetElement = useCallback(() => {
    if (!step.targetSelector) return null;
    const selectors = step.targetSelector.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }, [step.targetSelector]);

  // Positioning calculation
  const updatePosition = useCallback(() => {
    const el = findTargetElement();

    if (!el) {
      setTargetRect(null);
      setIsElementVisible(true);
      // Fallback: center in viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardWidth = Math.min(340, vw - 32);
      const cardHeight = 220;
      setCardPlacement({
        top: Math.max(20, (vh - cardHeight) / 2),
        left: Math.max(16, (vw - cardWidth) / 2),
        placement: 'center'
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect(rect);
    setIsElementVisible(true);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardEl = cardRef.current;
    const cardWidth = cardEl ? cardEl.offsetWidth : Math.min(340, vw - 32);
    const cardHeight = cardEl ? cardEl.offsetHeight : 210;

    const margin = 12;
    const caretOffset = 10;
    const isMobile = vw < 768;

    const candidatePlacements = isMobile
      ? ['bottom', 'top', 'right', 'left']
      : [step.preferredPosition, 'bottom', 'right', 'top', 'left'];

    let chosenPlacement = 'bottom';
    let top = 0;
    let left = 0;

    for (const pos of candidatePlacements) {
      if (pos === 'right') {
        const rightSpace = vw - rect.right;
        if (rightSpace >= cardWidth + margin + caretOffset) {
          chosenPlacement = 'right';
          left = rect.right + caretOffset;
          top = rect.top + (rect.height - cardHeight) / 2;
          break;
        }
      } else if (pos === 'left') {
        const leftSpace = rect.left;
        if (leftSpace >= cardWidth + margin + caretOffset) {
          chosenPlacement = 'left';
          left = rect.left - cardWidth - caretOffset;
          top = rect.top + (rect.height - cardHeight) / 2;
          break;
        }
      } else if (pos === 'bottom') {
        const bottomSpace = vh - rect.bottom;
        if (bottomSpace >= cardHeight + margin + caretOffset) {
          chosenPlacement = 'bottom';
          top = rect.bottom + caretOffset;
          left = rect.left + (rect.width - cardWidth) / 2;
          break;
        }
      } else if (pos === 'top') {
        const topSpace = rect.top;
        if (topSpace >= cardHeight + margin + caretOffset) {
          chosenPlacement = 'top';
          top = rect.top - cardHeight - caretOffset;
          left = rect.left + (rect.width - cardWidth) / 2;
          break;
        }
      }
    }

    // Clamp coordinates safely within screen
    left = Math.max(margin, Math.min(left, vw - cardWidth - margin));
    top = Math.max(margin, Math.min(top, vh - cardHeight - margin));

    setCardPlacement({ top, left, placement: chosenPlacement, cardWidth, cardHeight });
  }, [findTargetElement, step.preferredPosition]);

  // Scroll target element into view if needed
  useEffect(() => {
    let timer = setTimeout(() => {
      const el = findTargetElement();
      if (el) {
        const rect = el.getBoundingClientRect();
        const isInView = (
          rect.top >= 40 &&
          rect.bottom <= window.innerHeight - 40 &&
          rect.left >= 0 &&
          rect.right <= window.innerWidth
        );
        if (!isInView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      }
      updatePosition();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStepIndex, findTargetElement, updatePosition]);

  // Window resize & scroll listener
  useEffect(() => {
    const handleScrollOrResize = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
    };
  }, [updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight' && step.actionType === 'info') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish, handleNext, handleBack, step.actionType, isFirstStep]);

  // Interactive step handling (click, input, completion)
  useEffect(() => {
    const el = findTargetElement();
    if (!el) return;

    if (step.actionType === 'click') {
      const handleClick = () => {
        // Allow the application's click event to fire first, then advance
        setTimeout(() => {
          handleNext();
        }, 150);
      };
      el.addEventListener('click', handleClick);
      return () => el.removeEventListener('click', handleClick);
    }

    if (step.actionType === 'input') {
      const handleInput = (e) => {
        if (e.target && e.target.value && Number(e.target.value) > 0) {
          // If valid input is entered, wait for user to finish or click next
        }
      };
      el.addEventListener('input', handleInput);
      return () => el.removeEventListener('input', handleInput);
    }

    if (step.actionType === 'completion') {
      const handleSubmit = () => {
        setTimeout(() => {
          handleNext();
        }, 300);
      };
      el.addEventListener('click', handleSubmit);
      return () => el.removeEventListener('click', handleSubmit);
    }
  }, [currentStepIndex, step.actionType, findTargetElement, handleNext]);

  // Track transaction addition during completion step
  useEffect(() => {
    if (step.id === 'transaction-save' || step.id === 'add-transaction') {
      const currentCount = transactions ? transactions.length : 0;
      if (currentCount > initialTxCount.current) {
        initialTxCount.current = currentCount;
        handleNext();
      }
    }
  }, [transactions, step.id, handleNext]);

  // Calculate arrow caret positioning
  const getCaretStyles = () => {
    if (!targetRect || cardPlacement.placement === 'center') {
      return { display: 'none' };
    }

    const size = 8;
    const base = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };
    const cWidth = cardPlacement.cardWidth || 300;
    const cHeight = cardPlacement.cardHeight || 180;

    if (cardPlacement.placement === 'bottom') {
      const targetCenter = targetRect.left + targetRect.width / 2;
      const relativeLeft = Math.max(16, Math.min(targetCenter - cardPlacement.left, cWidth - 24));
      return {
        ...base,
        top: -size,
        left: `${relativeLeft}px`,
        borderWidth: `0 ${size}px ${size}px ${size}px`,
        borderColor: `transparent transparent var(--bg-card) transparent`,
        filter: 'drop-shadow(0 -1px 0 var(--border-light))'
      };
    }

    if (cardPlacement.placement === 'top') {
      const targetCenter = targetRect.left + targetRect.width / 2;
      const relativeLeft = Math.max(16, Math.min(targetCenter - cardPlacement.left, cWidth - 24));
      return {
        ...base,
        bottom: -size,
        left: `${relativeLeft}px`,
        borderWidth: `${size}px ${size}px 0 ${size}px`,
        borderColor: `var(--bg-card) transparent transparent transparent`,
        filter: 'drop-shadow(0 1px 0 var(--border-light))'
      };
    }

    if (cardPlacement.placement === 'right') {
      const targetCenter = targetRect.top + targetRect.height / 2;
      const relativeTop = Math.max(16, Math.min(targetCenter - cardPlacement.top, cHeight - 24));
      return {
        ...base,
        left: -size,
        top: `${relativeTop}px`,
        borderWidth: `${size}px ${size}px ${size}px 0`,
        borderColor: `transparent var(--bg-card) transparent transparent`,
        filter: 'drop-shadow(-1px 0 0 var(--border-light))'
      };
    }

    if (cardPlacement.placement === 'left') {
      const targetCenter = targetRect.top + targetRect.height / 2;
      const relativeTop = Math.max(16, Math.min(targetCenter - cardPlacement.top, cHeight - 24));
      return {
        ...base,
        right: -size,
        top: `${relativeTop}px`,
        borderWidth: `${size}px 0 ${size}px ${size}px`,
        borderColor: `transparent transparent transparent var(--bg-card)`,
        filter: 'drop-shadow(1px 0 0 var(--border-light))'
      };
    }

    return { display: 'none' };
  };

  return (
    <>
      {/* Target Highlight Spotlight (Non-blocking: pointer-events none) */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: '8px',
            border: '2px solid var(--primary)',
            boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 28%, transparent), 0 0 20px color-mix(in srgb, var(--primary) 25%, transparent)',
            pointerEvents: 'none',
            zIndex: 9998,
            transition: 'all 0.22s ease-out',
            animation: 'targetPulse 2.4s infinite ease-in-out'
          }}
        />
      )}

      {/* Compact Contextual Tour Card */}
      <div
        ref={cardRef}
        role="dialog"
        aria-label="Product tour guide"
        style={{
          position: 'fixed',
          top: `${cardPlacement.top}px`,
          left: `${cardPlacement.left}px`,
          width: 'clamp(280px, 88vw, 340px)',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          padding: '1.1rem 1.15rem 1rem',
          display: isElementVisible ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '0.65rem',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-sans, "Inter", sans-serif)',
          animation: 'cardFadeIn 0.2s ease-out'
        }}
      >
        {/* Caret arrow */}
        <div style={getCaretStyles()} />

        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'color-mix(in srgb, var(--primary) 18%, transparent)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={14} />
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)'
            }}>
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleFinish}
            aria-label="Exit tour"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'color 0.15s ease'
            }}
            title="Exit tour"
          >
            <X size={16} />
          </button>
        </div>

        {/* Title & Description */}
        <div>
          <h4 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            margin: '0 0 0.35rem 0',
            color: 'var(--text-main)',
            lineHeight: 1.25
          }}>
            {step.title}
          </h4>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            margin: 0
          }}>
            {step.description}
          </p>
        </div>

        {/* Action Buttons & Skip link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.4rem',
          paddingTop: '0.6rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <button
            onClick={handleFinish}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            Skip tour
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {!isFirstStep && (
              <button
                onClick={handleBack}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.35rem 0.65rem',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={13} /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.38rem 0.85rem',
                background: 'var(--primary)',
                color: 'var(--text-white, #FFFFFF)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.15s ease'
              }}
            >
              {isLastStep ? 'Done' : 'Next'} <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes targetPulse {
          0% {
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent), 0 0 14px color-mix(in srgb, var(--primary) 20%, transparent);
          }
          50% {
            box-shadow: 0 0 0 6px color-mix(in srgb, var(--primary) 15%, transparent), 0 0 24px color-mix(in srgb, var(--primary) 30%, transparent);
          }
          100% {
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent), 0 0 14px color-mix(in srgb, var(--primary) 20%, transparent);
          }
        }
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
