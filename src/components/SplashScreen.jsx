import React, { useState, useEffect } from 'react';

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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: 'var(--bg-app, #624873)',
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
        background: 'radial-gradient(circle, color-mix(in srgb, var(--primary, #624873) 20%, transparent), transparent 70%)',
        animation: 'splashPulse 2.4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--primary-light, #E8DEF5) 8%, transparent), transparent 70%)',
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
          width: '90px',
          height: '90px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary, #624873), var(--primary-hover, #4A3657))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px color-mix(in srgb, var(--primary, #624873) 40%, transparent), 0 0 80px color-mix(in srgb, var(--primary-light, #E8DEF5) 15%, transparent)',
          animation: 'splashLogoGlow 2s ease-in-out infinite'
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--text-white, #FFFFFF)',
            letterSpacing: '-0.02em'
          }}>KK</span>
        </div>

        {/* Brand text */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-main, #F3EDF9)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0
          }}>
            KampusKash
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.95rem',
            color: 'var(--text-muted, #C4B5D4)',
            marginTop: '0.5rem',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}>
            Your friendly campus wallet
          </p>
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
