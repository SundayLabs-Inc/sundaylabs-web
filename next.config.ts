import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      ...["/service", "/service/:path*"].map((source) => ({
        source,
        destination: "/",
        permanent: true,
        missing: [{
          type: "host" as const,
          value: "(?:www\\.)?ashitanorobotics\\.co\\.jp|ashitano-robotics-v1\\.vercel\\.app",
        }],
      })),
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
