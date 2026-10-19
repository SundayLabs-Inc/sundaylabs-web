import { servicePrivacyPolicy } from "@/content/legal/service-privacy";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  servicePrivacyPolicy,
  "ロボットによる家事代行サービスで取得する映像・動作データの取り扱い、AI学習への利用、閲覧者、保存期間、削除について定めています。",
);

export default function Page() {
  return <LegalPage doc={servicePrivacyPolicy} />;
}
