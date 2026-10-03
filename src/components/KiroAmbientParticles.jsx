import React, { useState, useEffect } from 'react';
import logoImg from '../assets/kiro-logo.png';

/**
 * Ambient Floating Logo Particle Effect for Kiro theme
 * Renders subtle, drifting Kiro logos in the background across the dashboard
 * using lightweight hardware-accelerated CSS animations.
 */

// 14 carefully distributed ambient floating particles
const PARTICLES = [
  { id: 1, left: 4, top: 12, size: 34, opacity: 0.12, duration: 18, delay: -4, rotation: -6 },
  { id: 2, left: 16, top: 48, size: 28, opacity: 0.15, duration: 22, delay: -11, rotation: 8 },
  { id: 3, left: 28, top: 82, size: 38, opacity: 0.14, duration: 20, delay: -7, rotation: -10 },
  { id: 4, left: 38, top: 18, size: 32, opacity: 0.11, duration: 24, delay: -15, rotation: 5 },
  { id: 5, left: 52, top: 62, size: 42, opacity: 0.16, duration: 19, delay: -2, rotation: -4 },
  { id: 6, left: 66, top: 22, size: 30, opacity: 0.13, duration: 21, delay: -9, rotation: 12 },
  { id: 7, left: 78, top: 78, size: 36, opacity: 0.17, duration: 23, delay: -14, rotation: -8 },
  { id: 8, left: 90, top: 35, size: 40, opacity: 0.12, duration: 17, delay: -5, rotation: 6 },
  { id: 9, left: 8, top: 88, size: 30, opacity: 0.14, duration: 25, delay: -18, rotation: -12 },
  { id: 10, left: 84, top: 8, size: 32, opacity: 0.13, duration: 22, delay: -8, rotation: 10 },
  { id: 11, left: 45, top: 90, size: 34, opacity: 0.15, duration: 20, delay: -13, rotation: -5 },
  { id: 12, left: 22, top: 28, size: 26, opacity: 0.11, duration: 26, delay: -16, rotation: 7 },
  { id: 13, left: 60, top: 42, size: 36, opacity: 0.12, duration: 21, delay: -6, rotation: -9 },
  { id: 14, left: 94, top: 86, size: 32, opacity: 0.14, duration: 19, delay: -10, rotation: 4 }
];

export default function KiroAmbientParticles() {
  const [isKiroActive, setIsKiroActive] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme-preset') === 'kiro';
  });

  useEffect(() => {
    const checkTheme = () => {
      const preset = document.documentElement.getAttribute('data-theme-preset');
      setIsKiroActive(preset === 'kiro');
    };

    checkTheme();

    const handleThemeChange = (e) => {
      setIsKiroActive(e.detail?.presetId === 'kiro');
    };

    window.addEventListener('themeChanged', handleThemeChange);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme-preset') {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme-preset'] });

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  if (!isKiroActive) return null;

  const publicLogo = `${import.meta.env.BASE_URL || '/'}kiro-logo.png`.replace(/\/{2,}/g, '/');

  return (
    <div
      className="kiro-ambient-particles-layer"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="kiro-drifting-particle"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `kiroFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
            filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.45))',
            willChange: 'transform'
          }}
        >
          <img
            src={logoImg || publicLogo}
            alt=""
            onError={(e) => {
              if (e.target.src !== publicLogo) e.target.src = publicLogo;
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          33% {
            transform: translate3d(14px, -26px, 0) rotate(5deg);
          }
          66% {
            transform: translate3d(-12px, -14px, 0) rotate(-4deg);
          }
        }
        @keyframes kiroFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          33% {
            transform: translate3d(14px, -26px, 0) rotate(5deg);
          }
          66% {
            transform: translate3d(-12px, -14px, 0) rotate(-4deg);
          }
        }
      `}</style>
    </div>
  );
}
