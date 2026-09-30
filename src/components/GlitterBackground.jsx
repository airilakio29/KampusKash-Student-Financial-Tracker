import React, { useEffect, useRef } from 'react';

export default function GlitterBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const getThemeColors = () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      return {
        preset: root.getAttribute('data-theme-preset') || 'purple',
        bgApp: style.getPropertyValue('--bg-app').trim() || '#624873',
        primary: style.getPropertyValue('--primary').trim() || '#624873',
        primaryHover: style.getPropertyValue('--primary-hover').trim() || '#4A3657',
        primaryLight: style.getPropertyValue('--primary-light').trim() || '#E8DEF5',
        textMain: style.getPropertyValue('--text-main').trim() || '#F3EDF9',
        textMuted: style.getPropertyValue('--text-muted').trim() || '#C4B5D4'
      };
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const moneyItems = [];
    const moneyCount = 35;

    const createItem = (yOverride) => ({
      x: Math.random() * width,
      y: yOverride !== undefined ? yOverride : -40 - Math.random() * height * 0.5,
      size: Math.random() * 22 + 14,
      type: Math.random() > 0.4 ? 'primary' : 'secondary',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      vy: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      wobbleAmp: Math.random() * 30 + 10,
      wobbleOffset: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.35 + 0.45,
      shimmer: Math.random() * Math.PI * 2,
      shimmerSpeed: Math.random() * 0.04 + 0.02
    });

    for (let i = 0; i < moneyCount; i++) {
      moneyItems.push(createItem());
    }

    const drawCoin = (ctx, x, y, radius, alpha, colors, symbol = '$') => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, radius * 0.1, 0, 0, radius);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.4, colors.primaryLight);
      grad.addColorStop(0.8, colors.primary);
      grad.addColorStop(1, colors.primaryHover);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.font = `bold ${radius * 0.85}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 0, 1);
      const sparkle = Math.sin(Date.now() * 0.003 + x * 0.1) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkle * alpha * 0.8})`;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawBill = (ctx, x, y, size, rotation, alpha, colors) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      const w = size * 1.8;
      const h = size * 0.9;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 4);
      ctx.fill();
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 3);
      ctx.stroke();
      ctx.fillStyle = colors.primary;
      ctx.font = `bold ${h * 0.5}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0);
      const sparkle = Math.sin(Date.now() * 0.002 + y * 0.08) * 0.5 + 0.5;
      ctx.globalAlpha = alpha * sparkle * 0.6;
      ctx.beginPath();
      ctx.arc(w / 2 - 4, -h / 2 + 4, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();
    };

    const drawBubble = (ctx, x, y, radius, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha * 0.7;
      const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-radius * 0.4, -radius * 0.4, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      ctx.restore();
    };

    const drawLeaf = (ctx, x, y, size, rotation, alpha, colors) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colors.primaryLight;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size, -size * 0.5, 0, size);
      ctx.quadraticCurveTo(-size, -size * 0.5, 0, -size);
      ctx.fill();
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const drawSun = (ctx, x, y, radius, rotation, alpha, colors) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colors.primaryLight;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.7);
        ctx.lineTo(radius * 0.15, -radius);
        ctx.lineTo(-radius * 0.15, -radius);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawPetal = (ctx, x, y, size, rotation, alpha, colors) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colors.primaryLight;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(size * 0.8, -size * 0.2, size * 0.8, -size * 1.2, 0, -size);
      ctx.bezierCurveTo(-size * 0.8, -size * 1.2, -size * 0.8, -size * 0.2, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const drawCat = (ctx, x, y, size, rotation, alpha, colors) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      const r = size * 0.8;
      // Head
      ctx.fillStyle = colors.primaryLight;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.5);
      ctx.lineTo(-r * 0.9, -r * 1.3);
      ctx.lineTo(-r * 0.3, -r * 0.9);
      ctx.moveTo(r * 0.8, -r * 0.5);
      ctx.lineTo(r * 0.9, -r * 1.3);
      ctx.lineTo(r * 0.3, -r * 0.9);
      ctx.fill();
      // Dollar Eyes
      ctx.fillStyle = colors.primary;
      ctx.font = `bold ${r * 0.6}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', -r * 0.35, -r * 0.1);
      ctx.fillText('$', r * 0.35, -r * 0.1);
      // Nose
      ctx.fillStyle = colors.primaryHover;
      ctx.beginPath();
      ctx.arc(0, r * 0.2, r * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (ctx, x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.2, -size * 0.2);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.2, size * 0.2);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.2, size * 0.2);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.2, -size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      const colors = getThemeColors();
      
      ctx.clearRect(0, 0, width, height);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, colors.bgApp);
      bgGrad.addColorStop(0.5, colors.primaryHover);
      bgGrad.addColorStop(1, colors.primaryHover);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const glowGrad = ctx.createRadialGradient(width * 0.3, height * 0.2, 0, width * 0.3, height * 0.2, width * 0.6);
      glowGrad.addColorStop(0, `${colors.primaryLight}1E`);
      glowGrad.addColorStop(1, 'rgba(232, 222, 245, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width * 0.75, height * 0.6, 0, width * 0.75, height * 0.6, width * 0.4);
      glow2.addColorStop(0, `${colors.textMain}10`);
      glow2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      moneyItems.forEach(item => {
        item.y += item.vy;
        item.x += item.vx + Math.sin(item.wobbleOffset) * 0.3;
        item.wobbleOffset += item.wobbleSpeed;
        item.rotation += item.rotSpeed;
        item.shimmer += item.shimmerSpeed;

        if (item.y > height + 60) {
          Object.assign(item, createItem(-40));
        }
        if (item.x < -60) item.x = width + 60;
        if (item.x > width + 60) item.x = -60;

        const shimmerAlpha = Math.sin(item.shimmer) * 0.15 + 0.85;

        // Render based on theme
        if (colors.preset === 'ocean') {
          if (item.type === 'primary') drawBubble(ctx, item.x, item.y, item.size * 0.6, item.alpha * shimmerAlpha);
          else drawCoin(ctx, item.x, item.y, item.size * 0.4, item.alpha * shimmerAlpha, colors);
        } else if (colors.preset === 'mint' || colors.preset === 'forest') {
          if (item.type === 'primary') drawLeaf(ctx, item.x, item.y, item.size * 0.6, item.rotation, item.alpha * shimmerAlpha, colors);
          else drawCoin(ctx, item.x, item.y, item.size * 0.4, item.alpha * shimmerAlpha, colors);
        } else if (colors.preset === 'sunset') {
          if (item.type === 'primary') drawSun(ctx, item.x, item.y, item.size * 0.6, item.rotation, item.alpha * shimmerAlpha, colors);
          else drawCoin(ctx, item.x, item.y, item.size * 0.4, item.alpha * shimmerAlpha, colors);
        } else if (colors.preset === 'rose') {
          if (item.type === 'primary') drawPetal(ctx, item.x, item.y, item.size * 0.6, item.rotation, item.alpha * shimmerAlpha, colors);
          else drawCoin(ctx, item.x, item.y, item.size * 0.4, item.alpha * shimmerAlpha, colors);
        } else if (colors.preset === 'cute_cat') {
          if (item.type === 'primary') drawCat(ctx, item.x, item.y, item.size * 0.8, item.rotation, item.alpha * shimmerAlpha, colors);
          else drawCoin(ctx, item.x, item.y, item.size * 0.4, item.alpha * shimmerAlpha, colors);
        } else if (colors.preset === 'dark') {
          if (item.type === 'primary') drawCoin(ctx, item.x, item.y, item.size * 0.5, item.alpha * shimmerAlpha * 0.5, colors);
          else drawBill(ctx, item.x, item.y, item.size, item.rotation, item.alpha * shimmerAlpha * 0.5, colors);
        } else {
          // Default purple / cream / others
          if (item.type === 'primary') drawCoin(ctx, item.x, item.y, item.size * 0.5, item.alpha * shimmerAlpha, colors, 'RM');
          else drawBill(ctx, item.x, item.y, item.size, item.rotation, item.alpha * shimmerAlpha, colors);
        }

        if (Math.sin(item.shimmer * 2) > 0.92) {
          drawSparkle(ctx, item.x + item.size * 0.6, item.y - item.size * 0.6, 3, item.alpha * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="glitter-canvas-container">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}