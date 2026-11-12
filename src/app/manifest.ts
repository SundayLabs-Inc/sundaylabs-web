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
        src: "/images/sl-favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/sl-apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
