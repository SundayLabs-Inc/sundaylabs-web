import { websiteTerms } from "@/content/legal/terms";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  websiteTerms,
  "SundayLabs株式会社のサイト利用規約です。",
);

export default function Page() {
  return <LegalPage doc={websiteTerms} />;
}
