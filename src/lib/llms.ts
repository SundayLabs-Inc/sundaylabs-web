import { getApproach } from "@/constants/approach";
import { getRail } from "@/constants/rail";
import { getSite, type Locale } from "@/constants/site";
import { absoluteUrl, getPagePath } from "@/lib/seo";

function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function pageUrl(locale: Locale, page: "home" | "company" | "privacy" | "contact"): string {
  return absoluteUrl(getPagePath(locale, page));
}

function companyFacts(locale: Locale): string[] {
  const site = getSite(locale);
  return site.company.rows.map(
    (row) => `- ${row.label}: ${oneLine(row.value)}`,
  );
}

function serviceLines(locale: Locale): string[] {
  const rail = getRail(locale);
  const home = pageUrl(locale, "home");
  return rail.domains.map(
    (domain) => `- [${domain.name}](${home}#${domain.id}): ${oneLine(domain.body)}`,
  );
}

function faqLines(locale: Locale): string[] {
  const site = getSite(locale);
  const home = pageUrl(locale, "home");
  return site.faqs.flatMap((item, index) => [
    `- [${item.question}](${home}#faq-${index})`,
    `  ${oneLine(item.answer)}`,
  ]);
}

function approachLines(locale: Locale): string[] {
  const approach = getApproach(locale);
  return approach.cards.map(
    (card, index) => `${index + 1}. ${card.title}: ${oneLine(card.body)}`,
  );
}

function localeBlock(locale: Locale): string {
  const site = getSite(locale);
  const rail = getRail(locale);
  const home = pageUrl(locale, "home");
  const headline = [rail.hero.title, rail.hero.sub].join(locale === "en" ? " " : "");

  return [
    locale === "ja" ? "## 日本語" : "## English",
    "",
    oneLine(headline),
    "",
    oneLine(rail.services.title),
    "",
    `### ${site.company.title}`,
    ...companyFacts(locale),
    "",
    `### ${site.nav.services}`,
    oneLine(site.company.rows.find((row) => row.label === (locale === "ja" ? "事業内容" : "Business"))?.value ?? ""),
    ...serviceLines(locale),
    "",
    `### ${getApproach(locale).title}`,
    ...approachLines(locale),
    "",
    `### ${site.nav.faqs}`,
    ...faqLines(locale),
    "",
    `### ${site.contact.title}`,
    oneLine(site.contact.body),
    `- [${site.contact.title}](${pageUrl(locale, "contact")})`,
    "",
    "### Pages",
    `- [${locale === "ja" ? "トップ" : "Home"}](${home}): ${oneLine(rail.seo.description)}`,
    `- [${site.company.title}](${pageUrl(locale, "company")}): ${oneLine(site.seo.companyDescription)}`,
    `- [${site.contact.title}](${pageUrl(locale, "contact")}): ${oneLine(site.seo.contactDescription)}`,
    `- [${site.privacy.title}](${pageUrl(locale, "privacy")}): ${oneLine(site.seo.privacyDescription)}`,
    `- [${getApproach(locale).title}](${home}#schedule)`,
    `- [${site.nav.faqs}](${home}#faqs)`,
  ].join("\n");
}

export function buildLlmsTxt(): string {
  const ja = getSite("ja");
  const en = getSite("en");
  const jaRail = getRail("ja");

  return [
    `# ${ja.legalName}`,
    "",
    `> ${oneLine(ja.tagline)}`,
    "",
    oneLine(jaRail.seo.description),
    "",
    `${en.legalName} ${oneLine(en.tagline)}`,
    "",
    oneLine(getRail("en").seo.description),
    "",
    localeBlock("ja"),
    "",
    localeBlock("en"),
    "",
    "## Optional",
    "",
    `- [llms-full.txt](${absoluteUrl("/llms-full.txt")})`,
    "",
  ].join("\n");
}

function privacyBlock(locale: Locale): string {
  const site = getSite(locale);
  const sections = site.privacy.sections.map(
    (section) => `### ${section.heading}\n\n${oneLine(section.body)}`,
  );
  return [
    `## ${site.privacy.title}`,
    "",
    oneLine(site.privacy.intro),
    "",
    sections.join("\n\n"),
  ].join("\n");
}

export function buildLlmsFullTxt(): string {
  return [buildLlmsTxt().trimEnd(), "", privacyBlock("ja"), "", privacyBlock("en"), ""].join("\n");
}
