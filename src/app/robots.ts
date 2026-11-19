import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

const disallowedPrivatePaths = [
  "/account/",
  "/checkout/",
  "/sign-in/",
  "/sign-up/",
  "/reseller/apply/",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt", "/pricing.md"],
        disallow: disallowedPrivatePaths,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "Google-Extended",
          "Googlebot",
          "Bingbot",
          "Applebot-Extended",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/pricing.md"],
        disallow: disallowedPrivatePaths,
      },
    ],
    host: siteConfig.url,
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
