import ServiceGuide from "@/components/site/ServiceGuide";
import { guides } from "@/content/guides";
import { createSiteMetadata } from "@/lib/seo";
const guide = guides["appliance-sharing"];
export const metadata = createSiteMetadata({ title: `${guide.title} | SundayLabs`, description: guide.description, path: "/appliance-sharing" });
export default function Page() { return <ServiceGuide guideKey="appliance-sharing" />; }
