import { websiteTerms } from "@/content/legal/terms";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  websiteTerms,
  "あしたのロボティクス株式会社のWebサイト利用規約です。",
);

export default function Page() {
  return <LegalPage doc={websiteTerms} />;
}
