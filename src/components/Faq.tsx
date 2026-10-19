"use client";

import { useState } from "react";
import { getSite, type Locale } from "@/constants/site";

export default function Faq({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const { faqs } = site;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faqs" className="scroll-mt-24 bg-bg px-4 pb-32 text-primary lg:px-6 lg:pb-48">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-full lg:col-span-6">
          <h2 className="text-2xl leading-snug lg:text-[2rem]">{site.nav.faqs}</h2>
        </div>
        <div className="col-span-full lg:col-span-6">
          <div className="flex w-full flex-col" role="presentation">
            {faqs.map((item, index) => {
              const isOpen = open === index;
              return (
                <div id={`faq-${index}`} key={item.question} className="overflow-hidden border-t border-border last:border-b">
                  <h3 className="m-0 font-normal">
                  <button
                    id={`faq-${index}-btn`}
                    type="button"
                    aria-controls={`faq-${index}-panel`}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left"
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span className="max-w-[60ch] flex-1 body-1">
                      {item.question}
                    </span>
                    <span
                      className="inline-flex shrink-0 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                      aria-hidden="true"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </button>
                  </h3>
                  <div
                    id={`faq-${index}-panel`}
                    role="region"
                    aria-labelledby={`faq-${index}-btn`}
                    className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0.6 }}
                  >
                    <div className="min-h-0">
                      <div className="pb-6 body-1 text-secondary">
                        <p className="[&+&]:mt-[1em]">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
