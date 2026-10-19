import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

const memory = new Map<string, { start: number; hits: number }>();

function consumeInMemory(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now - entry.start > windowSeconds * 1000) {
    memory.set(key, { start: now, hits: 1 });
    if (memory.size > 5000) memory.clear();
    return true;
  }
  entry.hits += 1;
  return entry.hits <= limit;
}

/**
 * Fixed-window limiter backed by the `consume_rate_limit` SQL function so it
 * holds across serverless instances. Falls back to per-instance memory if the
 * function is unavailable.
 */
export async function consumeRateLimit(
  db: SupabaseClient,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!consumeInMemory(key, limit, windowSeconds)) return false;
  const { data, error } = await db.rpc("consume_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("[rate-limit] rpc failed", { code: error.code });
    return true;
  }
  return data === true;
}
