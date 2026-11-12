import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      { source: "/service", destination: "/", permanent: true },
      { source: "/service/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Signal",
            value: "search=yes, ai-input=yes, ai-train=yes",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
