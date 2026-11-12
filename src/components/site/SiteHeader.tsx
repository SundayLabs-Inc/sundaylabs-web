"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PillLink from "@/components/site/PillLink";
import Wordmark from "@/components/site/Wordmark";
import { brand, nav, contactCta } from "@/content/home";

export default function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let travel = 0;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - previousY;
      previousY = y;
      if (y <= 96) {
        travel = 0;
        setHidden(false);
        return;
      }
      if (delta === 0) return;
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (Math.abs(travel) >= 8) {
        setHidden(travel > 0);
        travel = 0;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    {minimal && <div aria-hidden="true" className="h-[88px] shrink-0 lg:h-24" />}
    <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-200 motion-reduce:transition-none focus-within:translate-y-0 ${hidden && !open ? "-translate-y-full" : "translate-y-0"} ${minimal ? "site-content bg-white py-4" : "p-2 lg:p-4"}`}>
      <div className={`flex h-14 items-center justify-between lg:h-16 ${minimal ? "bg-white" : "rounded-full bg-white/95 pr-1.5 pl-6 backdrop-blur-xl lg:pr-2 lg:pl-8"}`}>
        <Link href="/" className="flex items-center text-ink" onClick={() => setOpen(false)}>
          <Wordmark name={brand.name} className="h-[16px] translate-y-[2px] lg:h-[18px]" />
        </Link>

        <div className="flex items-center gap-5 xl:gap-8">
          <nav aria-label="メイン" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-8">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap text-[13px] text-ink transition-opacity hover:opacity-50 xl:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <PillLink href={contactCta.href} className="border-0! bg-[#e73b09]! text-white! hover:bg-[#ca3308]! h-10! w-auto! px-5! text-[13px]! lg:h-11! lg:px-6!">
              {contactCta.label}
            </PillLink>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="mt-2 rounded-[28px] bg-white px-6 pt-2 pb-6 lg:hidden"
      >
        <nav aria-label="モバイル" className="flex flex-col">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-4 text-base text-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4">
            <PillLink href={contactCta.href} onClick={() => setOpen(false)} className="w-full border-0! bg-[#e73b09]! text-white! hover:bg-[#ca3308]!">
              {contactCta.label}
            </PillLink>
          </div>
        </nav>
      </div>
    </header>
    </>
  );
}
