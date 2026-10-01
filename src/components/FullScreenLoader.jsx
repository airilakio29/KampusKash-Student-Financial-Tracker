import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

/**
 * Full-screen loading component for KampusKash
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

  const publicLogo = `${import.meta.env.BASE_URL || '/'}logo.png`.replace(/\/{2,}/g, '/');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading KampusKash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'var(--bg-app, #1e122b)',
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
          background: 'radial-gradient(circle, color-mix(in srgb, var(--primary, #8B5CF6) 24%, transparent) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, color-mix(in srgb, var(--primary-light, #C4B5FD) 10%, transparent) 0%, transparent 75%)',
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
          {/* Subtle outer breathing aura glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '28px',
              background: 'radial-gradient(circle, color-mix(in srgb, var(--primary, #8B5CF6) 45%, transparent), transparent 70%)',
              animation: 'loaderAuraGlow 2.4s ease-in-out infinite',
              filter: 'blur(10px)',
              pointerEvents: 'none'
            }}
          />

          <img
            src={logoImg || publicLogo}
            alt="KampusKash Logo"
            onError={(e) => {
              // Fallback to public path if asset bundle path differs
              if (e.target.src !== publicLogo) {
                e.target.src = publicLogo;
              }
            }}
            style={{
              width: 'clamp(84px, 18vw, 110px)',
              height: 'clamp(84px, 18vw, 110px)',
              objectFit: 'contain',
              borderRadius: '24px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px color-mix(in srgb, var(--primary, #8B5CF6) 35%, transparent)',
              position: 'relative',
              zIndex: 2
            }}
          />
        </div>

        {/* Brand Name */}
        <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', var(--font-sans, sans-serif)",
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 800,
              color: 'var(--text-main, #FFFFFF)',
              letterSpacing: '-0.025em',
              margin: 0,
              lineHeight: 1.15
            }}
          >
            KampusKash
          </h1>
          <p
            style={{
              fontFamily: "'Inter', var(--font-sans, sans-serif)",
              fontSize: 'clamp(0.8rem, 2.2vw, 0.92rem)',
              color: 'var(--text-muted, #C4B5D4)',
              marginTop: '0.35rem',
              marginBottom: 0,
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}
          >
            Your friendly campus wallet
          </p>
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
            marginTop: '0.5rem'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '40%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, transparent, var(--primary, #8B5CF6), var(--primary-light, #C4B5FD), transparent)',
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
            color: 'var(--text-muted, #C4B5D4)',
            letterSpacing: '0.04em',
            animation: 'loaderTextPulse 1.8s ease-in-out infinite'
          }}
        >
          Loading KampusKash...
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
