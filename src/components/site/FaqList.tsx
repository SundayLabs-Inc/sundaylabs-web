"use client";

import { useState, useSyncExternalStore } from "react";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHash() {
  return window.location.hash;
}

function getServerHash() {
  return "";
}

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const match = /^#faq-(\d+)$/.exec(hash);
  const linkedIndex = match ? Number(match[1]) : -1;

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => {
        const isOpen = open[index] ?? index === linkedIndex;
        return (
          <div key={item.q} id={`faq-${index}`} className="rounded-[20px] bg-[#f3f3f0] px-5 lg:rounded-[24px] lg:px-8">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpen((current) => ({ ...current, [index]: !isOpen }))}
              className="flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left text-[16px] font-medium leading-relaxed text-ink lg:py-7 lg:text-[18px]"
            >
              <span>{item.q}</span>
              <svg
                className={`mt-1.5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div id={`faq-panel-${index}`} className={`faq-panel ${isOpen ? "is-open" : ""}`}>
              <div className="faq-panel-inner">
                <p
                  className={`pb-6 text-[16px] leading-[1.75] text-ink transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:pb-7 ${isOpen ? "translate-y-0 opacity-100 delay-[60ms]" : "-translate-y-1.5 opacity-0"}`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
