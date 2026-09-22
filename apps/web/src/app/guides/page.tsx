import type { Metadata } from "next";
import Link from "next/link";
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
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
        Guides
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Short, practical articles to help you download public X media with {BRAND} —
        and help search engines understand what {SITE_DOMAIN} does.
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="block rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <p className="text-xs text-muted-foreground">
                Updated {guide.updatedAt}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {guide.title}
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
