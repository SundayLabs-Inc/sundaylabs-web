import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomeRobotPage from "@/components/site/HomeRobotPage";
import SiteShell from "@/components/site/SiteShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("ja", "home");

export default function Home() {
  return (
    <SiteShell>
      <JsonLd locale="ja" page="home" />
      <HomeRobotPage />
    </SiteShell>
  );
}
