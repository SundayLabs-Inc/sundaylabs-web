import type { MetadataRoute } from "next";
import { site } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.seo.homeTitle,
    short_name: site.nameEn,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2ef",
    theme_color: "#141413",
    lang: "ja",
    icons: [
      {
        src: "/icon.png?v=11",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png?v=11",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
