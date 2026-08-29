import type { Metadata } from "next";
import { getSite, type Locale } from "@/constants/site";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ashitanorobotics.co.jp";

export const LOGO_PATH = "/images/logo-mark.png";
/** Dedicated share image (new path busts LINE/SNS caches). */
export const OG_IMAGE_PATH = "/images/og-v3.jpg";

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
  };
}

function pageTitle(locale: Locale, page: PageKey): string {
  const site = getSite(locale);

  switch (page) {
    case "home":
      return site.seo.homeTitle;
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
      return site.description;
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

  return {
    title,
    description,
    keywords: [...site.seo.keywords],
    authors: [{ name: site.nameEn, url: SITE_URL }],
    creator: site.nameEn,
    publisher: site.nameEn,
    category: "technology",
    alternates: pageAlternates(page, locale),
    openGraph: {
      type: page === "home" ? "website" : "article",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
      url,
      siteName: site.nameEn,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: site.nameEn,
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

export function createRootMetadata(): Metadata {
  const site = getSite("ja");

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: site.nameEn,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icon.svg?v=3", type: "image/svg+xml" },
        { url: "/icon.png?v=3", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png?v=3", type: "image/png" }],
    },
    openGraph: {
      siteName: site.nameEn,
      images: [
        {
          url: absoluteUrl(OG_IMAGE_PATH),
          width: 1200,
          height: 630,
          alt: site.nameEn,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
