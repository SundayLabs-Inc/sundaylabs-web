import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      ...[
        "ashitanorobotics.co.jp",
        "www.ashitanorobotics.co.jp",
        "ashitano-robotics-v1.vercel.app",
      ].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://sundaylabs.co.jp/:path*",
        permanent: true,
      })),
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
