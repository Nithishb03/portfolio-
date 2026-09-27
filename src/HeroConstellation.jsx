import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function HeroConstellation({
  className = '',
  children,
  showTag = true,
  showHUD = false,
  particleCountMultiplier = 1,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse state relative to canvas
    const mouse = {
      x: null,
      y: null,
      targetX: null,
      targetY: null,
      radius: 140,
      active: false,
    };

    // Color palette matching the site
    const colors = [
      { r: 218, g: 241, b: 222 }, // #DAF1DE (bright light green)
      { r: 142, g: 182, b: 155 }, // #8EB69B (sage green)
      { r: 35,  g: 83,  b: 71  }, // #235347 (deep forest green)
    ];

    let particles = [];

    const initParticles = () => {
      const area = width * height;
      // 40-70 particles depending on container dimensions
      const baseCount = Math.max(35, Math.min(65, Math.floor(area / 3200)));
      const count = Math.max(25, Math.floor(baseCount * particleCountMultiplier));
      particles = [];

      for (let i = 0; i < count; i += 1) {
        const colorObj = colors[Math.floor(Math.random() * colors.length)];
        const speedMultiplier = reduced ? 0.05 : 0.45;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.2 + Math.random() * 0.5) * speedMultiplier;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseRadius: 1.2 + Math.random() * 1.8,
          color: colorObj,
          baseAlpha: 0.35 + Math.random() * 0.55,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();

    // Mouse listeners
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.targetX = null;
      mouse.targetY = null;
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const maxDist = 95;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Smooth mouse coordinates
      if (mouse.active && mouse.targetX !== null && mouse.targetY !== null) {
        if (mouse.x === null || mouse.y === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.15;
          mouse.y += (mouse.targetY - mouse.y) * 0.15;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // Draw mouse cursor glow if inside
      if (mouse.x !== null && mouse.y !== null) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius
        );
        mouseGlow.addColorStop(0, 'rgba(142, 182, 155, 0.12)');
        mouseGlow.addColorStop(1, 'rgba(142, 182, 155, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();

        // Small focal cursor dot
        ctx.fillStyle = 'rgba(218, 241, 222, 0.65)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      const count = particles.length;
      for (let i = 0; i < count; i += 1) {
        const p = particles[i];

        // Motion update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with small padding
        const pad = 10;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // Interactive mouse interaction (gentle proximity attraction)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 2) {
            const force = (1 - dist / mouse.radius) * 0.08;
            p.x += dx * force;
            p.y += dy * force;

            // Draw circuit line to mouse
            const mouseLineAlpha = (1 - dist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(218, 241, 222, ${mouseLineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw connections between particle pairs
        for (let j = i + 1; j < count; j += 1) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.35 * Math.min(p.baseAlpha, p2.baseAlpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(142, 182, 155, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Particle rendering with subtle pulsation
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.25 + 0.75;
        const currentAlpha = p.baseAlpha * pulse;
        const currentRadius = p.baseRadius * (0.9 + pulse * 0.2);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha.toFixed(3)})`;
        ctx.fill();

        // Soft outer glow for brightest particles
        if (p.color.r === 218) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(currentAlpha * 0.2).toFixed(3)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reduced, particleCountMultiplier]);

  return (
    <div ref={containerRef} className={`hero__constellation-wrap ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="hero__constellation-canvas" />
      <div className="hero__constellation-corner hero__constellation-corner--tl" />
      <div className="hero__constellation-corner hero__constellation-corner--br" />
      {showTag && <span className="hero__constellation-tag">// NEURAL SIGNAL</span>}
      {showHUD && (
        <div className="hero__constellation-hud">
          <span className="hero__constellation-hud-status">
            <i className="hud-pulse" /> ONLINE
          </span>
          <span className="hero__constellation-hud-nodes">ACTIVE MESH</span>
        </div>
      )}
      {children}
    </div>
  );
}
