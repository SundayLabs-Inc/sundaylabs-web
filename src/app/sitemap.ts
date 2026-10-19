import type { MetadataRoute } from "next";
import { launch } from "@/config/launch";
import { legalDocuments, type LegalDocKey } from "@/config/legal";
import { absoluteUrl, CONTENT_UPDATED } from "@/lib/seo";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  languages?: Record<string, string>;
};

const bilingual = (jaPath: string, enPath: string) => ({
  ja: absoluteUrl(jaPath),
  en: absoluteUrl(enPath),
  "x-default": absoluteUrl(jaPath),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${CONTENT_UPDATED}T00:00:00.000Z`);

  const legal = (Object.keys(legalDocuments) as LegalDocKey[])
    .filter((key) => legalDocuments[key].status === "reviewed")
    .filter((key) => key !== "legalNotice" || launch.legalNoticePublished)
    .filter((key) => key !== "servicePrivacy" && key !== "serviceTerms")
    .map<Entry>((key) => ({ path: legalDocuments[key].path, priority: 0.3, changeFrequency: "yearly" }));

  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/company", priority: 0.6, changeFrequency: "yearly", languages: bilingual("/company", "/en/company") },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly", languages: bilingual("/contact", "/en/contact") },
    ...legal,
    { path: "/en", priority: 0.5, changeFrequency: "monthly" },
    { path: "/en/company", priority: 0.4, changeFrequency: "yearly", languages: bilingual("/company", "/en/company") },
    { path: "/en/contact", priority: 0.4, changeFrequency: "yearly", languages: bilingual("/contact", "/en/contact") },
    { path: "/en/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  return entries.map(({ path, priority, changeFrequency, languages }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    ...(languages ? { alternates: { languages } } : {}),
  }));
}
