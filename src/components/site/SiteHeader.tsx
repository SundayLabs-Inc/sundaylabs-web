"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Wordmark from "@/components/site/Wordmark";
import { brand, nav, contactCta } from "@/content/home";

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [onHero, setOnHero] = useState(overlay);
  const [hidden, setHidden] = useState(false);
  const light = overlay && onHero;

  useEffect(() => {
    if (!overlay) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnHero(entry.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [overlay]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 48) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        light
          ? "bg-transparent text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
          : "bg-white text-ink"
      }`}
    >
      <div className="flex h-[88px] items-center justify-between mx-auto max-w-[1312px] px-6 md:px-10">
        <Link href="/" className="flex items-center">
          <Wordmark name={brand.name} symbolOnly light={light} className="h-7 lg:h-8" />
        </Link>

        <div className="flex items-center gap-6 xl:gap-10">
          <nav aria-label="メイン" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap text-[16px] transition-opacity hover:opacity-50 xl:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href={contactCta.href}
            className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#4e80ee] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#386bd5] lg:min-h-[52px] lg:px-7 lg:text-[15px]"
          >
            {contactCta.label}
          </Link>

        </div>
      </div>

    </header>
  );
}
