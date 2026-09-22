import type { Metadata } from "next";
import Link from "next/link";
import { HomeDownloader } from "@/components/home-downloader";
import { BRAND, getSiteHost } from "@/lib/site";
import { breadcrumbJsonLd, faqPageJsonLd, webAppJsonLd } from "@/lib/seo";

export type LandingConfig = {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  bullets: string[];
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
};

export function LandingPage({ config }: { config: LandingConfig }) {
  const host = getSiteHost();
  const jsonLd = [
    webAppJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: config.h1, path: config.path },
    ]),
    faqPageJsonLd(config.faqs),
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative px-3 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>{" "}
            / <span className="text-foreground/80">{config.h1}</span>
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {config.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {config.intro}
          </p>
        </div>
        <div className="mx-auto mt-7 max-w-3xl sm:mt-8">
          <HomeDownloader />
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-3 pb-16 sm:px-6">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Why people use {BRAND}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {config.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Fastest shortcut
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Swap <span className="text-foreground">x.com</span> for{" "}
            <span className="text-accent">{host}</span> in any public status URL. Example:{" "}
            <code className="break-all text-foreground">
              https://{host}/username/status/123
            </code>
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            FAQ
          </h2>
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {config.faqs.map((item) => (
              <details key={item.q} className="group px-4 py-3.5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Related guides
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {config.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function metaFor(config: LandingConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: { canonical: config.path },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.path,
      type: "website",
      siteName: BRAND,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}

export const landingConfigs = {
  twitterVideo: {
    path: "/download-twitter-video",
    title: "Download Twitter Video Online Free (MP4)",
    description:
      "Free Twitter video downloader on savethex.com. Save public Twitter / X videos as MP4 in the highest quality — no account, no watermark.",
    h1: "Download Twitter video online",
    intro: `Paste a public twitter.com or x.com post URL into ${BRAND} and save the video as MP4. Works for classic Twitter links and new X links.`,
    keywords: [
      "download twitter video",
      "twitter video downloader",
      "twitter video download online",
      "save twitter video",
      "twitter mp4 download",
    ],
    bullets: [
      "Free online Twitter video downloader — no signup",
      "Keeps the quality X actually serves (often up to 1080p)",
      "No watermark added by SaveTheX",
      "Also supports GIFs and ended live replays",
    ],
    faqs: [
      {
        q: "How do I download a Twitter video?",
        a: "Copy the post link, paste it on savethex.com, tap Get media, then Save video.",
      },
      {
        q: "Does it work with x.com links?",
        a: "Yes. twitter.com and x.com public posts both work.",
      },
      {
        q: "Is it free?",
        a: `Yes — ${BRAND} is free to use for public posts.`,
      },
    ],
    related: [
      { href: "/guides/how-to-download-x-videos", label: "How to download X videos" },
      { href: "/download-x-video", label: "Download X video" },
      { href: "/twitter-video-downloader", label: "Twitter video downloader" },
      { href: "/guides/download-twitter-gif", label: "Download Twitter GIFs" },
    ],
  } satisfies LandingConfig,
  xVideo: {
    path: "/download-x-video",
    title: "Download X Video — Free X.com Video Downloader",
    description:
      "Download videos from X (Twitter) free on savethex.com. High-quality MP4 saves for public posts, GIFs, and live replays.",
    h1: "Download X video",
    intro: `${BRAND} is a free X video downloader. Paste any public x.com status URL and save the video without an account.`,
    keywords: [
      "download x video",
      "x video downloader",
      "x.com video download",
      "download video from x",
      "save x video",
    ],
    bullets: [
      "Built for x.com status links",
      "Replace-domain shortcut: swap x.com → savethex.com",
      "Mobile PWA share target supported",
      "Live replay remux to MP4",
    ],
    faqs: [
      {
        q: "How do I download a video from X?",
        a: "Paste the x.com post URL on savethex.com or change the domain to savethex.com and open it.",
      },
      {
        q: "Can I download in 1080p?",
        a: "If X serves a 1080p rendition for that post, we list it as the recommended quality.",
      },
      {
        q: "Private posts?",
        a: "No — only public posts are supported.",
      },
    ],
    related: [
      { href: "/guides/how-to-download-x-videos", label: "Full how-to guide" },
      { href: "/download-twitter-video", label: "Download Twitter video" },
      { href: "/guides/replace-domain-trick", label: "Replace-domain trick" },
      { href: "/guides/download-x-live-replay", label: "Download X live replay" },
    ],
  } satisfies LandingConfig,
  downloader: {
    path: "/twitter-video-downloader",
    title: "Twitter Video Downloader — Free Online Tool",
    description: `Use ${BRAND} as your Twitter video downloader. Online, free, no watermark — download public Twitter and X videos as MP4.`,
    h1: "Twitter video downloader",
    intro:
      "Looking for a simple Twitter video downloader? savethex.com extracts public media and lets you save the best available MP4 in one click.",
    keywords: [
      "twitter video downloader",
      "twitter downloader",
      "online twitter video downloader",
      "free twitter video downloader",
      "x video downloader online",
    ],
    bullets: [
      "Online — nothing to install (optional PWA)",
      "No watermark from our tool",
      "Works on desktop and mobile browsers",
      "Guides for iPhone, Android, GIFs, and lives",
    ],
    faqs: [
      { q: "Is this Twitter video downloader free?", a: "Yes." },
      {
        q: "Do you add a watermark?",
        a: "No. We save the media X already provides for public posts.",
      },
      {
        q: "SSSTwitter alternative?",
        a: `Yes — many people use ${BRAND} as a cleaner alternative. See our comparison page.`,
      },
    ],
    related: [
      { href: "/ssstwitter-alternative", label: "SSSTwitter alternative" },
      { href: "/download-twitter-video", label: "Download Twitter video" },
      { href: "/guides", label: "All guides" },
    ],
  } satisfies LandingConfig,
  sssAlt: {
    path: "/ssstwitter-alternative",
    title: "SSSTwitter Alternative — Free X Video Downloader",
    description: `${BRAND} (savethex.com) is a free SSSTwitter alternative for downloading public X / Twitter videos, GIFs, and live replays — with a replace-domain shortcut.`,
    h1: "SSSTwitter alternative",
    intro: `If you’re searching for an SSSTwitter alternative, ${BRAND} downloads public X / Twitter media with a modern UI, mobile PWA share, and a domain-swap shortcut.`,
    keywords: [
      "ssstwitter alternative",
      "ssstwitter",
      "twitter video downloader alternative",
      "savethex",
    ],
    bullets: [
      "Free public-post downloader similar to SSSTwitter-style tools",
      "Replace x.com with savethex.com for instant downloads",
      "Live replay support with remux progress",
      "No account required",
    ],
    faqs: [
      {
        q: "How is SaveTheX different?",
        a: "We focus on a clean dark UI, PWA share-to-download, live remux progress, and the replace-domain growth shortcut.",
      },
      {
        q: "Can I download the same posts?",
        a: "If the post is public and contains media, yes — paste the link or swap the domain.",
      },
    ],
    related: [
      { href: "/twitter-video-downloader", label: "Twitter video downloader" },
      { href: "/download-x-video", label: "Download X video" },
      { href: "/guides/how-to-download-x-videos", label: "How to download X videos" },
    ],
  } satisfies LandingConfig,
};
