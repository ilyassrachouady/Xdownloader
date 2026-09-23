import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/share", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
