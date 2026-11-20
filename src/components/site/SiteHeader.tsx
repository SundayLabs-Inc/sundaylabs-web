"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Wordmark from "@/components/site/Wordmark";
import { brand, nav, contactCta } from "@/content/home";

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [onHero, setOnHero] = useState(overlay);
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        light
          ? "bg-transparent text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] transition-colors duration-300"
          : "bg-white text-ink  transition-colors duration-300"
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
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#4e80ee] px-7 text-[15px] font-medium text-white transition-colors hover:bg-[#386bd5]"
          >
            {contactCta.label}
          </Link>

        </div>
      </div>

    </header>
  );
}
