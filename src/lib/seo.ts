import type { Metadata } from "next";
import { getSite, type Locale } from "@/constants/site";
import { brand, business, hero, seo as homeSeo } from "@/content/home";
import { getSiteContent } from "@/lib/site-content";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sundaylabs.co.jp";

export const CONTENT_UPDATED = "2026-11-12";

export const OG_IMAGE_PATH = "/images/og-sundaylabs.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = hero.title;

export type PageKey = "home" | "company" | "privacy" | "contact";

const PAGE_PATHS: Record<PageKey, string> = {
  home: "/",
  company: "/company",
  privacy: "/privacy",
  contact: "/contact",
};

export function getPagePath(_locale: Locale, page: PageKey): string {
  return PAGE_PATHS[page];
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function pageAlternates(page: PageKey) {
  const path = PAGE_PATHS[page];

  return {
    canonical: absoluteUrl(path),
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

  switch (page) {
    case "home":
      return getSiteContent(locale).title;
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

  switch (page) {
    case "home":
      return getSiteContent(locale).description;
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
  const path = getPagePath(locale, page);
  const title = pageTitle(locale, page);
  const description = pageDescription(locale, page);
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(OG_IMAGE_PATH);
  const keywords =
    page === "home" ? getSiteContent(locale).keywords : [...site.seo.keywords];

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: site.legalName, url: SITE_URL }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "technology",
    classification: business.name,
    alternates: pageAlternates(page),
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url,
      siteName: site.legalName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

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
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url,
      siteName: brand.legalName,
      title,
      description,
      images: [{ url: absoluteUrl(OG_IMAGE_PATH), width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(OG_IMAGE_PATH)] },
  };
}

export function createRootMetadata(): Metadata {
  const site = getSite("ja");

  return {
    metadataBase: new URL(SITE_URL),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
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
    classification: business.name,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/images/sl-favicon.svg", type: "image/svg+xml" },
        { url: "/images/sl-favicon.png", type: "image/png" },
      ],
      apple: [{ url: "/images/sl-apple-icon.png", type: "image/png" }],
    },
    openGraph: {
      siteName: site.legalName,
      images: [
        {
          url: absoluteUrl(OG_IMAGE_PATH),
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
