import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteShell from "@/components/site/SiteShell";
import type { Locale } from "@/constants/site";
import type { ReactNode } from "react";

export default function SubPageLayout({
  locale,
  title,
  headingId,
  children,
  panel,
}: {
  locale: Locale;
  title: string;
  headingId: string;
  children: ReactNode;
  panel?: boolean;
}) {
  if (locale === "ja") {
    return (
      <SiteShell>
        <section
          aria-labelledby={headingId}
          className="grid gap-10 px-4 pt-16 pb-24 lg:grid-cols-12 lg:gap-6 lg:px-6 lg:pt-28 lg:pb-36"
        >
          <h1
            id={headingId}
            className="text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:col-span-4 lg:text-[44px]"
          >
            {title}
          </h1>
          <div className="lg:col-span-8">{children}</div>
        </section>
      </SiteShell>
    );
  }

  const body = (
    <>
      <h1 id={headingId} className="heading-1">
        {title}
      </h1>
      {children}
    </>
  );

  return (
    <>
      <Header locale={locale} />
      <div className="content-wrapper">
        <main className="pt-24 lg:pt-28">
          <section
            className="page-pad section-block"
            aria-labelledby={headingId}
          >
            {panel ? (
              <div className="contact-surface rounded-xl px-4 py-10 lg:px-8 lg:py-16">
                <div className="mx-auto w-full max-w-[720px]">{body}</div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-[720px]">{body}</div>
            )}
          </section>
        </main>
      </div>
      <Footer locale={locale} />
    </>
  );
}
