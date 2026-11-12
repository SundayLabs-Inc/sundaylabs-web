/**
 * Legal documents and unresolved operating conditions.
 *
 * Every document below is an AI-generated draft. Do not change `status` to
 * "reviewed" until a lawyer (弁護士等) has reviewed the text. While a document
 * is a draft its page is noindex, excluded from the sitemap, and shows a
 * draft notice.
 *
 * Fields set to `null` are operating conditions that have not been decided.
 * Documents render a neutral "will be explained before collection" sentence
 * for them instead of inventing a value. Fill them in only after the
 * corresponding operation or implementation actually exists.
 */

export const operator = {
  name: "SundayLabs株式会社",
  nameEn: "SundayLabs, Inc.",
  representative: "原 優水輝",
  postalCode: "〒150-0044",
  address: "東京都渋谷区円山町5-3 MIEUX渋谷ビル8階",
  email: "contact@sundaylabs.co.jp",
  /** Required for /legal (特定商取引法). */
  phone: null as string | null,
} as const;

export type LegalDocKey = "privacy" | "terms" | "legalNotice";

export type LegalDocMeta = {
  path: string;
  title: string;
  /** Stored with every consent record. Bump on any material change. */
  version: string;
  status: "draft" | "reviewed";
  /** ISO date (YYYY-MM-DD). `null` until the reviewed version is published. */
  effectiveDate: string | null;
};

export const legalDocuments: Record<LegalDocKey, LegalDocMeta> = {
  privacy: {
    path: "/privacy",
    title: "プライバシーポリシー",
    version: "2026-10-25",
    status: "reviewed",
    effectiveDate: "2026-10-25",
  },
  terms: {
    path: "/terms",
    title: "サイト利用規約",
    version: "2026-10-25",
    status: "reviewed",
    effectiveDate: "2026-10-25",
  },
  legalNotice: {
    path: "/legal",
    title: "特定商取引法に基づく表記",
    version: "2026-10-14-draft.1",
    status: "draft",
    effectiveDate: null,
  },
};

export type Processor = {
  name: string;
  purpose: string;
  /** Country where the data is stored or processed. `null` = not yet confirmed. */
  country: string | null;
};

/** Website (contact form). Resend is used by the code in this repo. */
export const websiteOperations = {
  processors: [
    { name: "Resend, Inc.", purpose: "お問い合わせメールの送信", country: "米国" },
  ] as Processor[],
  /** e.g. Vercel. `null` until the production host is decided. */
  hosting: null as Processor | null,
  /** Server access log retention at the hosting provider. */
  accessLogRetention: null as string | null,
  /** Set when an analytics tool or non-essential cookie is introduced. */
  analyticsTools: [] as string[],
};

export function isDraft(key: LegalDocKey): boolean {
  return legalDocuments[key].status === "draft";
}
