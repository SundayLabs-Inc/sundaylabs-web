import { Resend } from "resend";
import { NextResponse } from "next/server";

const CONTACT_TO = process.env.CONTACT_TO ?? "contact@ashitanorobotics.co.jp";
const RESEND_FROM =
  process.env.RESEND_FROM ?? "Ashitano Robotics <onboarding@resend.dev>";

type ContactPayload = {
  email?: string;
  company?: string;
  role?: string;
  message?: string;
  locale?: "ja" | "en";
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = String(payload.email ?? "").trim();
  const company = String(payload.company ?? "").trim();
  const role = String(payload.role ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const locale = payload.locale === "en" ? "en" : "ja";

  if (!email || !company || !role || !message || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const subjectPrefix = locale === "en" ? "Inquiry" : "お問い合わせ";
  const subject = `${subjectPrefix} (${company})`;

  const labels =
    locale === "en"
      ? {
          email: "Email",
          company: "Company / Organization",
          role: "Name / Role",
          message: "Message",
        }
      : {
          email: "メール",
          company: "会社・組織",
          role: "ご担当",
          message: "メッセージ",
        };

  const text = [
    `${labels.email}: ${email}`,
    `${labels.company}: ${company}`,
    `${labels.role}: ${role}`,
    "",
    `${labels.message}:\n${message}`,
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
