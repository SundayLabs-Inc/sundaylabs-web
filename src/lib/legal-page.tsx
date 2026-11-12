import type { Metadata } from "next";
import LegalDocumentView from "@/components/site/LegalDocumentView";
import SiteShell from "@/components/site/SiteShell";
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
  return (
    <SiteShell>
      <LegalDocumentView doc={doc} />
    </SiteShell>
  );
}
