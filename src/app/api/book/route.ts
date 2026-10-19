import { NextResponse } from "next/server";
import { Resend } from "resend";
import { launch } from "@/config/launch";
import { legalDocuments } from "@/config/legal";
import { parseBooking } from "@/lib/booking/schema";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { clientKey, isSameOrigin, readJsonBody, sha256 } from "@/lib/server/request";
import { getAdminClient } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

function fail(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

/** Tells the team a booking arrived. Contains only the booking id, never personal data. */
async function notifyTeam(bookingId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.BOOKING_NOTIFY_TO ?? process.env.CONTACT_TO;
  if (!apiKey || !from || !to) return;
  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    subject: "予約申込みがありました",
    text: `予約ID: ${bookingId}\n内容は Supabase の bookings テーブルで確認してください。`,
  });
  if (error) console.error("[book] team notification failed", { bookingId, name: error.name });
}

export async function POST(request: Request) {
  if (!launch.bookingEnabled) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(request)) return fail(403, "forbidden");

  const db = getAdminClient();
  if (!db) {
    console.error("[book] database is not configured");
    return fail(503, "unavailable");
  }

  if (!(await consumeRateLimit(db, clientKey(request, "book"), 5, 3600))) {
    return fail(429, "rate_limited");
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return fail(parsed.status, "invalid_request");

  const result = parseBooking(parsed.body);
  if (!result.ok) return fail(422, "invalid_input", { fields: result.errors });
  const input = result.data;

  if (
    input.serviceTermsVersion !== legalDocuments.serviceTerms.version ||
    input.servicePrivacyVersion !== legalDocuments.servicePrivacy.version
  ) {
    return fail(409, "policy_outdated");
  }

  const { data, error } = await db.rpc("create_booking_with_invitation", {
    p_code_hash: sha256(input.inviteCode),
    p_booking: {
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      postal_code: input.postalCode,
      prefecture: input.prefecture,
      address: input.address,
      housing_type: input.housingType,
      requested_tasks: input.requestedTasks,
      excluded_areas: input.excludedAreas,
      preferred_slots: input.preferredSlots,
      notes: input.notes,
    },
    p_consents: [
      {
        consent_type: "service_terms",
        document_path: legalDocuments.serviceTerms.path,
        document_version: legalDocuments.serviceTerms.version,
        granted: true,
      },
      {
        consent_type: "recording_ai_training",
        document_path: legalDocuments.servicePrivacy.path,
        document_version: legalDocuments.servicePrivacy.version,
        granted: true,
      },
    ],
  });

  if (error) {
    if (error.message?.includes("invalid_invitation")) return fail(403, "invalid_invitation");
    console.error("[book] create failed", { code: error.code });
    return fail(500, "save_failed");
  }

  await notifyTeam(String(data));
  return NextResponse.json({ ok: true });
}
