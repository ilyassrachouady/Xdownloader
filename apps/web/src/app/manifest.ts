import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaveTheX — X Video Downloader",
    short_name: "SaveTheX",
    description:
      "Download videos, GIFs, and live replays from X and Twitter on savethex.com.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    orientation: "portrait",
    lang: "en",
    categories: ["utilities", "productivity"],
    icons: [
      { src: "/favicon-32.png", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    share_target: {
      action: "/share",
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    } as unknown as MetadataRoute.Manifest["share_target"],
  };
}
