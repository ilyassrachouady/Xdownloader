import { BRAND, SITE_DOMAIN, getSiteHost, getSiteOrigin } from "@/lib/site";

export type FaqItem = { q: string; a: string };

export function getHomeFaqs(): FaqItem[] {
  const siteHost = getSiteHost();
  return [
    {
      q: "What’s the fastest way to download an X video?",
      a: `Replace x.com (or twitter.com) with ${siteHost} in the post URL. Keep /username/status/... unchanged and open the new link on ${SITE_DOMAIN}.`,
    },
    {
      q: `Can I install ${BRAND} on my phone?`,
      a: `Yes. Add to Home Screen on iOS or Install App on Android. Once installed, you can share X posts directly to ${BRAND} and download instantly.`,
    },
    {
      q: "Can I download X live replays?",
      a: "Yes. Ended live broadcasts / replays linked from a public post are supported. They’re remuxed to MP4 — keep the tab open until the download finishes.",
    },
    {
      q: "How do I download a video from X / Twitter?",
      a: `Paste the public post URL on ${SITE_DOMAIN}, tap Get media, then Save video — or use the replace-domain shortcut.`,
    },
    {
      q: "Does this work with twitter.com links?",
      a: "Yes. Classic twitter.com and newer x.com links both work as long as the post is public and includes media.",
    },
    {
      q: "Can I download X GIFs?",
      a: "When X serves a GIF as a short looping video (the usual case), we expose an MP4 download so you can save it.",
    },
    {
      q: "Is there a watermark?",
      a: `No. ${BRAND} saves the media X already serves for that public post — we don’t burn watermarks into the file.`,
    },
    {
      q: "Do I need an account?",
      a: "No. You can use the tool without signing up.",
    },
    {
      q: "Does this work with private posts?",
      a: "No. Protected accounts and private posts cannot be accessed. The post must be publicly viewable.",
    },
    {
      q: "What video quality can I download?",
      a: "We surface the useful resolutions available for that post — often 1080p, 720p, 480p, or 360p — deduplicated from the source formats.",
    },
    {
      q: `Is ${BRAND} free?`,
      a: `Yes. ${SITE_DOMAIN} is free for downloading public X / Twitter videos, GIFs, and live replays.`,
    },
  ];
}

export function faqPageJsonLd(faqs: FaqItem[] = getHomeFaqs()) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

export function webAppJsonLd() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: BRAND,
    url: origin,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description: `Free online X / Twitter video downloader on ${SITE_DOMAIN}. Save public videos, GIFs, and live replays in high quality — no account, no watermark.`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Download X / Twitter videos",
      "Download Twitter GIFs as MP4",
      "Download X live replays",
      "Replace-domain shortcut",
      "PWA share target on mobile",
    ],
  };
}
