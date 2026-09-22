import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BRAND, getSiteHost } from "@/lib/site";
import { getHomeFaqs } from "@/lib/seo";

const siteHost = getSiteHost();
const faqs = getHomeFaqs();

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

export function ContentSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-3 py-12 sm:space-y-20 sm:px-6 sm:py-20">
      <section aria-labelledby="how-heading" id="how-to">
        <h2
          id="how-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Three ways to download
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:mt-3 sm:text-base">
          Pick whichever is fastest for how you use X.
        </p>
        <ol className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="glass rounded-2xl p-4 transition hover:border-accent/40 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {index + 1}
                  </p>
                </div>
                <h3 className="mt-3 text-base font-semibold text-foreground sm:mt-4">
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
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          How it works
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-3">
          When you open a magic link or paste a URL, we validate the public post ID,
          extract media metadata, and list downloadable qualities. Short-lived signed
          tokens stream the file so arbitrary URLs are never fetched from the browser.
        </p>
      </section>

      <section aria-labelledby="supported-heading" id="supported">
        <h2
          id="supported-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Supported links
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3">
          Links must include <code className="text-foreground">/status/</code>. X hosts
          and your replace-domain links both work:
        </p>
        <ul className="mt-4 space-y-2 font-mono text-[11px] text-muted-foreground sm:text-sm">
          {supported.map((item) => (
            <li
              key={item}
              className="break-all rounded-lg border border-border bg-surface px-3 py-2"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="privacy-heading" id="privacy-note">
        <h2
          id="privacy-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Privacy
        </h2>
        <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:mt-4">
          <li>No account required.</li>
          <li>The service only processes the URL you enter.</li>
          <li>Downloaded videos are not permanently stored on our servers.</li>
          <li>Recent downloads live only on your device (localStorage).</li>
          <li>Only public posts are supported.</li>
        </ul>
      </section>

      <section aria-labelledby="guides-heading" id="guides">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <BookOpen className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2
              id="guides-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Guides
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-3">
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
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface sm:mt-8">
          {faqs.map((item) => (
            <details key={item.q} className="group px-4 py-3.5 sm:px-5 sm:py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                  <ChevronDown
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180"
                    aria-hidden
                  />
                </span>
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
