/** Shared by client forms and route handlers. Never trust the client result alone. */

const EMAIL_RE = /^[^\s@"(),:;<>[\\\]]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const CONTROL_RE = /[\u0000-\u001f\u007f]/;

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  const local = email.split("@")[0] ?? "";
  return local.length <= 64 && EMAIL_RE.test(email);
}

/** Single-line text: NFKC, trimmed, collapsed whitespace, no control characters. */
export function cleanLine(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (CONTROL_RE.test(text) || text.length > max) return null;
  return text;
}

/** Multi-line text: keeps newlines, strips other control characters. */
export function cleanText(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const text = value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
    .trim();
  return text.length > max ? null : text;
}

export function pickList<T extends string>(value: unknown, allowed: readonly T[]): T[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > allowed.length) return null;
  const out = new Set<T>();
  for (const item of value) {
    if (typeof item !== "string" || !(allowed as readonly string[]).includes(item)) return null;
    out.add(item as T);
  }
  return [...out];
}
