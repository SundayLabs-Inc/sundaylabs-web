import { privacyPolicy } from "@/content/legal/privacy";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  privacyPolicy,
  "SundayLabs株式会社のプライバシーポリシー。当サイトおよびお問い合わせフォームで取得する個人情報の取り扱いについて定めています。",
);

export default function Page() {
  return <LegalPage doc={privacyPolicy} />;
}
