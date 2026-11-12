import type { MetadataRoute } from "next";
import { launch } from "@/config/launch";
import { legalDocuments, type LegalDocKey } from "@/config/legal";
import { absoluteUrl, CONTENT_UPDATED } from "@/lib/seo";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${CONTENT_UPDATED}T00:00:00.000Z`);

  const legal = (Object.keys(legalDocuments) as LegalDocKey[])
    .filter((key) => legalDocuments[key].status === "reviewed")
    .filter((key) => key !== "legalNotice" || launch.legalNoticePublished)
    .map<Entry>((key) => ({ path: legalDocuments[key].path, priority: 0.3, changeFrequency: "yearly" }));

  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/appliance-sharing", priority: 0.9, changeFrequency: "monthly" },
    { path: "/for-property-owners", priority: 0.9, changeFrequency: "monthly" },
    { path: "/company", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    ...legal,
  ];

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
