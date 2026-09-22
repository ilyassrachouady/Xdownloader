import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteOrigin();
  const staticPaths = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/guides", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  const staticEntries = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...guideEntries];
}
