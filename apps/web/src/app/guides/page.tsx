import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { guides } from "@/lib/guides";
import { BRAND, SITE_DOMAIN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides — download X videos, GIFs & live replays",
  description: `How-to guides for ${BRAND} on ${SITE_DOMAIN}: download X videos, GIFs, live replays, and use the replace-domain shortcut.`,
  alternates: { canonical: "/guides" },
  openGraph: {
    title: `Guides · ${BRAND}`,
    description: `Practical guides for saving public X / Twitter media with ${BRAND}.`,
    url: "/guides",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / Guides
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
          <BookOpen className="h-5 w-5" aria-hidden />
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Guides
        </h1>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Short, practical articles to help you download public X media with {BRAND} —
        and help search engines understand what {SITE_DOMAIN} does.
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group block rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <p className="text-xs text-muted-foreground">
                Updated {guide.updatedAt}
              </p>
              <h2 className="mt-1 flex items-center justify-between gap-3 text-lg font-semibold text-foreground">
                <span>{guide.title}</span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {guide.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
