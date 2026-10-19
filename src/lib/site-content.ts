import { getApproach } from "@/constants/approach";
import { getRail } from "@/constants/rail";
import { getSite, type Locale } from "@/constants/site";
import { faq, hero, industries, seo, service, steps, technology } from "@/content/home";

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
  "あしたのロボティクス",
  "あしたのロボティクス株式会社",
  "Ashitano Robotics",
  "フィジカルAI",
  "Physical AI",
  "フィジカルAI研修",
  "ロボット研修",
  "AIロボット 研修",
  "ロボット人材育成",
  "研究開発基盤構築",
  "ロボットラボ構築",
  "共同研究開発",
  "ロボット 共同研究",
  "ヒューマノイド",
  "ヒューマノイドロボット",
  "四足歩行ロボット",
  "ロボットアーム",
  "VLA",
  "模倣学習",
  "ロボット制御",
  "PoC",
  "実機検証",
  ...industries.items,
];

/** Canonical copy for search engines and AI crawlers, shared by metadata, JSON-LD and llms.txt. */
export function getSiteContent(locale: Locale): SiteContent {
  if (locale === "ja") {
    return {
      title: seo.title,
      description: seo.description,
      headline: hero.title,
      intro: service.body,
      keywords: jaKeywords,
      services: service.items.map((item) => ({ id: item.id, name: item.title, body: item.body })),
      stepsTitle: steps.title,
      steps: steps.items.map((item) => ({ title: item.title, body: item.body })),
      faqs: faq.items,
      industries: industries.items,
      mission: technology.body,
    };
  }

  const site = getSite(locale);
  const rail = getRail(locale);
  const approach = getApproach(locale);
  return {
    title: rail.seo.title,
    description: rail.seo.description,
    headline: [rail.hero.title, rail.hero.sub].join(" "),
    intro: rail.services.title,
    keywords: [...rail.seo.keywords],
    services: rail.domains.map((domain) => ({ id: domain.id, name: domain.name, body: domain.body })),
    stepsTitle: approach.title,
    steps: approach.cards.map((card) => ({ title: card.title, body: card.body })),
    faqs: site.faqs.map((item) => ({ q: item.question, a: item.answer })),
    industries: site.useCases.robots.map((item) => item.title),
    mission: site.mission.body,
  };
}
