import { getSite, type Locale } from "@/constants/site";

export default function Spotlight({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const contactHref = locale === "en" ? "/en/contact" : "/contact";

  return (
    <section className="bg-bg px-4 pb-4 text-primary lg:px-6 lg:pb-6">
      <div className="flex flex-col items-center rounded-xl bg-surface px-6 py-16 text-center sm:px-10 lg:px-14 lg:py-24">
        <h2 className="text-3xl leading-snug lg:text-4xl">{site.contact.title}</h2>
        {site.contact.body ? (
          <p className="mt-4 max-w-xl body-1 text-secondary">{site.contact.body}</p>
        ) : null}
        <a
          href={contactHref}
          className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-base text-white transition-opacity hover:opacity-80"
        >
          {site.contact.cta}
        </a>
      </div>
    </section>
  );
}
