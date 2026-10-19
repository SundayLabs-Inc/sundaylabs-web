"use client";

import { useEffect } from "react";

/** Shrinks the page body into a rounded card as the footer scrolls into view. */
export default function FooterMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".content-wrapper");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const reset = () => {
      root.style.transform = "";
      root.style.clipPath = "";
    };
    const update = () => {
      frame = 0;
      if (reduced) return reset();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fromEnd = max - window.scrollY;
      const t = Math.min(1, Math.max(0, (360 - fromEnd) / 300));
      const p = t * t * (3 - 2 * t);
      if (p <= 0) return reset();
      root.style.transform = `scale(${1 - p * 0.033333})`;
      root.style.clipPath = `inset(0px round ${p * 24}px)`;
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
      reset();
    };
  }, []);

  return null;
}
