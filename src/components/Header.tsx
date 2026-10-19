"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getRail } from "@/constants/rail";
import { getSite, type Locale } from "@/constants/site";

const pill = "flex rounded-[10px] bg-[#e8e3d8b3] p-[5px] backdrop-blur-[57px]";
const item =
  "flex items-center rounded-md px-2.5 py-2 text-sm leading-none tracking-[-0.01em] text-[#292827] transition-colors duration-200 hover:bg-[#fffc]";

export default function Header({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const rail = getRail(locale);
  const pathname = usePathname() ?? "/";
  const home = locale === "en" ? "/en" : "/";
  const prefix = locale === "en" ? "/en" : "";
  const contactHref = `${prefix}/contact`;
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [hidden, setHidden] = useState(false);

  const basePath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const otherLang =
    locale === "ja"
      ? { label: "EN", href: basePath === "/" ? "/en" : `/en${basePath}` }
      : { label: "JP", href: basePath };

  const links = [
    { label: rail.nav.services, href: `${home}#services` },
    { label: site.nav.faqs, href: `${home}#faqs` },
    { label: site.footer.company, href: `${prefix}/company` },
  ];

  useEffect(() => {
    const media = document.querySelector("[data-hero-media]");
    let frame = 0;
    let last = window.scrollY;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (media) {
        const rect = media.getBoundingClientRect();
        setOnDark(rect.top < 64 && rect.bottom > 28);
      }
      if (y < 8) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-transform duration-300 ease-out ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
      <div className="relative mx-auto flex h-[88px] items-center justify-center px-4 lg:h-[100px] lg:px-6">
        <a
          href={home}
          aria-label="Home"
          className={`pointer-events-auto absolute left-4 flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-75 lg:left-6 ${
            onDark ? "text-white" : "text-[#292827]"
          }`}
        >
          <img
            src="/images/logo-mark.png"
            alt={site.name}
            className={`h-8 w-auto lg:h-9 ${onDark ? "invert" : ""}`}
          />
        </a>

        <nav aria-label="Main" className="pointer-events-auto hidden items-stretch md:flex">
          <div className={pill}>
            {links.map((link) => (
              <a key={link.href} href={link.href} className={item}>
                {link.label}
              </a>
            ))}
            <a href={otherLang.href} className={`${item} font-mono text-xs`}>
              {otherLang.label}
            </a>
          </div>
        </nav>

        <div className={`${pill} pointer-events-auto absolute right-4 hidden md:flex lg:right-6`}>
          <a href={contactHref} className={item}>
            {site.nav.contact}
          </a>
        </div>

        <button
          type="button"
          className={`${pill} pointer-events-auto absolute right-4 h-[42px] items-center px-3 md:hidden`}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="text-sm leading-none text-[#292827]">Menu</span>
        </button>
      </div>
      </div>

      <div
        className={`fixed inset-0 flex min-h-dvh flex-col bg-[#292827] pt-[140px] text-[#f0eee9] transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute top-6 right-4 h-[42px] rounded-[10px] bg-white/10 px-3 text-sm leading-none"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <nav aria-label="Mobile" className="flex flex-col">
          {[...links, { label: site.nav.contact, href: contactHref }].map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="border-b border-white/20 px-[30px] py-3 text-xl"
            >
              {link.label}
            </a>
          ))}
          <a href={otherLang.href} tabIndex={open ? 0 : -1} className="px-[30px] py-3 font-mono text-sm text-white/60">
            {otherLang.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
