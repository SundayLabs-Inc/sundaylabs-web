import "server-only";
import { createHash, createHmac } from "node:crypto";

const MAX_BODY_BYTES = 8 * 1024;

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Keyed hash of the client IP so raw addresses are never stored. */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const secret =
    process.env.RATE_LIMIT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "local-dev";
  return `${scope}:${createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32)}`;
}

/** Rejects cross-site posts. Browsers always send Origin on fetch POST, so a missing header is rejected. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; status: number }> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, status: 415 };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return { ok: false, status: 413 };
  try {
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, status: 400 };
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400 };
  }
}
