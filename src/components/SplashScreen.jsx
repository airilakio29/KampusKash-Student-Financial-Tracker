import React, { useState, useEffect } from 'react';
import logoImg from '../assets/kiro-logo.png';

export default function SplashScreen({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const totalDuration = 3200;
    const stepMs = 30;
    const steps = totalDuration / stepMs;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      // Ease-out curve for natural progress feel
      const ratio = current / steps;
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.min(100, eased * 100));

      if (current >= steps) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => onFinished(), 500);
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, [onFinished]);

  const publicLogo = `${import.meta.env.BASE_URL || '/'}kiro-logo.png`.replace(/\/{2,}/g, '/');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: 'var(--bg-app, #0a0a0f)',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: fadeOut ? 'none' : 'auto'
    }}>
      {/* Ambient glow rings */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent 70%)',
        animation: 'splashPulse 2.4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(121, 40, 202, 0.15), transparent 70%)',
        animation: 'splashPulse 3s ease-in-out infinite 0.5s',
        pointerEvents: 'none'
      }} />

      {/* Logo container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        animation: 'splashFloatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Logo mark */}
        <div style={{
          width: 'clamp(200px, 48vw, 290px)',
          height: 'auto',
          maxHeight: '105px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.45))',
          animation: 'splashLogoGlow 2s ease-in-out infinite',
          padding: '0'
        }}>
          <img
            src={logoImg || publicLogo}
            alt="Logo"
            onError={(e) => {
              if (e.target.src !== publicLogo) e.target.src = publicLogo;
            }}
            style={{ width: '100%', height: 'auto', maxHeight: '105px', objectFit: 'contain' }}
          />
        </div>

        {/* Loading bar */}
        <div style={{
          width: '200px',
          height: '4px',
          borderRadius: '4px',
          background: 'color-mix(in srgb, var(--text-main, #F3EDF9) 12%, transparent)',
          overflow: 'hidden',
          marginTop: '0.5rem'
        }}>
          <div style={{
            height: '100%',
            borderRadius: '4px',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--primary, #624873), var(--primary-light, #E8DEF5))',
            transition: 'width 0.05s linear',
            boxShadow: '0 0 12px color-mix(in srgb, var(--primary, #624873) 50%, transparent)'
          }} />
        </div>

        {/* Loading dots */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginTop: '0.25rem'
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--primary-light, #E8DEF5)',
              animation: `splashDot 1.2s ease-in-out infinite ${i * 0.2}s`
            }} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        zIndex: 2,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted, #C4B5D4)',
          opacity: 0.5,
          fontFamily: "'Inter', sans-serif"
        }}>
          Student Financial Tracker
        </p>
      </div>

      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes splashFloatIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splashLogoGlow {
          0%, 100% { box-shadow: 0 20px 60px color-mix(in srgb, var(--primary, #624873) 40%, transparent), 0 0 80px color-mix(in srgb, var(--primary-light, #E8DEF5) 15%, transparent); }
          50% { box-shadow: 0 20px 60px color-mix(in srgb, var(--primary, #624873) 60%, transparent), 0 0 120px color-mix(in srgb, var(--primary-light, #E8DEF5) 25%, transparent); }
        }
        @keyframes splashDot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
