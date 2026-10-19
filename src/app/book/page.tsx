import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingFlow from "@/components/site/BookingFlow";
import SiteShell from "@/components/site/SiteShell";
import { launch } from "@/config/launch";
import { legalDocuments } from "@/config/legal";
import { createSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = createSiteMetadata({
  title: "ご予約 | あしたのロボティクス",
  description: "招待を受けた方専用の予約ページです。",
  path: "/book",
  noindex: true,
});

export default function BookPage() {
  if (!launch.bookingEnabled) notFound();

  const pick = ({ path, title, version }: (typeof legalDocuments)["serviceTerms"]) => ({ path, title, version });

  return (
    <SiteShell>
      <section
        aria-labelledby="book-heading"
        className="grid gap-12 px-4 pt-16 pb-24 lg:grid-cols-12 lg:gap-6 lg:px-6 lg:pt-28 lg:pb-36"
      >
        <div className="lg:col-span-5">
          <h1 id="book-heading" className="text-[36px] font-bold leading-[1.2] tracking-[-0.03em] lg:text-6xl">
            ご予約
          </h1>
          <p className="mt-8 text-[15px] leading-[1.9] text-ink-muted">
            招待コードをお持ちの方のみご利用いただけます。
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <BookingFlow
            docs={{
              serviceTerms: pick(legalDocuments.serviceTerms),
              servicePrivacy: pick(legalDocuments.servicePrivacy),
            }}
          />
        </div>
      </section>
    </SiteShell>
  );
}
