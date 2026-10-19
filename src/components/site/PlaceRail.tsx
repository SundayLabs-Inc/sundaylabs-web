"use client";

import { useEffect, useRef, useState } from "react";
import MediaFrame from "@/components/site/MediaFrame";
import type { Media } from "@/content/home";

type Place = { id?: string; title: string; body: string; media: Media };

export default function PlaceRail({ items, label }: { items: Place[]; label: string }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  return (
    <div>
      <div className={`mb-6 hidden justify-end gap-2 ${edge.start && edge.end ? "" : "md:flex"}`}>
        <RailButton label="前へ" disabled={edge.start} onClick={() => scroll(-1)} flip />
        <RailButton label="次へ" disabled={edge.end} onClick={() => scroll(1)} />
      </div>
      <ul
        ref={rail}
        aria-label={label}
        className="site-rail -mx-4 flex snap-x [&>li:first-child]:ms-auto [&>li:last-child]:me-auto snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 lg:-mx-6 lg:scroll-px-6 lg:px-6"
      >
        {items.map((item) => (
          <li
            key={item.title}
            id={item.id}
            className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[calc((100vw-48px-32px)/3.4)]"
          >
            <MediaFrame media={item.media} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 30vw, 78vw" />
            <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.9] text-ink-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  flip = false,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:bg-paper disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={flip ? "rotate-180" : ""}>
        <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
