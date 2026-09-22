import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CONTACT_EMAIL, SITE_DOMAIN, getSiteHost } from "@/lib/site";
import {
  ENTITY_DESCRIPTION,
  ENTITY_ONE_LINER,
  breadcrumbJsonLd,
  organizationJsonLd,
  webpageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const host = getSiteHost();

export const metadata: Metadata = {
  title: `About ${BRAND} — X/Twitter video & Live replay downloader`,
  description: ENTITY_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${BRAND}`,
    description: ENTITY_DESCRIPTION,
    url: "/about",
    type: "website",
    siteName: BRAND,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: BRAND }],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${BRAND}`,
    description: ENTITY_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    webpageJsonLd({
      path: "/about",
      name: `About ${BRAND}`,
      description: ENTITY_DESCRIPTION,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ];

  return (
    <article className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / About
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-4xl">
        About {BRAND}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {ENTITY_ONE_LINER} You may also see it written as Save The X, savethex, or{" "}
        {SITE_DOMAIN}.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            What SaveTheX supports
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Public X / Twitter videos as MP4</li>
            <li>Public X / Twitter GIFs (usually saved as MP4 loops)</li>
            <li>Ended public X Live broadcasts and replays as MP4</li>
            <li>Multiple qualities when X provides them</li>
          </ul>
          <p className="mt-3">
            Currently running live streams are not supported until the broadcast ends and a
            public replay exists. Private or protected posts are not supported.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            How it works
          </h2>
          <p className="mt-3">
            You paste a public post URL (or open a replace-domain link). SaveTheX validates
            the post, extracts public media metadata, and lists downloadable qualities.
            Short-lived signed tokens are used to stream files. For ended Live replays, the
            server remuxes HLS into a finished MP4 before the download starts.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            The x.com → {host} shortcut
          </h2>
          <p className="mt-3">
            To download faster, replace <span className="text-foreground">x.com</span> with{" "}
            <span className="text-accent">{host}</span> in a public status URL. Keep{" "}
            <code className="text-foreground">/username/status/…</code> unchanged.
          </p>
          <p className="mt-2 font-mono text-xs text-foreground sm:text-sm">
            https://x.com/user/status/ID → https://{host}/user/status/ID
          </p>
          <p className="mt-2">
            <Link href="/guides/replace-domain-trick" className="text-accent hover:underline">
              Read the shortcut guide
            </Link>
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            Why it exists
          </h2>
          <p className="mt-3">
            People often want a straightforward way to save public X media as MP4 — including
            GIFs and ended Live replays — without creating an account or installing a heavy
            app. SaveTheX focuses on that workflow.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            Privacy and data handling
          </h2>
          <p className="mt-3">
            SaveTheX does not require an account. The public post URL you submit is sent to
            the extraction service to resolve media. Downloaded video files are not permanently
            stored on our servers. Recent downloads may be remembered in your browser’s
            localStorage. Anonymous usage analytics may be collected via Vercel Analytics.
            Details:{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            Relationship with X Corp
          </h2>
          <p className="mt-3">
            {BRAND} is an independent tool and is not affiliated with, endorsed by, or
            connected to X Corp. or Twitter. Users are responsible for respecting copyright
            and platform rules.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground sm:text-xl">
            Explore
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/" className="text-accent hover:underline">
                Open the downloader
              </Link>
            </li>
            <li>
              <Link href="/x-live-downloader" className="text-accent hover:underline">
                X Live replay downloader
              </Link>
            </li>
            <li>
              <Link href="/x-gif-downloader" className="text-accent hover:underline">
                X GIF downloader
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-accent hover:underline">
                Guides
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
