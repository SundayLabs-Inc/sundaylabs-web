import { getSite, type Locale } from "@/constants/site";
import {
  absoluteUrl,
  CONTENT_UPDATED,
  getPagePath,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_ALT,
  type PageKey,
  SITE_URL,
} from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

type JsonLdProps = {
  locale: Locale;
  page: PageKey;
};

type SchemaNode = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const FOUNDER_ID = `${SITE_URL}/#founder`;

function language(locale: Locale): string {
  return locale === "ja" ? "ja-JP" : "en-US";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function copyrightYear(): number {
  const match = getSite("ja").copyright.match(/\d{4}/);
  return match ? Number(match[0]) : 2026;
}

function representativeName(locale: Locale): string {
  const label = locale === "ja" ? "代表者" : "Representative";
  return (
    getSite(locale).company.rows.find((row) => row.label === label)?.value ??
    ""
  );
}

function homeUrl(locale: Locale): string {
  return absoluteUrl(getPagePath(locale, "home"));
}

function organizationSchema(locale: Locale): SchemaNode {
  const site = getSite(locale);
  const content = getSiteContent(locale);
  const ja = getSite("ja");
  const en = getSite("en");

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.legalName,
    legalName: site.legalName,
    alternateName: unique([
      ja.name,
      ja.legalName,
      en.name,
      en.legalName,
      en.nameEn,
    ]),
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl(OG_IMAGE_PATH),
    email: site.email,
    slogan: site.tagline,
    description: content.description,
    knowsAbout: unique([
      locale === "ja" ? "フィジカルAI" : "Physical AI",
      ...content.services.map((item) => item.name),
      locale === "ja" ? "ヒューマノイド" : "humanoid robots",
      locale === "ja" ? "四足歩行ロボット" : "quadruped robots",
      locale === "ja" ? "ロボットアーム" : "robot arms",
      "VLA",
      locale === "ja" ? "模倣学習" : "imitation learning",
      locale === "ja" ? "ロボット制御" : "robot control",
    ]),
    knowsLanguage: ["ja", "en"],
    areaServed: {
      "@type": "Country",
      name: "Japan",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress:
        locale === "ja"
          ? "MIEUX渋谷ビル8階 渋谷区円山町5-3"
          : "MIEUX Shibuya Building 8F, 5-3 Maruyama-cho",
      addressLocality: locale === "ja" ? "渋谷区" : "Shibuya-ku",
      addressRegion: locale === "ja" ? "東京都" : "Tokyo",
      postalCode: "150-0044",
      addressCountry: "JP",
    },
    founder: { "@id": FOUNDER_ID },
    hasOfferCatalog: { "@id": `${homeUrl(locale)}#services` },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      url: absoluteUrl(getPagePath(locale, "contact")),
      availableLanguage: ["Japanese", "English"],
      areaServed: "JP",
    },
  };
}

function founderSchema(locale: Locale): SchemaNode {
  const label = locale === "ja" ? "代表者" : "Representative";
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: representativeName(locale),
    jobTitle: label,
    worksFor: { "@id": ORG_ID },
  };
}

function websiteSchema(locale: Locale): SchemaNode {
  const site = getSite(locale);

  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: locale === "ja" ? site.legalName : site.nameEn,
    alternateName: unique([site.name, site.nameEn, site.legalName]),
    description: getSiteContent(locale).description,
    inLanguage: ["ja-JP", "en-US"],
    publisher: { "@id": ORG_ID },
    copyrightHolder: { "@id": ORG_ID },
    copyrightYear: copyrightYear(),
  };
}

function pageName(locale: Locale, page: PageKey): string {
  const site = getSite(locale);
  const names: Record<PageKey, string> = {
    home: getSiteContent(locale).title,
    company: site.company.title,
    privacy: site.privacy.title,
    contact: site.contact.title,
  };
  return names[page];
}

function pageDescription(locale: Locale, page: PageKey): string {
  const site = getSite(locale);
  const descriptions: Record<PageKey, string> = {
    home: getSiteContent(locale).description,
    company: site.seo.companyDescription,
    privacy: site.seo.privacyDescription,
    contact: site.seo.contactDescription,
  };
  return descriptions[page];
}

function serviceSchemas(locale: Locale): SchemaNode[] {
  const content = getSiteContent(locale);
  const home = homeUrl(locale);

  return content.services.map((item) => ({
    "@type": "Service",
    "@id": `${home}#service-${item.id}`,
    name: item.name,
    description: item.body,
    serviceType: item.name,
    category: locale === "ja" ? "フィジカルAI" : "Physical AI",
    url: `${home}#${item.id}`,
    provider: { "@id": ORG_ID },
    audience: { "@type": "BusinessAudience", name: locale === "ja" ? "法人" : "Businesses" },
    areaServed: { "@type": "Country", name: "Japan" },
    inLanguage: language(locale),
  }));
}

function offerCatalogSchema(locale: Locale): SchemaNode {
  const site = getSite(locale);
  const content = getSiteContent(locale);
  const home = homeUrl(locale);

  return {
    "@type": "OfferCatalog",
    "@id": `${home}#services`,
    name: site.nav.services,
    itemListElement: content.services.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: { "@id": `${home}#service-${item.id}` },
    })),
  };
}

function approachSchema(locale: Locale): SchemaNode {
  const content = getSiteContent(locale);
  const home = homeUrl(locale);

  return {
    "@type": "ItemList",
    "@id": `${home}#approach`,
    name: content.stepsTitle,
    url: `${home}#flow`,
    itemListElement: content.steps.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.title,
      description: step.body,
    })),
  };
}

function faqSchema(locale: Locale): SchemaNode {
  const content = getSiteContent(locale);
  const home = homeUrl(locale);

  return {
    "@type": "FAQPage",
    "@id": `${home}#faq`,
    url: `${home}#faq`,
    inLanguage: language(locale),
    isPartOf: { "@id": `${home}#webpage` },
    mainEntity: content.faqs.map((item, index) => ({
      "@type": "Question",
      "@id": `${home}#faq-${index}`,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function webPageSchema(locale: Locale, page: PageKey): SchemaNode {
  const url = absoluteUrl(getPagePath(locale, page));
  const home = homeUrl(locale);
  const type =
    page === "company" ? "AboutPage" : page === "contact" ? "ContactPage" : "WebPage";

  const node: SchemaNode = {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: pageName(locale, page),
    description: pageDescription(locale, page),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: language(locale),
    dateModified: CONTENT_UPDATED,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(OG_IMAGE_PATH),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      caption: OG_IMAGE_ALT,
    },
  };

  if (page === "home") {
    node.mainEntity = { "@id": ORG_ID };
    node.hasPart = [
      { "@id": `${home}#services` },
      { "@id": `${home}#faq` },
      { "@id": `${home}#approach` },
    ];
  }

  if (page === "company") {
    node.mainEntity = { "@id": ORG_ID };
  }

  return node;
}

function breadcrumbSchema(locale: Locale, page: PageKey): SchemaNode | null {
  if (page === "home") return null;

  const site = getSite(locale);
  const homePath = getPagePath(locale, "home");
  const pagePath = getPagePath(locale, page);

  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(pagePath)}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: site.name,
        item: absoluteUrl(homePath),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName(locale, page),
        item: absoluteUrl(pagePath),
      },
    ],
  };
}

export default function JsonLd({ locale, page }: JsonLdProps) {
  const homeNodes =
    page === "home"
      ? [
          ...serviceSchemas(locale),
          offerCatalogSchema(locale),
          faqSchema(locale),
          approachSchema(locale),
        ]
      : [];

  const graph = [
    organizationSchema(locale),
    founderSchema(locale),
    websiteSchema(locale),
    webPageSchema(locale, page),
    breadcrumbSchema(locale, page),
    ...homeNodes,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
