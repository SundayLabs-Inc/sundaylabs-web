import type { ReactNode } from "react";

const tones = {
  white: "bg-white",
  cream: "bg-cream",
  sand: "bg-sand",
  sky: "bg-sky",
  blush: "bg-[#FDF7EA]",
} as const;

/** Rounded-top panel that overlaps the one before it. */
export default function Section({
  id,
  labelledBy,
  tone = "white",
  overlap = true,
  className = "",
  children,
}: {
  id?: string;
  labelledBy?: string;
  tone?: keyof typeof tones;
  overlap?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative scroll-mt-24 px-6 pt-14 pb-28 lg:px-20 lg:pt-20 lg:pb-40 ${
        overlap ? "-mt-14 rounded-t-[32px] lg:-mt-20 lg:rounded-t-[48px]" : ""
      } ${tones[tone]} ${className}`}
    >
      <div className="mx-auto max-w-[1280px]">{children}</div>
    </section>
  );
}

export function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="display text-[44px] text-ink lg:text-[56px]">
      {children}
    </h2>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[24px] font-bold leading-[1.5] tracking-[0.03em] text-ink lg:text-[32px]">{children}</h3>
  );
}

export const bodyText = "text-[15px] font-bold leading-[2.2] lg:text-base";
