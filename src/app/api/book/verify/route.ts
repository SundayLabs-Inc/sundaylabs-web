import { NextResponse } from "next/server";
import { launch } from "@/config/launch";
import { normalizeInviteCode } from "@/lib/booking/schema";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { clientKey, isSameOrigin, readJsonBody, sha256 } from "@/lib/server/request";
import { getAdminClient } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!launch.bookingEnabled) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const db = getAdminClient();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  if (!(await consumeRateLimit(db, clientKey(request, "invite"), 10, 3600))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: "invalid_request" }, { status: parsed.status });

  const code = normalizeInviteCode(parsed.body.inviteCode);
  if (!code) return NextResponse.json({ ok: false, error: "invalid_invitation" }, { status: 403 });

  const { data, error } = await db.rpc("invitation_is_valid", { p_code_hash: sha256(code) });
  if (error) {
    console.error("[book] invitation check failed", { code: error.code });
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
  if (data !== true) return NextResponse.json({ ok: false, error: "invalid_invitation" }, { status: 403 });

  return NextResponse.json({ ok: true });
}
