import type { Metadata } from "next";
import { Barlow_Condensed, Geist, Geist_Mono, Inter, Montserrat, Noto_Sans_JP } from "next/font/google";
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

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geist.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} ${barlowCondensed.variable} ${notoSansJp.variable} antialiased`}
    >
      <body className="bg-bg font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
