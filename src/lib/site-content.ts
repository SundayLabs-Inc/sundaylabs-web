import type { Locale } from "@/constants/site";
import { brand, business, hero, intro, partners, seo, service } from "@/content/home";

export type SiteContent = {
  title: string;
  description: string;
  headline: string;
  intro: string;
  keywords: string[];
  services: { id: string; name: string; body: string }[];
  stepsTitle: string;
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  industries: string[];
  mission: string;
};

const jaKeywords = [
  brand.name,
  service.name,
  business.name,
  "レンタル家電",
  "マンション",
  "マンションの共用スペース",
  "掃除機",
  "プロジェクター",
];

/** Canonical copy for search engines and AI crawlers, shared by metadata, JSON-LD and llms.txt. */
export function getSiteContent(_locale: Locale = "ja"): SiteContent {
  return {
    title: seo.title,
    description: seo.description,
    headline: `${hero.title} ${hero.lead}`,
    intro: business.body,
    keywords: jaKeywords,
    services: business.items.map((item) => ({ id: item.id, name: item.title, body: item.body })),
    stepsTitle: "",
    steps: service.steps,
    faqs: service.faqs,
    industries: partners.types,
    mission: `${intro.title} ${intro.body}`,
  };
}
