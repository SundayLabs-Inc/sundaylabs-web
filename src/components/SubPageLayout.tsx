import SiteShell from "@/components/site/SiteShell";
import type { Locale } from "@/constants/site";
import type { ReactNode } from "react";

export default function SubPageLayout({
  title,
  headingId,
  children,
  centered = false,
}: {
  locale: Locale;
  title: string;
  headingId: string;
  children: ReactNode;
  panel?: boolean;
  centered?: boolean;
}) {
  return (
    <SiteShell>
      <section
        aria-labelledby={headingId}
        className={centered ? "mx-auto w-full max-w-[808px] px-5 pt-16 pb-24 lg:px-6 lg:pt-20 lg:pb-28" : "grid gap-10 px-4 pt-16 pb-24 lg:grid-cols-12 lg:gap-6 lg:px-6 lg:pt-28 lg:pb-36"}
      >
        <h1
          id={headingId}
          className={`text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[44px] ${centered ? "mb-7 text-center" : "lg:col-span-4"}`}
        >
          {title}
        </h1>
        <div className={centered ? "" : "lg:col-span-8"}>{children}</div>
      </section>
    </SiteShell>
  );
}
