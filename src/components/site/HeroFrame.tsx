"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Rounded card on load; expands to full-bleed as the page scrolls. */
export default function HeroFrame({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const gutter = window.innerWidth >= 1024 ? 24 : 16;
      const t = reduced ? 0 : Math.min(1, window.scrollY / 320);
      const p = 1 - t * t * (3 - 2 * t);
      el.style.clipPath = `inset(0px ${p * gutter}px round ${p * 24}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className} data-header-dark="">
      {children}
    </div>
  );
}
