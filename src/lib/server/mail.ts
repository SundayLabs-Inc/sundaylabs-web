import "server-only";
import { Resend } from "resend";
import { legalDocuments, operator } from "@/config/legal";
import { SITE_URL } from "@/lib/seo";

export type MailResult =
  | { status: "sent"; id: string }
  | { status: "failed"; error: string }
  | { status: "not_configured" };

export async function sendWaitlistConfirmation(to: string): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return { status: "not_configured" };

  const text = [
    "ウェイトリストへのご登録ありがとうございます。",
    "",
    "ウェイトリストへの登録が完了しました。サービスのご案内が可能になりましたら、メールでお知らせします。",
    "",
    "登録は無料です。登録によってサービスの利用が確約されるものではありません。",
    "",
    `登録情報の取り扱い：${SITE_URL}${legalDocuments.privacy.path}`,
    `登録の取消し・お問い合わせ：${operator.email}`,
    "",
    "このメールにお心当たりがない場合は、お手数ですが上記までご連絡ください。",
    "",
    "――",
    operator.name,
    operator.nameEn,
  ].join("\n");

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: operator.email,
      subject: "【あしたのロボティクス】ウェイトリストへのご登録ありがとうございます",
      text,
    });
    if (error || !data) return { status: "failed", error: error?.name ?? "unknown" };
    return { status: "sent", id: data.id };
  } catch (e) {
    return { status: "failed", error: e instanceof Error ? e.name : "exception" };
  }
}
