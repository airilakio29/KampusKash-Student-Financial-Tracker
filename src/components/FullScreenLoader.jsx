import React, { useState, useEffect } from 'react';
import logoImg from '../assets/kiro-logo.png';

/**
 * Full-screen loading component for KiroKash
 * Renders while Firebase auth session (onAuthStateChanged) is being checked.
 * Features:
 * - Centered layout with responsive scaling
 * - App logo with continuous breathing/pulse glow animation
 * - Minimalist indeterminate progress bar and pulsing status text
 * - Clean fade-out transition when auth state is resolved
 */
export default function FullScreenLoader({ isResolved = false, onUnmounted }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isResolved) {
      const animTimer = setTimeout(() => setFadeOut(true), 10);
      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
        if (onUnmounted) onUnmounted();
      }, 410); // 400ms smooth fade transition
      return () => {
        clearTimeout(animTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isResolved, onUnmounted]);

  if (!shouldRender) return null;

  const publicLogo = `${import.meta.env.BASE_URL || '/'}kiro-logo.png`.replace(/\/{2,}/g, '/');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading KiroKash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'var(--bg-app, #0a0a0f)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeOut ? 'none' : 'auto',
        userSelect: 'none'
      }}
    >
      {/* Ambient background glow rings */}
      <div
        style={{
          position: 'absolute',
          width: 'min(480px, 80vw)',
          height: 'min(480px, 80vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, transparent 70%)',
          animation: 'loaderAmbientPulse 3s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 'min(640px, 95vw)',
          height: 'min(640px, 95vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(121, 40, 202, 0.18) 0%, transparent 75%)',
          animation: 'loaderAmbientPulse 4s ease-in-out infinite 0.75s',
          pointerEvents: 'none'
        }}
      />

      {/* Center content container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.5rem',
          maxWidth: '90vw'
        }}
      >
        {/* Animated App Logo Container with Continuous Breathing / Pulse */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'loaderBreathing 2.4s ease-in-out infinite'
          }}
        >
          <img
            src={logoImg || publicLogo}
            alt="Logo"
            onError={(e) => {
              // Fallback to public path if asset bundle path differs
              if (e.target.src !== publicLogo) {
                e.target.src = publicLogo;
              }
            }}
            style={{
              width: 'clamp(200px, 48vw, 290px)',
              height: 'auto',
              maxHeight: '105px',
              objectFit: 'contain',
              background: 'transparent',
              filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.45))',
              position: 'relative',
              zIndex: 2
            }}
          />
        </div>

        {/* Minimalist Progress Bar */}
        <div
          style={{
            width: 'clamp(160px, 45vw, 220px)',
            height: '4px',
            borderRadius: '4px',
            background: 'color-mix(in srgb, var(--text-main, #FFFFFF) 12%, transparent)',
            overflow: 'hidden',
            position: 'relative',
            marginTop: '0.75rem'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '40%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, transparent, #8B5CF6, #C4B5FD, transparent)',
              animation: 'loaderProgressSlide 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite'
            }}
          />
        </div>

        {/* Pulsing Status Text */}
        <div
          style={{
            fontFamily: "'Inter', var(--font-sans, sans-serif)",
            fontSize: '0.78rem',
            fontWeight: 500,
            color: 'var(--text-muted, #C4B5FD)',
            letterSpacing: '0.04em',
            animation: 'loaderTextPulse 1.8s ease-in-out infinite'
          }}
        >
          Loading...
        </div>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes loaderBreathing {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.055);
          }
        }
        @keyframes loaderAuraGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.15);
          }
        }
        @keyframes loaderAmbientPulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.95;
          }
        }
        @keyframes loaderProgressSlide {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes loaderTextPulse {
          0%, 100% {
            opacity: 0.55;
          }
          50% {
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}
