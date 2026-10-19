"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand, nav, contactCta } from "@/content/home";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const logo = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const overlapsLogo = (el: Element) => {
      const logoRect = logo.current?.getBoundingClientRect();
      if (!logoRect) return false;
      const r = el.getBoundingClientRect();
      return r.bottom > logoRect.top && r.top < logoRect.bottom && r.right > logoRect.left && r.left < logoRect.right;
    };
    const checkBackdrop = () => {
      frame = 0;
      setOnDark([...document.querySelectorAll("[data-header-dark]")].some(overlapsLogo));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(checkBackdrop);
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setHidden(y > lastY && y > 64);
      lastY = y;
    };
    checkBackdrop();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
      <header
        className={`sticky top-0 z-50 transition-[translate] duration-300 ${open ? "bg-white" : "bg-transparent"} ${
          hidden && !open ? "-translate-y-full focus-within:translate-y-0" : ""
        }`}
      >
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-[1fr_auto_1fr] lg:px-6">
          <Link
            ref={logo}
            href="/"
            className="flex items-center justify-self-start"
            onClick={() => setOpen(false)}
          >
            <Image
              src={brand.logo.src}
              width={brand.logo.width}
              height={brand.logo.height}
              alt={brand.name}
              priority
              className={`h-[18px] w-auto transition-[filter] duration-300 lg:h-5 ${
                onDark && !open ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <nav aria-label="メイン" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href={contactCta.href}
            className="group hidden items-center gap-3 justify-self-end rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-[13px] font-medium text-white transition-colors hover:bg-ink/85 md:inline-flex"
          >
            {contactCta.label}
            <ArrowIcon className="h-7 w-7 bg-white text-ink" />
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-paper md:hidden"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" />
              ) : (
                <path d="M2 7h16M2 13h16" stroke="currentColor" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Kept outside <header>: its transform would become the containing block for `fixed`. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-50 bg-white px-4 pt-4 pb-10 md:hidden"
      >
        <nav aria-label="モバイル" className="flex h-full flex-col">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-5 text-xl font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={contactCta.href}
            onClick={() => setOpen(false)}
            className="mt-auto flex h-14 w-full items-center justify-between rounded-full bg-ink pr-2 pl-6 text-[15px] font-medium text-white"
          >
            {contactCta.label}
            <ArrowIcon className="h-10 w-10 bg-white text-ink" />
          </Link>
        </nav>
      </div>
    </>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}
