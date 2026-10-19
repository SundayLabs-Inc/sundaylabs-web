import type { Metadata } from "next";
import HomeRobotPage from "@/components/site/HomeRobotPage";
import SiteShell from "@/components/site/SiteShell";
import { operator } from "@/config/legal";
import { seo } from "@/content/home";
import { absoluteUrl, createSiteMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = createSiteMetadata({
  title: seo.title,
  description: seo.description,
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: operator.name,
  alternateName: operator.nameEn,
  url: SITE_URL,
  logo: absoluteUrl("/icon.png"),
  email: operator.email,
  description: seo.description,
  address: {
    "@type": "PostalAddress",
    postalCode: operator.postalCode.replace("〒", ""),
    addressCountry: "JP",
    streetAddress: operator.address,
  },
};

export default function Home() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeRobotPage />
    </SiteShell>
  );
}
