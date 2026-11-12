import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { guides, type GuideKey } from "@/content/guides";
import { absoluteUrl, SITE_URL, CONTENT_UPDATED } from "@/lib/seo";

export default function ServiceGuide({ guideKey }: { guideKey: GuideKey }) {
  const guide = guides[guideKey];
  const url = absoluteUrl(`/${guideKey}`);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: guide.title, description: guide.description, inLanguage: "ja-JP", dateModified: CONTENT_UPDATED, isPartOf: { "@id": `${SITE_URL}/#website` }, publisher: { "@id": `${SITE_URL}/#organization` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "SundayLabs", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: guide.title, item: url },
      ] },
    ],
  };
  return <SiteShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-4xl px-6 pt-8 pb-24 lg:px-10">
      <nav aria-label="パンくずリスト" className="mb-8 text-sm"><Link href="/" className="underline underline-offset-4">SundayLabs</Link><span aria-hidden="true"> / </span><span>{guide.title}</span></nav>
      <h1 className="text-3xl leading-snug font-bold lg:text-5xl">{guide.title}</h1>
      <p className="mt-8 text-lg leading-loose">{guide.lead}</p>
      {guide.sections.map(section => <section key={section.title} className="mt-12">
        <h2 className="text-2xl leading-snug font-bold">{section.title}</h2>
        <p className="mt-5 leading-loose">{section.body}</p>
      </section>)}
      <aside className="mt-14 border-t border-gray-200 pt-8">
        <p className="text-sm">運営：<Link href="/company" className="underline underline-offset-4">SundayLabs株式会社</Link></p>
        <p className="mt-5"><Link href={guide.related} className="font-medium underline underline-offset-4">{guide.relatedLabel}</Link></p>
        <Link href="/contact" className="mt-8 inline-block rounded-full bg-[#e73b09] px-7 py-4 font-bold text-white">導入について相談する</Link>
      </aside>
    </article>
  </SiteShell>;
}
