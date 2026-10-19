import type { ReactNode } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        本文へスキップ
      </a>
      <div className="content-wrapper flex flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
