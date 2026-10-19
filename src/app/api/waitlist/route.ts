import { NextResponse } from "next/server";
import { legalDocuments } from "@/config/legal";
import { sendWaitlistConfirmation } from "@/lib/server/mail";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { clientKey, isSameOrigin, readJsonBody, sha256 } from "@/lib/server/request";
import { getAdminClient } from "@/lib/server/supabase";
import { parseWaitlist } from "@/lib/waitlist/schema";

export const dynamic = "force-dynamic";

function fail(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "forbidden");

  const db = getAdminClient();
  if (!db) {
    console.error("[waitlist] database is not configured");
    return fail(503, "unavailable");
  }

  if (!(await consumeRateLimit(db, clientKey(request, "waitlist"), 5, 600))) {
    return fail(429, "rate_limited");
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return fail(parsed.status, "invalid_request");
  const { body } = parsed;

  // Honeypot: hidden from people, filled by naive bots.
  if (typeof body.website === "string" && body.website.length > 0) {
    return fail(400, "invalid_request");
  }

  const result = parseWaitlist(body);
  if (!result.ok) return fail(422, "invalid_input", { fields: result.errors });
  const input = result.data;

  if (input.privacyPolicyVersion !== legalDocuments.privacy.version) {
    return fail(409, "policy_outdated");
  }

  if (!(await consumeRateLimit(db, `waitlist-email:${sha256(input.email)}`, 3, 86400))) {
    return fail(429, "rate_limited");
  }

  const now = new Date().toISOString();
  // On conflict nothing is updated, so nobody can overwrite another person's
  // entry by submitting their address. The response is identical either way.
  const { data, error } = await db
    .from("waitlist_entries")
    .upsert(
      {
        email: input.email,
        prefecture: input.prefecture,
        city: input.city,
        interested_tasks: [],
        marketing_opt_in: input.marketingOptIn,
        marketing_opt_in_at: input.marketingOptIn ? now : null,
        privacy_policy_version: input.privacyPolicyVersion,
        privacy_acknowledged_at: now,
      },
      { onConflict: "email", ignoreDuplicates: true },
    )
    .select("id");

  if (error) {
    console.error("[waitlist] insert failed", { code: error.code });
    return fail(500, "save_failed");
  }

  const entryId = data?.[0]?.id as string | undefined;
  if (entryId) {
    const mail = await sendWaitlistConfirmation(input.email);
    const { error: updateError } = await db
      .from("waitlist_entries")
      .update({
        confirmation_email_status: mail.status,
        confirmation_email_id: mail.status === "sent" ? mail.id : null,
        confirmation_email_error: mail.status === "failed" ? mail.error : null,
        confirmation_email_attempted_at: new Date().toISOString(),
      })
      .eq("id", entryId);

    if (mail.status !== "sent") {
      console.error("[waitlist] confirmation email not sent", { entryId, status: mail.status });
    }
    if (updateError) {
      console.error("[waitlist] email status update failed", { entryId, code: updateError.code });
    }
  }

  return NextResponse.json({ ok: true });
}
