"use client";

import { useEffect, useRef } from "react";

interface InteractiveFooterCanvasProps {
  className?: string;
}

export default function InteractiveFooterCanvas({
  className = "",
}: InteractiveFooterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animId = 0;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Pointer state
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isHovered = false;
    let hoverStrength = 0;
    let lastMoveTime = 0;

    // Autopilot ambient wave time
    let time = Math.random() * 100;

    const SPACING = 24; // Distance between dots in px
    const BASE_RADIUS = 1.1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      isHovered = true;
      lastMoveTime = performance.now();
    };

    const handlePointerLeave = () => {
      isHovered = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      parent.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
      });
    }

    const render = () => {
      if (!ctx || width <= 0 || height <= 0) return;

      time += 0.018;

      // Smooth pointer interpolation
      if (isHovered) {
        hoverStrength += (1 - hoverStrength) * 0.1;
      } else {
        hoverStrength += (0 - hoverStrength) * 0.05;
      }

      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      // Autopilot idle motion when no pointer active
      const now = performance.now();
      const idleTime = now - lastMoveTime;
      let autoX = width * 0.5;
      let autoY = height * 0.5;
      if (idleTime > 1500) {
        const autoAmp = Math.min((idleTime - 1500) / 3000, 1);
        autoX =
          width * 0.5 +
          Math.sin(time * 0.8) * (width * 0.35) * autoAmp;
        autoY =
          height * 0.5 +
          Math.cos(time * 0.6) * (height * 0.35) * autoAmp;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * SPACING;
          const originY = offsetY + r * SPACING;

          // Ambient sine wave field
          const wave =
            Math.sin(c * 0.18 + time * 0.7) *
            Math.cos(r * 0.18 - time * 0.5);
          const ambientAlpha = 0.14 + 0.08 * (wave * 0.5 + 0.5);

          // Pointer interaction field (ripple + repulsion + brightness boost)
          let dx = currentX - originX;
          let dy = currentY - originY;
          let distSq = dx * dx + dy * dy;
          let pointerEffect = 0;
          let repelX = 0;
          let repelY = 0;

          const radius = 130;
          const radiusSq = radius * radius;

          if (hoverStrength > 0.01 && distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const norm = 1 - dist / radius;
            pointerEffect = norm * norm * hoverStrength;

            // Fluid ripple push
            const pushAngle = Math.atan2(dy, dx);
            const pushForce = Math.sin(norm * Math.PI) * 7 * hoverStrength;
            repelX = -Math.cos(pushAngle) * pushForce;
            repelY = -Math.sin(pushAngle) * pushForce;
          }

          // Idle ambient wave pointer
          if (idleTime > 1500) {
            const adx = autoX - originX;
            const ady = autoY - originY;
            const adistSq = adx * adx + ady * ady;
            const aradius = 160;
            const aradiusSq = aradius * aradius;
            if (adistSq < aradiusSq) {
              const adist = Math.sqrt(adistSq);
              const anorm = 1 - adist / aradius;
              const autoEffect = anorm * anorm * 0.45;
              if (autoEffect > pointerEffect) {
                pointerEffect = autoEffect;
              }
            }
          }

          const posX = originX + repelX;
          const posY = originY + repelY;

          const dotRadius =
            BASE_RADIUS * (1 + pointerEffect * 1.6 + wave * 0.15);
          const totalAlpha = Math.min(
            1,
            ambientAlpha + pointerEffect * 0.75
          );

          // Render dot
          ctx.beginPath();
          ctx.arc(posX, posY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${totalAlpha.toFixed(3)})`;
          ctx.fill();

          // Subtle glowing halo for active hovered dots
          if (pointerEffect > 0.35) {
            ctx.beginPath();
            ctx.arc(posX, posY, dotRadius * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${(
              (pointerEffect - 0.35) *
              0.12
            ).toFixed(3)})`;
            ctx.fill();
          }
        }
      }

      ctx.restore();

      if (!reducedMotion && isVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    const startAnimation = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(render);
    };

    const stopAnimation = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    };

    // IntersectionObserver to pause when out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          resize();
          if (reducedMotion) {
            render();
          } else {
            startAnimation();
          }
        } else {
          stopAnimation();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion && isVisible) render();
    });
    if (parent) resizeObserver.observe(parent);

    const handleVisibility = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (isVisible && !reducedMotion) {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    resize();

    return () => {
      stopAnimation();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (parent) {
        parent.removeEventListener("pointermove", handlePointerMove);
        parent.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full select-none ${className}`}
      aria-hidden="true"
    />
  );
}
