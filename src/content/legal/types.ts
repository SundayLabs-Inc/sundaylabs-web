import type { LegalDocKey } from "@/config/legal";

export type LegalBlock =
  | string
  | { list: string[]; ordered?: boolean }
  | { table: { head: [string, string]; rows: [string, string][] } };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDocument = {
  key: LegalDocKey;
  intro: string[];
  /** Plain-language summary shown before the full text. */
  summary?: LegalSection;
  sections: LegalSection[];
};

export function orPending(value: string | null, fallback: string): string {
  return value ?? fallback;
}
