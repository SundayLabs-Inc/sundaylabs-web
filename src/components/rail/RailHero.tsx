"use client";

import { useEffect, useRef } from "react";
import { getRail } from "@/constants/rail";
import { getSite, type Locale } from "@/constants/site";

export default function RailHero({ locale }: { locale: Locale }) {
  const rail = getRail(locale);
  const site = getSite(locale);
  const headline = [rail.hero.title, rail.hero.sub].join(locale === "en" ? " " : "");
  const headlineClass =
    "max-w-[22em] px-4 text-center font-heading text-[1.75rem] leading-[1.3] text-balance sm:text-4xl lg:text-5xl lg:leading-[1.25] [word-break:auto-phrase]";
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = media.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const entry = Math.min(Math.max(window.scrollY / start, 0), 1);
      const exit = Math.min(
        Math.max((window.innerHeight - rect.bottom) / (window.innerHeight * 0.5), 0),
        1,
      );
      media.style.setProperty("--entry-progress", entry.toFixed(4));
      media.style.setProperty("--exit-progress", exit.toFixed(4));
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
    <section
      id="introduction-hero"
      data-page-header="true"
      className="[--border-radius:12px] [--container-padding:16px] lg:[--container-padding:24px]"
    >
      <div className="sticky top-0 flex flex-col items-center gap-3 pt-35 pb-16 text-primary lg:gap-6">
        <h1 className={headlineClass}>{headline}</h1>
      </div>
      <div
        ref={mediaRef}
        data-hero-media=""
        className="relative h-[calc(100svh-15rem)] w-full overflow-hidden bg-black md:h-[calc(100svh-13rem)]"
        style={{
          clipPath:
            "inset(0px calc(var(--container-padding) * (1 - var(--entry-progress))) round calc(var(--border-radius) * (1 - var(--entry-progress))))",
          ["--entry-progress" as string]: 0,
          ["--exit-progress" as string]: 0,
        }}
      >
        <img
          src="/images/hero-vision.jpg"
          alt={site.hero.alt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_78%]"
        />
        <div
          className="fixed top-0 z-10 flex w-full flex-col items-center gap-3 pt-35 pb-16 text-white lg:gap-6"
          style={{
            opacity: "calc(1 - var(--exit-progress))",
            transform: "scale(calc(1 - var(--exit-progress) / 40))",
          }}
          aria-hidden
        >
          <p className={headlineClass}>{headline}</p>
        </div>
      </div>
    </section>
  );
}
