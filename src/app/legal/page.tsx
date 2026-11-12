import { notFound } from "next/navigation";
import { launch } from "@/config/launch";
import { legalNotice } from "@/content/legal/legal-notice";
import { LegalPage, legalMetadata } from "@/lib/legal-page";

export const metadata = legalMetadata(
  legalNotice,
  "SundayLabs株式会社の特定商取引法に基づく表記です。",
);

export default function Page() {
  if (!launch.legalNoticePublished) notFound();
  return <LegalPage doc={legalNotice} />;
}
