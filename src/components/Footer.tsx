"use client";

import { useEffect } from "react";
import { getRail } from "@/constants/rail";
import { getSite, type Locale } from "@/constants/site";
import InteractiveFooterCanvas from "@/components/InteractiveFooterCanvas";
import "./footer-motion.css";

export default function Footer({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const rail = getRail(locale);
  const prefix = locale === "en" ? "/en" : "";
  const home = locale === "en" ? "/en" : "/";

  const links = [
    { label: rail.nav.services, href: `${home}#services` },
    { label: site.nav.faqs, href: `${home}#faqs` },
    { label: site.footer.company, href: `${prefix}/company` },
    { label: site.footer.contact, href: `${prefix}/contact` },
    { label: site.footer.privacy, href: `${prefix}/privacy` },
  ];

  useEffect(() => {
    const root = document.querySelector(".content-wrapper") as HTMLElement | null;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced) {
        root.style.transform = "";
        root.style.clipPath = "";
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fromEnd = max - window.scrollY;
      const t = Math.min(1, Math.max(0, (360 - fromEnd) / 300));
      const p = t * t * (3 - 2 * t);
      if (p <= 0) {
        root.style.transform = "";
        root.style.clipPath = "";
        return;
      }
      const scale = 1 - p * (1 - 0.966667);
      const radius = p * 24;
      root.style.transform = `scale(${scale})`;
      root.style.clipPath = `inset(0px round ${radius}px)`;
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
      root.style.transform = "";
      root.style.clipPath = "";
    };
  }, []);

  return (
    <footer className="site-footer-shell">
      <div className="site-footer">
        <InteractiveFooterCanvas />

        <div className="site-footer-main">
          <a href={home} className="site-footer-brand" aria-label="Home">
            <img src="/images/logo-mark.png" alt={site.name} />
          </a>
          <nav className="site-footer-nav" aria-label="Footer">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="site-footer-link">
                <span className="site-footer-link-dot" aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <p className="site-footer-copy">{site.copyright}</p>
      </div>
    </footer>
  );
}
