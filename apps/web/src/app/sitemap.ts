import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { landingConfigs } from "@/lib/landing-pages";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteOrigin();
  const staticPaths = [
    { path: "", priority: 1, changeFrequency: "daily" as const },
    { path: "/guides", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/download-twitter-video", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/download-x-video", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/twitter-video-downloader", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/ssstwitter-alternative", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/contact", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  // Keep landing config paths in sync if they change
  void landingConfigs;

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
    priority: 0.75,
  }));

  return [...staticEntries, ...guideEntries];
}
