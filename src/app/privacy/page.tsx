import { privacyPolicy } from "@/content/legal/privacy";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  privacyPolicy,
  "あしたのロボティクス株式会社のWebプライバシーポリシー。Webサイトとウェイトリストで取得する個人情報の取り扱いについて定めています。",
);

export default function Page() {
  return <LegalPage doc={privacyPolicy} />;
}
