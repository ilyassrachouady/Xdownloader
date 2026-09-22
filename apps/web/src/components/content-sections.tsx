import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BRAND, getSiteHost } from "@/lib/site";

const siteHost = getSiteHost();

const steps = [
  {
    icon: Sparkles,
    title: "Replace the domain",
    body: `Change x.com to ${siteHost} and keep the rest of the link. Opens with the download ready.`,
  },
  {
    icon: Share2,
    title: "Share from mobile",
    body: `On iOS/Android, share a post to ${BRAND} (installed as PWA) and we handle the URL.`,
  },
  {
    icon: ShieldCheck,
    title: "Choose a quality",
    body: "Get the best quality with one tap, or expand for other resolutions. Live replays remux to MP4.",
  },
];

const supported = [
  "https://x.com/username/status/123456789",
  "https://twitter.com/username/status/123456789",
  `https://${siteHost}/username/status/123456789`,
  "https://mobile.twitter.com/username/status/123456789",
];

const faqs = [
  {
    q: "What’s the fastest way to download?",
    a: `Replace x.com (or twitter.com) with ${siteHost} in the post URL. Keep /username/status/... unchanged and open the new link.`,
  },
  {
    q: `Can I install ${BRAND} on my phone?`,
    a: `Yes. Add to Home Screen on iOS or Install App on Android. Once installed, you can share X posts directly to ${BRAND} and download instantly.`,
  },
  {
    q: "Can I download X live replays?",
    a: "Yes. Ended live broadcasts / replays linked from a public post are supported. They’re remuxed to MP4, so longer lives take a bit to prepare — keep the tab open.",
  },
  {
    q: "How do I download a video from X?",
    a: "Paste the public post URL at the top of this page, tap Get media, then Save video — or use the replace-domain shortcut.",
  },
  {
    q: "Does this work with Twitter links?",
    a: "Yes. Classic twitter.com and newer x.com links both work as long as the post is public and includes media.",
  },
  {
    q: "Can I download X GIFs?",
    a: "When X serves a GIF as a short looping video (the usual case), we expose an MP4 download so you can save it.",
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
];

export function ContentSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-20 sm:px-6">
      <section aria-labelledby="how-heading" id="how-to">
        <h2
          id="how-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Three ways to download
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pick whichever is fastest for how you use X.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="glass rounded-2xl p-5 transition hover:border-accent/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {index + 1}
                  </p>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="works-heading" id="how-it-works">
        <h2
          id="works-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          How it works
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          When you open a magic link or paste a URL, we validate the public post ID,
          extract media metadata, and list downloadable qualities. Short-lived signed
          tokens stream the file so arbitrary URLs are never fetched from the browser.
        </p>
      </section>

      <section aria-labelledby="supported-heading" id="supported">
        <h2
          id="supported-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Supported links
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Links must include <code className="text-foreground">/status/</code>. X hosts
          and your replace-domain links both work:
        </p>
        <ul className="mt-4 space-y-2 font-mono text-xs text-muted-foreground sm:text-sm">
          {supported.map((item) => (
            <li key={item} className="rounded-lg border border-border bg-surface px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="privacy-heading" id="privacy-note">
        <h2
          id="privacy-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Privacy
        </h2>
        <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>No account required.</li>
          <li>The service only processes the URL you enter.</li>
          <li>Downloaded videos are not permanently stored on our servers.</li>
          <li>Recent downloads live only on your device (localStorage).</li>
          <li>Only public posts are supported.</li>
        </ul>
      </section>

      <section aria-labelledby="guides-heading" id="guides">
        <div className="flex items-start gap-3">
          <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <BookOpen className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h2
              id="guides-heading"
              className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Guides
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Step-by-step articles for downloading videos, GIFs, live replays, and using the
              replace-domain shortcut.{" "}
              <Link
                href="/guides"
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
              >
                Browse all guides
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-heading" id="faq">
        <h2
          id="faq-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {faqs.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180"
                    aria-hidden
                  />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
