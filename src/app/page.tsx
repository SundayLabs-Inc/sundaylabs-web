import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomeRentalPage from "@/components/site/HomeRentalPage";
import SiteShell from "@/components/site/SiteShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("ja", "home");

export default function Home() {
  return (
    <SiteShell overlayHeader>
      <JsonLd locale="ja" page="home" />
      <HomeRentalPage />
    </SiteShell>
  );
}
