import type { Metadata } from "next";
import Link from "next/link";
import { HomeDownloader } from "@/components/home-downloader";
import { BRAND, SITE_DOMAIN, getSiteHost } from "@/lib/site";
import {
  ENTITY_ONE_LINER,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  webAppJsonLd,
  webpageJsonLd,
} from "@/lib/seo";

export type LandingSection = {
  heading: string;
  paragraphs: string[];
};

export type LandingConfig = {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  bullets: string[];
  sections?: LandingSection[];
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
};

export function LandingPage({ config }: { config: LandingConfig }) {
  const host = getSiteHost();
  const jsonLd = [
    organizationJsonLd(),
    webAppJsonLd(),
    webpageJsonLd({
      path: config.path,
      name: config.title,
      description: config.description,
    }),
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
            The {SITE_DOMAIN} URL shortcut
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            To download faster, replace <span className="text-foreground">x.com</span>{" "}
            with <span className="text-accent">{host}</span> in any public status URL.
            Keep <code className="text-foreground">/username/status/…</code> the same.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Example:{" "}
            <code className="break-all text-foreground">
              https://{host}/username/status/123
            </code>
          </p>
          <p className="mt-2 text-sm">
            <Link
              href="/guides/replace-domain-trick"
              className="text-accent hover:underline"
            >
              Full shortcut guide
            </Link>
          </p>
        </section>

        {(config.sections ?? []).map((section) => (
          <section key={section.heading}>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 56)}>{p}</p>
              ))}
            </div>
          </section>
        ))}

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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
            Related pages
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

        <p className="text-xs leading-relaxed text-muted-foreground">
          {ENTITY_ONE_LINER} Not affiliated with X Corp. Only public posts are supported.
        </p>
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
      images: [{ url: "/og.png", width: 1200, height: 630, alt: BRAND }],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: ["/og.png"],
    },
  };
}

export const landingConfigs = {
  twitterVideo: {
    path: "/download-twitter-video",
    title: "Download Twitter Video Online Free (MP4)",
    description: `${ENTITY_ONE_LINER} Paste a twitter.com or x.com link on ${SITE_DOMAIN} and save public Twitter videos as MP4 — no account, no watermark.`,
    h1: "Download Twitter video online",
    intro: `Paste a public twitter.com or x.com post URL into ${BRAND} and save the video as MP4. Classic Twitter links and newer X links both work.`,
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
      "Also supports GIFs and ended Live replays",
    ],
    sections: [
      {
        heading: "How to download a Twitter video",
        paragraphs: [
          `Copy the post link in Twitter/X (Share → Copy link). Open ${SITE_DOMAIN}, paste the URL, tap Get media, then Save video.`,
          `Prefer a shortcut? Replace twitter.com or x.com with ${SITE_DOMAIN} and open the edited URL.`,
        ],
      },
      {
        heading: "What this page is for",
        paragraphs: [
          "This page focuses on people searching specifically for downloading Twitter videos (including older twitter.com links). For X.com-first wording see Download X video; for Live replays see the Live downloader page.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I download a Twitter video?",
        a: `Copy the post link, paste it on ${SITE_DOMAIN}, tap Get media, then Save video.`,
      },
      {
        q: "Does it work with x.com links?",
        a: "Yes. twitter.com and x.com public posts both work.",
      },
      {
        q: "Is it free?",
        a: `Yes — ${BRAND} is free to use for public posts.`,
      },
      {
        q: "Can I download private Twitter videos?",
        a: "No. Only public posts are supported.",
      },
    ],
    related: [
      { href: "/guides/how-to-download-x-videos", label: "How to download X videos" },
      { href: "/download-x-video", label: "Download X video" },
      { href: "/twitter-video-downloader", label: "Twitter video downloader" },
      { href: "/x-gif-downloader", label: "X GIF downloader" },
      { href: "/about", label: "About SaveTheX" },
    ],
  } satisfies LandingConfig,
  xVideo: {
    path: "/download-x-video",
    title: "Download X Video — Free X.com Video Downloader",
    description: `Download videos from X (Twitter) free on ${SITE_DOMAIN}. ${ENTITY_ONE_LINER} High-quality MP4 for public posts.`,
    h1: "Download X video",
    intro: `${BRAND} is a free X video downloader. Paste any public x.com status URL and save the video without an account.`,
    keywords: [
      "download x video",
      "x video downloader",
      "x.com video download",
      "download video from x",
      "save x video",
      "download x video mp4",
    ],
    bullets: [
      "Built for x.com status links",
      "Replace-domain shortcut: swap x.com → savethex.com",
      "Mobile PWA share target supported",
      "Ended Live replay remux to MP4",
    ],
    sections: [
      {
        heading: "Download an X video as MP4",
        paragraphs: [
          `Open the public post on X, copy the link, paste it on ${SITE_DOMAIN}, and choose a quality. Output is MP4 when X serves video media.`,
          "If multiple qualities exist, Recommended uses the tallest resolution available for that post.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Private or protected posts cannot be downloaded. Currently running Live streams are not supported until an ended public replay is available.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I download a video from X?",
        a: `Paste the x.com post URL on ${SITE_DOMAIN} or change the domain to savethex.com and open it.`,
      },
      {
        q: "Can I download in 1080p?",
        a: "If X serves a 1080p rendition for that post, we list it as the recommended quality.",
      },
      {
        q: "Can it download private posts?",
        a: "No — only public posts are supported.",
      },
      {
        q: "Does SaveTheX work on iPhone and Android?",
        a: "Yes. Use the browser or install the optional PWA and share from the X app.",
      },
    ],
    related: [
      { href: "/guides/how-to-download-x-videos", label: "Full how-to guide" },
      { href: "/download-twitter-video", label: "Download Twitter video" },
      { href: "/x-live-downloader", label: "X Live replay downloader" },
      { href: "/guides/replace-domain-trick", label: "Replace-domain trick" },
      { href: "/about", label: "About SaveTheX" },
    ],
  } satisfies LandingConfig,
  downloader: {
    path: "/twitter-video-downloader",
    title: "Twitter Video Downloader — Free Online Tool",
    description: `Use ${BRAND} as your Twitter video downloader. Online, free, no watermark — download public Twitter and X videos as MP4 on ${SITE_DOMAIN}.`,
    h1: "Twitter video downloader",
    intro: `Looking for a simple Twitter video downloader? ${SITE_DOMAIN} extracts public media and lets you save the best available MP4 in one click.`,
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
      "Guides for iPhone, Android, GIFs, and Live replays",
    ],
    sections: [
      {
        heading: "Online downloader — no app required",
        paragraphs: [
          `${BRAND} runs in the browser. You can download without installing anything. An optional home-screen PWA is available if you want Share → SaveTheX from the X app.`,
          "See our guides for iPhone and Android if you prefer that workflow.",
        ],
      },
      {
        heading: "Compared with other downloaders",
        paragraphs: [
          `Many people use ${BRAND} as an SSSTwitter-style alternative with a cleaner UI and the replace-domain shortcut. See the SSSTwitter alternative page for a factual overview.`,
        ],
      },
    ],
    faqs: [
      {
        q: "Is this Twitter video downloader free?",
        a: "Yes.",
      },
      {
        q: "Do you add a watermark?",
        a: "No. We save the media X already provides for public posts.",
      },
      {
        q: "SSSTwitter alternative?",
        a: `Yes — many people use ${BRAND} as a cleaner alternative. See our comparison page.`,
      },
      {
        q: "Do I need to install an app?",
        a: "No. The website works in any modern browser. Installing the PWA is optional.",
      },
    ],
    related: [
      { href: "/ssstwitter-alternative", label: "SSSTwitter alternative" },
      { href: "/download-twitter-video", label: "Download Twitter video" },
      { href: "/guides/save-x-videos-without-app", label: "Save without installing an app" },
      { href: "/guides", label: "All guides" },
      { href: "/about", label: "About SaveTheX" },
    ],
  } satisfies LandingConfig,
  sssAlt: {
    path: "/ssstwitter-alternative",
    title: "SSSTwitter Alternative — Free X Video Downloader",
    description: `${BRAND} (${SITE_DOMAIN}) is a free SSSTwitter alternative for downloading public X / Twitter videos, GIFs, and ended Live replays — with a replace-domain shortcut.`,
    h1: "SSSTwitter alternative",
    intro: `If you’re searching for an SSSTwitter alternative, ${BRAND} downloads public X / Twitter media with a modern UI, optional mobile PWA share, and a domain-swap shortcut.`,
    keywords: [
      "ssstwitter alternative",
      "ssstwitter",
      "twitter video downloader alternative",
      "savethex",
    ],
    bullets: [
      "Free public-post downloader in the same category as SSSTwitter-style tools",
      "Replace x.com with savethex.com for instant downloads",
      "Ended Live replay support with server-side remux",
      "No account required",
    ],
    sections: [
      {
        heading: "What overlaps with SSSTwitter-style tools",
        paragraphs: [
          "Paste a public post URL, get MP4 downloads, no account. That workflow is familiar if you’ve used SSSTwitter or similar sites.",
        ],
      },
      {
        heading: "What SaveTheX emphasizes",
        paragraphs: [
          "A replace-domain shortcut (x.com → savethex.com), optional PWA share target, and clearer support messaging for ended Live replays versus currently running streams.",
          "We do not claim to be endorsed by SSSTwitter or X Corp. Choose whichever tool fits your needs.",
        ],
      },
    ],
    faqs: [
      {
        q: "How is SaveTheX different?",
        a: "We focus on a clean UI, optional PWA share-to-download, ended Live remux on the server, and the replace-domain shortcut.",
      },
      {
        q: "Can I download the same posts?",
        a: "If the post is public and contains media, yes — paste the link or swap the domain.",
      },
      {
        q: "Does SaveTheX download currently live streams?",
        a: "No. SaveTheX supports ended public Live replays, not currently running streams.",
      },
    ],
    related: [
      { href: "/twitter-video-downloader", label: "Twitter video downloader" },
      { href: "/download-x-video", label: "Download X video" },
      { href: "/x-live-downloader", label: "X Live replay downloader" },
      { href: "/guides/how-to-download-x-videos", label: "How to download X videos" },
      { href: "/about", label: "About SaveTheX" },
    ],
  } satisfies LandingConfig,
  gifDownloader: {
    path: "/x-gif-downloader",
    title: "X / Twitter GIF Downloader — Save GIFs as MP4",
    description: `Download X and Twitter GIFs as MP4 with ${BRAND}. ${ENTITY_ONE_LINER} Public GIFs only — free, no account.`,
    h1: "X / Twitter GIF downloader",
    intro: `X usually serves “GIFs” as short looping videos. ${BRAND} lists that MP4 so you can save and share it like any other clip.`,
    keywords: [
      "x gif downloader",
      "download twitter gif",
      "save x gif",
      "twitter gif to mp4",
      "download x gif",
    ],
    bullets: [
      "Save public X / Twitter GIFs as MP4",
      "Same paste or replace-domain workflow as videos",
      "No watermark added by SaveTheX",
      "Works on desktop and mobile browsers",
    ],
    sections: [
      {
        heading: "Why GIFs download as MP4",
        paragraphs: [
          "X typically encodes GIFs as short, silent MP4 loops. That is better for quality and size than a classic animated GIF file.",
          `${BRAND} exposes the MP4 X already serves for that public post.`,
        ],
      },
      {
        heading: "How to download an X GIF",
        paragraphs: [
          `Open the public post, copy its URL, paste it on ${SITE_DOMAIN} (or swap x.com for savethex.com), tap Get media, then download the available MP4.`,
        ],
      },
    ],
    faqs: [
      {
        q: "Can SaveTheX download GIFs?",
        a: "Yes. When X serves a GIF as a short looping video, SaveTheX exposes an MP4 download.",
      },
      {
        q: "Will I get a .gif file?",
        a: "Usually you get an MP4 loop, which is how X stores most GIFs.",
      },
      {
        q: "Do private GIF posts work?",
        a: "No. Only public posts are supported.",
      },
    ],
    related: [
      { href: "/guides/download-twitter-gif", label: "GIF download guide" },
      { href: "/download-x-video", label: "Download X video" },
      { href: "/twitter-video-downloader", label: "Twitter video downloader" },
      { href: "/about", label: "About SaveTheX" },
    ],
  } satisfies LandingConfig,
  liveDownloader: {
    path: "/x-live-downloader",
    title: "X Live Downloader — Save Ended Live Replays as MP4",
    description: `Download ended public X Live broadcasts and replays as MP4 with ${BRAND}. Currently running live streams are not supported until a public replay exists.`,
    h1: "X Live replay downloader",
    intro: `${BRAND} can download ended public X Live broadcasts and replays as MP4. This page is for Live replay downloads — not for capturing a stream that is still live.`,
    keywords: [
      "x live downloader",
      "twitter live downloader",
      "download x live replay",
      "save ended x broadcast",
      "twitter broadcast downloader",
      "download x live",
    ],
    bullets: [
      "Ended public Live / broadcast replays → MP4",
      "Server remuxes HLS before the file download starts",
      "Multiple qualities when X provides them",
      "Same paste or x.com → savethex.com shortcut",
    ],
    sections: [
      {
        heading: "What is supported",
        paragraphs: [
          "SaveTheX can download ended public X Live broadcasts and replays linked from a public post.",
          "Currently running live streams are not supported until the broadcast ends and a public replay is available.",
        ],
      },
      {
        heading: "How Live remux works",
        paragraphs: [
          "Live replays are often delivered as HLS segments. SaveTheX remuxes them to a finished MP4 on the server, then starts a normal download of that file.",
          "Keep the tab open while you see “Preparing full video…”. Opening an incomplete file can make players show only the first few seconds.",
        ],
      },
      {
        heading: "Steps",
        paragraphs: [
          `Paste the public post URL that links the ended Live on ${SITE_DOMAIN}, or replace x.com with savethex.com.`,
          "Tap Get media, choose a quality, wait for preparation to finish, then download the MP4.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can SaveTheX download X Live videos?",
        a: "SaveTheX can download ended public X Live broadcasts and replays. Currently running live streams are not supported until a public replay exists.",
      },
      {
        q: "Can I download an X Live replay?",
        a: "Yes. Paste the public post URL for the ended broadcast, choose a quality, and wait for the server remux to finish before downloading.",
      },
      {
        q: "Why was my Live download only a few seconds long?",
        a: "That usually means the file was opened or saved before remux finished. Keep the tab open until preparation completes, then download the finished MP4.",
      },
      {
        q: "Is this a Twitter Live / broadcast downloader?",
        a: "Yes for ended public broadcasts/replays. It is not a tool for capturing an ongoing live stream in real time.",
      },
    ],
    related: [
      { href: "/guides/download-x-live-replay", label: "How to download an X Live replay" },
      { href: "/download-x-video", label: "Download X video" },
      { href: "/guides/replace-domain-trick", label: "URL shortcut guide" },
      { href: "/about", label: "About SaveTheX" },
    ],
  } satisfies LandingConfig,
};
