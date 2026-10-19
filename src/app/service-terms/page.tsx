import { serviceTerms } from "@/content/legal/service-terms";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  serviceTerms,
  "あしたのロボティクス株式会社が提供する、ロボットによる家事代行サービスの利用規約です。",
);

export default function Page() {
  return <LegalPage doc={serviceTerms} />;
}
