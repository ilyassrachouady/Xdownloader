import { BRAND, CONTACT_EMAIL, SITE_DOMAIN, getSiteHost, getSiteOrigin } from "@/lib/site";

export type FaqItem = { q: string; a: string };

/** One-line entity definition used across metadata, schema, and GEO surfaces. */
export const ENTITY_ONE_LINER = `${BRAND} is a free X/Twitter video, GIF and ended Live replay downloader.`;

export const ENTITY_DESCRIPTION = `${ENTITY_ONE_LINER} Save public posts as MP4 on ${SITE_DOMAIN} — no account required, no watermark added by ${BRAND}. Not affiliated with X Corp.`;

export function getHomeFaqs(): FaqItem[] {
  const siteHost = getSiteHost();
  return [
    {
      q: "How do I download a video from X?",
      a: `Paste the public post URL on ${SITE_DOMAIN}, tap Get media, then Save video. For a faster path, replace x.com with ${siteHost} in the post URL and open the new link.`,
    },
    {
      q: "What’s the fastest way to download an X video?",
      a: `Replace x.com (or twitter.com) with ${siteHost} in the post URL. Keep /username/status/... unchanged and open the new link on ${SITE_DOMAIN}.`,
    },
    {
      q: "Can SaveTheX download X Live videos?",
      a: "SaveTheX can download ended public X Live broadcasts and replays as MP4. Currently running live streams are not supported until the broadcast ends and a public replay is available.",
    },
    {
      q: "Can I download an X Live replay?",
      a: "Yes. SaveTheX can download ended public X Live broadcasts and replays. The server remuxes the replay to MP4 — keep the tab open until preparation finishes, then download the finished file.",
    },
    {
      q: "Does it work on iPhone?",
      a: `Yes. Open ${SITE_DOMAIN} in Safari, or add SaveTheX to your Home Screen and share posts from the X app into SaveTheX.`,
    },
    {
      q: "Does it work on Android?",
      a: `Yes. Open ${SITE_DOMAIN} in Chrome, or install the SaveTheX PWA and share posts from the X app into SaveTheX.`,
    },
    {
      q: "Can it download GIFs?",
      a: "Yes. When X serves a GIF as a short looping video (the usual case), SaveTheX exposes an MP4 download so you can save it.",
    },
    {
      q: "Is it free?",
      a: `Yes. ${SITE_DOMAIN} is free for downloading public X / Twitter videos, GIFs, and ended Live replays.`,
    },
    {
      q: "Does it add a watermark?",
      a: `No. ${BRAND} does not burn logos or text into the file. You get the media X already serves for that public post (creator watermarks inside the original video are unchanged).`,
    },
    {
      q: "Can it download private posts?",
      a: "No. Protected accounts and private posts cannot be accessed. The post must be publicly viewable.",
    },
    {
      q: "What quality does it support?",
      a: "SaveTheX lists the useful resolutions available for that post — often 1080p, 720p, 480p, or 360p — based on what X actually serves.",
    },
    {
      q: "How does the URL replacement shortcut work?",
      a: `Change only the host: https://x.com/username/status/ID becomes https://${siteHost}/username/status/ID. The path stays the same. Opening that URL loads ${BRAND} with the download ready.`,
    },
    {
      q: "Do I need an account?",
      a: `No. ${BRAND} does not require an X account or a SaveTheX account.`,
    },
    {
      q: "Does this work with twitter.com links?",
      a: "Yes. Classic twitter.com and newer x.com links both work as long as the post is public and includes media.",
    },
  ];
}

export function faqPageJsonLd(faqs: FaqItem[] = getHomeFaqs()) {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${origin}/#faq`,
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
      item: item.path === "/" ? origin : `${origin}${item.path}`,
    })),
  };
}

export function organizationJsonLd() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: BRAND,
    alternateName: ["Save The X", "savethex", SITE_DOMAIN],
    url: origin,
    email: CONTACT_EMAIL,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/icon-512.png`,
    },
    description: ENTITY_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer support",
    },
  };
}

export function websiteJsonLd() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: BRAND,
    alternateName: ["Save The X", "savethex", SITE_DOMAIN],
    url: origin,
    description: ENTITY_DESCRIPTION,
    publisher: { "@id": `${origin}/#organization` },
    inLanguage: "en",
  };
}

export function webAppJsonLd() {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${origin}/#webapp`,
    name: BRAND,
    alternateName: ["Save The X", "savethex"],
    url: origin,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript for downloads",
    description: ENTITY_DESCRIPTION,
    publisher: { "@id": `${origin}/#organization` },
    isPartOf: { "@id": `${origin}/#website` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Download public X / Twitter videos as MP4",
      "Download Twitter / X GIFs as MP4",
      "Download ended public X Live replays as MP4",
      "Replace x.com with savethex.com shortcut",
      "Optional PWA share target on mobile",
      "No account required",
      "No watermark added by SaveTheX",
    ],
  };
}

export function webpageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
}) {
  const origin = getSiteOrigin();
  const url = `${origin}${opts.path === "/" ? "" : opts.path}` || origin;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@id": `${origin}/#webapp` },
    publisher: { "@id": `${origin}/#organization` },
    inLanguage: "en",
  };
}
