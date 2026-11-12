import { NextResponse, type NextRequest } from "next/server";

const retiredHosts = new Set([
  "ashitanorobotics.co.jp",
  "www.ashitanorobotics.co.jp",
  "ashitano-robotics-v1.vercel.app",
]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? request.nextUrl.host)
    .split(":")[0]
    .toLowerCase()
    .replace(/\.$/, "");

  if (!retiredHosts.has(host)) return NextResponse.next();

  // Keep crawling available so search engines can observe the permanent removal.
  if (request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nAllow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(
    '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>公開終了</title></head><body><main><h1>このサイトは公開を終了しました。</h1><p>このページはご利用いただけません。</p></main></body></html>',
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
        "Cache-Control": "public, max-age=300",
      },
    },
  );
}
