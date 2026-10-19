import { getSite, type Locale } from "@/constants/site";
import { absoluteUrl, getPagePath } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

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
  const home = pageUrl(locale, "home");
  return getSiteContent(locale).services.map(
    (item) => `- [${item.name}](${home}#${item.id}): ${oneLine(item.body)}`,
  );
}

function faqLines(locale: Locale): string[] {
  const home = pageUrl(locale, "home");
  return getSiteContent(locale).faqs.flatMap((item, index) => [
    `- [${item.q}](${home}#faq-${index})`,
    `  ${oneLine(item.a)}`,
  ]);
}

function stepLines(locale: Locale): string[] {
  return getSiteContent(locale).steps.map(
    (step, index) => `${index + 1}. ${step.title}: ${oneLine(step.body)}`,
  );
}

function localeBlock(locale: Locale): string {
  const site = getSite(locale);
  const content = getSiteContent(locale);
  const home = pageUrl(locale, "home");
  const ja = locale === "ja";

  return [
    ja ? "## 日本語" : "## English",
    "",
    oneLine(content.headline),
    "",
    oneLine(content.description),
    "",
    oneLine(content.intro),
    "",
    `### ${site.nav.services}`,
    ...serviceLines(locale),
    "",
    `### ${content.stepsTitle}`,
    ...stepLines(locale),
    "",
    `### ${ja ? "産業領域" : "Industries"}`,
    content.industries.join(ja ? "、" : ", "),
    "",
    `### ${ja ? "ミッション" : "Mission"}`,
    oneLine(content.mission),
    "",
    `### ${site.company.title}`,
    ...companyFacts(locale),
    "",
    "### FAQ",
    ...faqLines(locale),
    "",
    `### ${site.contact.title}`,
    oneLine(site.contact.body),
    `- [${site.contact.title}](${pageUrl(locale, "contact")})`,
    "",
    "### Pages",
    `- [${ja ? "トップ" : "Home"}](${home}): ${oneLine(content.description)}`,
    `- [${site.company.title}](${pageUrl(locale, "company")}): ${oneLine(site.seo.companyDescription)}`,
    `- [${site.contact.title}](${pageUrl(locale, "contact")}): ${oneLine(site.seo.contactDescription)}`,
    `- [${site.privacy.title}](${pageUrl(locale, "privacy")}): ${oneLine(site.seo.privacyDescription)}`,
  ].join("\n");
}

export function buildLlmsTxt(): string {
  const ja = getSite("ja");
  const en = getSite("en");

  return [
    `# ${ja.legalName}`,
    "",
    `> ${oneLine(ja.tagline)}`,
    "",
    oneLine(getSiteContent("ja").description),
    "",
    `${en.legalName} ${oneLine(en.tagline)}`,
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
