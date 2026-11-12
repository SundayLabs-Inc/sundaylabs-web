import { getSite } from "@/constants/site";
import { business, partners, service } from "@/content/home";
import { absoluteUrl, getPagePath } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function pageUrl(page: "home" | "company" | "privacy" | "contact"): string {
  return absoluteUrl(getPagePath("ja", page));
}

function companyFacts(): string[] {
  const site = getSite("ja");
  return site.company.rows.map(
    (row) => `- ${row.label}: ${oneLine(row.value)}`,
  );
}

function serviceLines(): string[] {
  const home = pageUrl("home");
  return getSiteContent("ja").services.map(
    (item) => `- [${item.name}](${home}#${item.id}): ${oneLine(item.body)}`,
  );
}

function faqLines(): string[] {
  const home = pageUrl("home");
  return service.faqs.flatMap((item, index) => [
    `- [${item.q}](${home}#faq-${index})`,
    `  ${oneLine(item.a)}`,
  ]);
}

export function buildLlmsTxt(): string {
  const site = getSite("ja");
  const content = getSiteContent("ja");
  const home = pageUrl("home");

  return [
    `# ${site.legalName}`,
    "",
    `> ${oneLine(site.tagline)}`,
    "",
    oneLine(content.description),
    "",
    "## ミッション",
    "",
    oneLine(content.mission),
    "",
    `## ${business.name}`,
    "",
    oneLine(content.intro),
    "",
    ...serviceLines(),
    "",
    `## サービス：${service.name}`,
    "",
    oneLine(`${service.lead} ${service.body}`),
    "",
    ...service.points.map((p) => `- ${p.title}: ${oneLine(p.body)}`),
    "",
    "## 導入のご相談",
    "",
    oneLine(partners.body),
    "",
    content.industries.join("、"),
    "",
    `## ${site.company.title}`,
    "",
    ...companyFacts(),
    "",
    "## FAQ",
    "",
    ...faqLines(),
    "",
    `## ${site.contact.title}`,
    "",
    oneLine(site.contact.body),
    `- [${site.contact.title}](${pageUrl("contact")})`,
    "",
    "## Pages",
    "",
    `- [トップ](${home}): ${oneLine(content.description)}`,
    `- [${service.name}](${home}#service): ${oneLine(service.lead)}`,
    `- [${site.company.title}](${pageUrl("company")}): ${oneLine(site.seo.companyDescription)}`,
    `- [${site.contact.title}](${pageUrl("contact")}): ${oneLine(site.seo.contactDescription)}`,
    `- [${site.privacy.title}](${pageUrl("privacy")}): ${oneLine(site.seo.privacyDescription)}`,
    "",
    "## Optional",
    "",
    `- [llms-full.txt](${absoluteUrl("/llms-full.txt")})`,
    "",
  ].join("\n");
}

function privacyBlock(): string {
  const site = getSite("ja");
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
  return [buildLlmsTxt().trimEnd(), "", privacyBlock(), ""].join("\n");
}
