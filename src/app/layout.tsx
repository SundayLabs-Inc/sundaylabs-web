import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Inter, Montserrat, Noto_Sans_JP } from "next/font/google";
import { createRootMetadata } from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = createRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = (await headers()).get("x-locale") === "en" ? "en" : "ja";

  return (
    <html
      lang={lang}
      className={`${geist.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} ${notoSansJp.variable} antialiased`}
    >
      <body className="bg-bg font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
