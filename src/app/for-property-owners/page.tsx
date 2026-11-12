import ServiceGuide from "@/components/site/ServiceGuide";
import { guides } from "@/content/guides";
import { createSiteMetadata } from "@/lib/seo";
const guide = guides["for-property-owners"];
export const metadata = createSiteMetadata({ title: `${guide.title} | SundayLabs`, description: guide.description, path: "/for-property-owners" });
export default function Page() { return <ServiceGuide guideKey="for-property-owners" />; }
