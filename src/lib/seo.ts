import type { Metadata } from "next";
import { getRail } from "@/constants/rail";
import { getSite, site, type Locale } from "@/constants/site";
import { brand, seo as homeSeo } from "@/content/home";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ashitanorobotics.co.jp";

export const CONTENT_UPDATED = site.news.items[0].datetime;

export const LOGO_PATH = "/images/logo-mark.png";
export const OG_IMAGE_PATH = "/images/technology-poster.jpg";
export const OG_IMAGE_WIDTH = 1280;
export const OG_IMAGE_HEIGHT = 720;

export type PageKey = "home" | "company" | "privacy" | "contact";

const PAGE_PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { ja: "/", en: "/en" },
  company: { ja: "/company", en: "/en/company" },
  privacy: { ja: "/privacy", en: "/en/privacy" },
  contact: { ja: "/contact", en: "/en/contact" },
};

export function getPagePath(locale: Locale, page: PageKey): string {
  return PAGE_PATHS[page][locale];
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function pageAlternates(page: PageKey, locale: Locale) {
  const jaPath = PAGE_PATHS[page].ja;
  const enPath = PAGE_PATHS[page].en;

  return {
    canonical: absoluteUrl(PAGE_PATHS[page][locale]),
    languages: {
      ja: absoluteUrl(jaPath),
      en: absoluteUrl(enPath),
      "x-default": absoluteUrl(jaPath),
    },
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "llms.txt" },
        { url: "/llms-full.txt", title: "llms-full.txt" },
      ],
    },
  };
}

function pageTitle(locale: Locale, page: PageKey): string {
  const site = getSite(locale);
  const rail = getRail(locale);

  switch (page) {
    case "home":
      return rail.seo.title;
    case "company":
      return `${site.legalName} | ${site.company.title}`;
    case "privacy":
      return `${site.privacy.title} | ${site.legalName}`;
    case "contact":
      return `${site.contact.title} | ${site.legalName}`;
  }
}

function pageDescription(locale: Locale, page: PageKey): string {
  const site = getSite(locale);
  const rail = getRail(locale);

  switch (page) {
    case "home":
      return rail.seo.description;
    case "company":
      return site.seo.companyDescription;
    case "privacy":
      return site.seo.privacyDescription;
    case "contact":
      return site.seo.contactDescription;
  }
}

export function createPageMetadata(
  locale: Locale,
  page: PageKey,
): Metadata {
  const site = getSite(locale);
  const rail = getRail(locale);
  const path = getPagePath(locale, page);
  const title = pageTitle(locale, page);
  const description = pageDescription(locale, page);
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(OG_IMAGE_PATH);
  const keywords =
    page === "home" ? [...rail.seo.keywords] : [...site.seo.keywords];

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: site.legalName, url: SITE_URL }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "technology",
    classification: rail.productName,
    alternates: pageAlternates(page, locale),
    openGraph: {
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
      url,
      siteName: site.legalName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: site.hero.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/** Metadata for the Japanese home-robotics pages (no /en counterpart). */
export function createSiteMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url,
      siteName: brand.legalName,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export function createRootMetadata(): Metadata {
  const site = getSite("ja");
  const rail = getRail("ja");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: homeSeo.title,
      template: "%s",
    },
    description: homeSeo.description,
    applicationName: site.legalName,
    authors: [{ name: site.legalName, url: SITE_URL }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "technology",
    classification: rail.productName,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icon.svg?v=5", type: "image/svg+xml" },
        { url: "/icon.png?v=5", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png?v=5", type: "image/png" }],
    },
    openGraph: {
      siteName: site.legalName,
      images: [
        {
          url: absoluteUrl(OG_IMAGE_PATH),
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: site.hero.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
