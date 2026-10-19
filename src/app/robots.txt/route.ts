import { SITE_URL } from "@/lib/seo";

export const revalidate = 86400;

const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "cohere-ai",
  "Diffbot",
  "YouBot",
];

export function GET() {
  const aiGroup = AI_AGENTS.map((agent) => `User-agent: ${agent}`).join("\n");
  const body = `# ${SITE_URL}/llms.txt
# ${SITE_URL}/llms-full.txt

User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/
Disallow: /book

${aiGroup}
Allow: /
Disallow: /api/
Disallow: /book

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
