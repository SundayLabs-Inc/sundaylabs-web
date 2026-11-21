import type { Metadata } from "next";
import SubPageLayout from "@/components/SubPageLayout";
import LegalDocumentView from "@/components/site/LegalDocumentView";
import { isDraft, legalDocuments } from "@/config/legal";
import type { LegalDocument } from "@/content/legal/types";
import { createSiteMetadata } from "@/lib/seo";

export function legalMetadata(doc: LegalDocument, description: string): Metadata {
  const meta = legalDocuments[doc.key];
  return createSiteMetadata({
    title: `${meta.title} | SundayLabs`,
    description,
    path: meta.path,
    noindex: isDraft(doc.key),
  });
}

export function LegalPage({ doc }: { doc: LegalDocument }) {
  const meta = legalDocuments[doc.key];
  return (
    <SubPageLayout locale="ja" title={meta.title} headingId={`${doc.key}-heading`} centered>
      <LegalDocumentView doc={doc} />
    </SubPageLayout>
  );
}
