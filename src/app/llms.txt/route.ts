import { buildLlmsTxt } from "@/lib/llms";

export const revalidate = 86400;

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
