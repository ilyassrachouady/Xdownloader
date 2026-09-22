import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = ["", "/privacy", "/terms", "/contact"];
  return paths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.5,
  }));
}
