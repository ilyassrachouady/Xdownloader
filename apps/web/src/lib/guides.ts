import { BRAND, SITE_DOMAIN, getSiteHost } from "@/lib/site";

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  excerpt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

function buildGuides(): GuideArticle[] {
  const host = getSiteHost();

  return [
    {
      slug: "how-to-download-x-videos",
      title: "How to download X (Twitter) videos in high quality",
      description: `Step-by-step guide to saving public X / Twitter videos with ${BRAND} on ${SITE_DOMAIN} — paste a link or swap the domain.`,
      publishedAt: "2026-09-22",
      updatedAt: "2026-09-22",
      keywords: [
        "download x video",
        "twitter video download",
        "save x video",
        "x.com video downloader",
      ],
      excerpt:
        "Paste a public post URL or replace x.com with our domain to grab the best quality MP4.",
      sections: [
        {
          heading: "What you need",
          paragraphs: [
            `A public X post that includes a video. Private or protected posts cannot be downloaded. Open ${SITE_DOMAIN} in any modern browser — no account required.`,
          ],
        },
        {
          heading: "Method 1: Paste the link",
          paragraphs: [
            `Copy the post URL from X (Share, then Copy link). On ${SITE_DOMAIN}, paste it into the box and tap Get media. Choose Save video for the highest quality, or open More qualities for other resolutions.`,
          ],
        },
        {
          heading: "Method 2: Replace the domain (fastest)",
          paragraphs: [
            `Take a link like https://x.com/username/status/123456789 and change only the host to ${host}. Keep /username/status/… the same. Opening that URL loads ${BRAND} with the download ready.`,
            `Example: https://${host}/username/status/123456789`,
          ],
        },
        {
          heading: "Tips for best quality",
          paragraphs: [
            "We list the useful resolutions X actually serves for that post (often up to 1080p). Pick the top option unless you need a smaller file for messaging apps.",
          ],
        },
      ],
    },
    {
      slug: "download-twitter-gif",
      title: "How to download Twitter / X GIFs as MP4",
      description: `X GIFs are usually short looping videos. Learn how to save them as MP4 with ${BRAND}.`,
      publishedAt: "2026-09-22",
      updatedAt: "2026-09-22",
      keywords: ["download twitter gif", "save x gif", "twitter gif to mp4"],
      excerpt:
        "Most X GIFs are MP4 loops under the hood — here’s how to save them cleanly.",
      sections: [
        {
          heading: "Why GIFs download as video",
          paragraphs: [
            `X typically encodes “GIFs” as short, silent MP4 loops. That’s better for quality and file size than a classic GIF. ${BRAND} exposes that MP4 so you can save and share it anywhere.`,
          ],
        },
        {
          heading: "Steps",
          paragraphs: [
            `Open the public post with the GIF, copy its URL, and paste it on ${SITE_DOMAIN} (or swap x.com for ${host}). Tap Get media, then download the available MP4.`,
          ],
        },
      ],
    },
    {
      slug: "download-x-live-replay",
      title: "How to download an X live replay",
      description: `Download ended X live broadcasts and replays as MP4. Longer lives remux in the browser — keep the tab open.`,
      publishedAt: "2026-09-22",
      updatedAt: "2026-09-22",
      keywords: [
        "download x live",
        "twitter live replay download",
        "save x live stream",
      ],
      excerpt:
        "Ended live replays remux to MP4. Keep the tab open until the file finishes — don’t open a half-finished download.",
      sections: [
        {
          heading: "What works",
          paragraphs: [
            "Public posts that link to an ended live / Periscope-style replay. Ongoing live streams may not be available until the broadcast ends and a replay exists.",
          ],
        },
        {
          heading: "How to save a replay",
          paragraphs: [
            `Paste the post URL on ${SITE_DOMAIN} or use the replace-domain shortcut (${host}). Choose a quality and start the download. ${BRAND} remuxes HLS segments to MP4 while bytes stream to your browser.`,
            "Hour-long lives can take several minutes. Keep the tab open until the download completes. Opening the file early often shows only the first few seconds.",
          ],
        },
      ],
    },
    {
      slug: "replace-domain-trick",
      title: `The ${SITE_DOMAIN} replace-domain trick`,
      description: `Swap x.com for ${SITE_DOMAIN} in any public status URL to open ${BRAND} with the download ready — no paste step.`,
      publishedAt: "2026-09-22",
      updatedAt: "2026-09-22",
      keywords: [
        "savethex.com",
        "x.com replace domain",
        "twitter video download shortcut",
      ],
      excerpt: `Change x.com to ${SITE_DOMAIN} and keep the rest of the path. Instant download page.`,
      sections: [
        {
          heading: "The pattern",
          paragraphs: [
            "From: https://x.com/user/status/ID",
            `To:   https://${host}/user/status/ID`,
            "Only the domain changes. Username, status ID, and path stay identical. Works with twitter.com and mobile.twitter.com hosts too — replace those with our domain the same way.",
          ],
        },
        {
          heading: "Why it’s useful",
          paragraphs: [
            "You can edit the address bar on desktop, or use a text-replacement shortcut on your phone, without opening a separate downloader site first.",
          ],
        },
      ],
    },
    {
      slug: "save-x-videos-on-iphone",
      title: "Save X videos on iPhone (and Android)",
      description: `Install ${BRAND} as a PWA and share posts from the X app straight into the downloader.`,
      publishedAt: "2026-09-22",
      updatedAt: "2026-09-22",
      keywords: [
        "download twitter video iphone",
        "save x video android",
        "pwa twitter downloader",
      ],
      excerpt: `Add ${BRAND} to your home screen, then share from the X app into ${BRAND}.`,
      sections: [
        {
          heading: "Install on iPhone",
          paragraphs: [
            `Open ${SITE_DOMAIN} in Safari, open Share, then Add to Home Screen. Launch ${BRAND} from the icon like an app.`,
          ],
        },
        {
          heading: "Install on Android",
          paragraphs: [
            `Open ${SITE_DOMAIN} in Chrome, open the menu, then Install app (or Add to Home screen).`,
          ],
        },
        {
          heading: "Share from the X app",
          paragraphs: [
            `In X, open a post, tap Share, then More, then ${BRAND}. The post opens ready to download.`,
          ],
        },
      ],
    },
  ];
}

export const guides: GuideArticle[] = buildGuides();

export function getGuide(slug: string): GuideArticle | undefined {
  return guides.find((g) => g.slug === slug);
}

export function allGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}
