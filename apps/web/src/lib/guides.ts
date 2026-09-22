import { BRAND, SITE_DOMAIN, getSiteHost } from "@/lib/site";

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  excerpt: string;
  howTo?: boolean;
  relatedSlugs?: string[];
  sections: { heading: string; paragraphs: string[] }[];
};

function buildGuides(): GuideArticle[] {
  const host = getSiteHost();
  const today = "2026-09-23";

  return [
    {
      slug: "how-to-download-x-videos",
      title: "How to download X (Twitter) videos in high quality",
      description: `Step-by-step guide to saving public X / Twitter videos with ${BRAND} on ${SITE_DOMAIN} — paste a link or swap the domain.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "download x video",
        "twitter video download",
        "save x video",
        "x.com video downloader",
        "how to download x video",
      ],
      excerpt:
        "Paste a public post URL or replace x.com with savethex.com to grab the best quality MP4.",
      relatedSlugs: [
        "replace-domain-trick",
        "download-twitter-video-1080p",
        "save-x-videos-without-app",
        "download-x-live-replay",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `To download a video from X, paste the public post URL on ${SITE_DOMAIN}, tap Get media, then Save video. For a faster path, replace x.com with ${host} in the post URL and open the new link.`,
          ],
        },
        {
          heading: "What you need",
          paragraphs: [
            `A public X post that includes a video. Private or protected posts cannot be downloaded. Open ${SITE_DOMAIN} in any modern browser — no account required.`,
            `${BRAND} does not require an X account and does not add a watermark to the file.`,
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
            "Quality depends on the original upload. If X never published a 1080p rendition, SaveTheX cannot invent one.",
          ],
        },
        {
          heading: "Related downloads",
          paragraphs: [
            `GIFs usually download as MP4 loops. Ended Live replays remux on the server first — see the Live replay guide if your file is a long broadcast.`,
          ],
        },
      ],
    },
    {
      slug: "download-twitter-gif",
      title: "How to download Twitter / X GIFs as MP4",
      description: `X GIFs are usually short looping videos. Learn how to save them as MP4 with ${BRAND} on ${SITE_DOMAIN}.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: ["download twitter gif", "save x gif", "twitter gif to mp4", "x gif downloader"],
      excerpt:
        "Most X GIFs are MP4 loops under the hood — here’s how to save them cleanly.",
      relatedSlugs: [
        "how-to-download-x-videos",
        "twitter-video-downloader-no-watermark",
        "replace-domain-trick",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `Yes — SaveTheX can download GIFs. When X serves a GIF as a short looping video, paste the public post URL on ${SITE_DOMAIN} (or swap x.com for ${host}) and download the available MP4.`,
          ],
        },
        {
          heading: "Why GIFs download as video",
          paragraphs: [
            `X typically encodes “GIFs” as short, silent MP4 loops. That’s better for quality and file size than a classic GIF. ${BRAND} exposes that MP4 so you can save and share it anywhere.`,
          ],
        },
        {
          heading: "Steps",
          paragraphs: [
            `Open the public post with the GIF and copy its URL.`,
            `Paste it on ${SITE_DOMAIN}, or change the host to ${host} and open the edited link.`,
            "Tap Get media, then download the available MP4.",
          ],
        },
        {
          heading: "Limits",
          paragraphs: [
            "Only public posts work. If X does not expose media for that post, SaveTheX cannot download it.",
          ],
        },
      ],
    },
    {
      slug: "download-x-live-replay",
      title: "How to download an X Live replay",
      description: `Download ended public X Live broadcasts and replays as MP4 with ${BRAND}. Currently running live streams are not supported until a public replay exists.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "download x live replay",
        "twitter live replay download",
        "x live downloader",
        "save ended x broadcast",
        "twitter broadcast downloader",
      ],
      excerpt:
        "Ended Live replays remux to MP4 on the server. Keep the tab open until preparation finishes.",
      relatedSlugs: [
        "how-to-download-x-videos",
        "replace-domain-trick",
        "download-twitter-video-1080p",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Yes. SaveTheX can download ended public X Live broadcasts and replays as MP4. Currently running live streams are not supported until the broadcast ends and a public replay is available.",
          ],
        },
        {
          heading: "What works",
          paragraphs: [
            "Public posts that link to an ended Live / broadcast replay.",
            "Ongoing live streams may not be available until the broadcast ends and a replay exists.",
          ],
        },
        {
          heading: "How to save a replay",
          paragraphs: [
            `Paste the post URL on ${SITE_DOMAIN} or use the replace-domain shortcut (${host}). Choose a quality and start the download.`,
            `${BRAND} remuxes HLS segments to a finished MP4 on the server, then starts a normal download of that file. Keep the tab open while you see “Preparing full video…”.`,
            "Hour-long lives can take several minutes. Opening the file early often shows only the first few seconds.",
          ],
        },
        {
          heading: "Troubleshooting short files",
          paragraphs: [
            "If a player shows ~8 seconds of a long Live, the download was almost certainly incomplete. Wait for preparation to finish, then download again.",
          ],
        },
      ],
    },
    {
      slug: "replace-domain-trick",
      title: `The ${SITE_DOMAIN} replace-domain trick`,
      description: `Swap x.com for ${SITE_DOMAIN} in any public status URL to open ${BRAND} with the download ready — no paste step.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "savethex.com",
        "x.com replace domain",
        "twitter video download shortcut",
        "savethex shortcut",
      ],
      excerpt: `Change x.com to ${SITE_DOMAIN} and keep the rest of the path. Instant download page.`,
      relatedSlugs: [
        "how-to-download-x-videos",
        "save-x-videos-on-iphone",
        "how-to-save-twitter-videos-on-android",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `To download faster, replace x.com with ${host} in the post URL. Keep /username/status/... unchanged and open the new link.`,
          ],
        },
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
            `This replace-domain shortcut is a core ${BRAND} feature for public posts.`,
          ],
        },
        {
          heading: "What still applies",
          paragraphs: [
            "The post must be public and include media. Private posts will not resolve.",
          ],
        },
      ],
    },
    {
      slug: "save-x-videos-on-iphone",
      title: "How to download X videos on iPhone",
      description: `Download X / Twitter videos on iPhone with Safari or the ${BRAND} Home Screen app and share target.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "download twitter video iphone",
        "download x video iphone",
        "save x video iphone",
        "x video downloader iphone",
      ],
      excerpt: `Yes — SaveTheX works on iPhone. Use Safari, or add ${BRAND} to your Home Screen and share from the X app.`,
      relatedSlugs: [
        "how-to-save-twitter-videos-on-android",
        "save-x-videos-without-app",
        "replace-domain-trick",
        "how-to-download-x-videos",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `Yes. SaveTheX works on iPhone. Open ${SITE_DOMAIN} in Safari, paste a public post URL, and download the MP4 — or add SaveTheX to your Home Screen and share from the X app.`,
          ],
        },
        {
          heading: "In Safari (no install)",
          paragraphs: [
            `Open ${SITE_DOMAIN} in Safari. Paste the public post URL, tap Get media, then Save video. Files typically appear in your Downloads / Files app depending on iOS settings.`,
          ],
        },
        {
          heading: "Add to Home Screen",
          paragraphs: [
            `Open ${SITE_DOMAIN} in Safari, open Share, then Add to Home Screen. Launch ${BRAND} from the icon like an app.`,
          ],
        },
        {
          heading: "Share from the X app",
          paragraphs: [
            `In X, open a post, tap Share, then More, then ${BRAND}. The post opens ready to download.`,
          ],
        },
        {
          heading: "URL shortcut on iPhone",
          paragraphs: [
            `You can also edit a copied link so x.com becomes ${host}, then open it in Safari.`,
          ],
        },
      ],
    },
    {
      slug: "how-to-save-twitter-videos-on-android",
      title: "How to download X videos on Android",
      description: `Download X / Twitter videos on Android with Chrome or the ${BRAND} PWA share target.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "download twitter video android",
        "save x video android",
        "twitter video downloader android",
        "x video downloader android",
      ],
      excerpt: `Yes — SaveTheX works on Android. Paste in Chrome, install the PWA, or share from the X app.`,
      relatedSlugs: [
        "save-x-videos-on-iphone",
        "save-x-videos-without-app",
        "how-to-download-x-videos",
        "replace-domain-trick",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `Yes. SaveTheX works on Android. Open ${SITE_DOMAIN} in Chrome, paste a public post URL, and download the MP4 — or install the PWA and share from the X app.`,
          ],
        },
        {
          heading: "In Chrome",
          paragraphs: [
            `Open ${SITE_DOMAIN}, paste the post URL, download the MP4. Files usually land in your Downloads folder.`,
          ],
        },
        {
          heading: "Install the PWA",
          paragraphs: [
            `Open ${SITE_DOMAIN} in Chrome, open the menu, then Install app (or Add to Home screen).`,
          ],
        },
        {
          heading: "Share from X",
          paragraphs: [
            `In X: Share → More → ${BRAND}. The post opens ready to download.`,
          ],
        },
      ],
    },
    {
      slug: "save-x-videos-without-app",
      title: "How to save X videos without installing an app",
      description: `Use ${BRAND} in any browser to download public X / Twitter videos as MP4 — no app install required.`,
      publishedAt: today,
      updatedAt: today,
      howTo: true,
      keywords: [
        "download x video without app",
        "twitter video downloader online",
        "save twitter video browser",
      ],
      excerpt: `${BRAND} is a browser tool. Paste a public post URL on ${SITE_DOMAIN} — installing a PWA is optional.`,
      relatedSlugs: [
        "how-to-download-x-videos",
        "twitter-video-downloader-no-watermark",
        "replace-domain-trick",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `Yes. You can save X videos without installing an app. Open ${SITE_DOMAIN} in any modern browser, paste a public post URL, and download the MP4.`,
          ],
        },
        {
          heading: "Steps",
          paragraphs: [
            "Copy the public post link from X.",
            `Open ${SITE_DOMAIN} and paste the link.`,
            "Tap Get media, then Save video.",
          ],
        },
        {
          heading: "Optional: Home Screen / PWA",
          paragraphs: [
            "Installing SaveTheX as a PWA is optional. It only helps if you want Share → SaveTheX from the X mobile app.",
          ],
        },
      ],
    },
    {
      slug: "download-twitter-video-1080p",
      title: "Download Twitter / X videos in 1080p",
      description: `How to get the highest quality MP4 from public X posts with ${BRAND} — including when 1080p is available.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "download twitter video 1080p",
        "x video 1080p download",
        "twitter hd video download",
      ],
      excerpt:
        "We list every useful resolution X serves. Pick Recommended for the best available quality.",
      relatedSlugs: [
        "how-to-download-x-videos",
        "twitter-video-downloader-no-watermark",
        "download-x-live-replay",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `SaveTheX lists the useful resolutions available for that post. If X serves 1080p, Recommended will use it. If not, you get the best quality X published.`,
          ],
        },
        {
          heading: "Quality depends on the post",
          paragraphs: [
            "X only publishes certain renditions per post. If the uploader posted in HD, you’ll often see 1080p or 720p. If not, the best available option is what we show.",
          ],
        },
        {
          heading: "How to pick HD",
          paragraphs: [
            `Paste the post on ${SITE_DOMAIN}. The Recommended button uses the tallest resolution. Open other qualities if you need a smaller file.`,
          ],
        },
      ],
    },
    {
      slug: "twitter-video-downloader-no-watermark",
      title: "Twitter video downloader with no watermark",
      description: `${BRAND} saves public X / Twitter media without adding a watermark. Learn what that means and how to download cleanly.`,
      publishedAt: "2026-09-22",
      updatedAt: today,
      howTo: true,
      keywords: [
        "twitter video downloader no watermark",
        "download twitter video without watermark",
        "x video no watermark",
      ],
      excerpt:
        "We don’t burn watermarks into downloads — you get the media X already serves for public posts.",
      relatedSlugs: [
        "how-to-download-x-videos",
        "save-x-videos-without-app",
        "download-twitter-gif",
      ],
      sections: [
        {
          heading: "Quick answer",
          paragraphs: [
            `No — ${BRAND} does not add a watermark. You get the media X already serves for that public post.`,
          ],
        },
        {
          heading: "What “no watermark” means here",
          paragraphs: [
            `${BRAND} does not overlay logos or text onto your file. Some posts already include creator watermarks inside the video itself — those are part of the original media and cannot be removed by SaveTheX.`,
          ],
        },
        {
          heading: "Download steps",
          paragraphs: [
            `Open ${SITE_DOMAIN}, paste a public post URL, tap Get media, then Save video.`,
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

export function relatedGuides(guide: GuideArticle, limit = 4): GuideArticle[] {
  const preferred = (guide.relatedSlugs ?? [])
    .map((slug) => getGuide(slug))
    .filter((g): g is GuideArticle => Boolean(g));
  if (preferred.length >= limit) return preferred.slice(0, limit);
  const extras = guides.filter(
    (g) => g.slug !== guide.slug && !preferred.some((p) => p.slug === g.slug),
  );
  return [...preferred, ...extras].slice(0, limit);
}
