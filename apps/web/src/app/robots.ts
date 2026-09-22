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
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
